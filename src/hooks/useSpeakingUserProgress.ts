import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Stars } from "@/lib/speech";
import type { SpeakingProgress, SpeakingStat } from "@/lib/speaking-progress";

function notifySaveFailed() {
  toast.error("Chưa lưu được tiến độ nói", {
    id: "speaking-progress-save-failed",
    description: "Em kiểm tra kết nối mạng rồi thử lại nhé!",
  });
}

function progressQueryKey(userId: string) {
  return ["speaking-progress", userId] as const;
}

export function useSpeakingUserProgress(userId: string | null) {
  const queryClient = useQueryClient();

  const { data: progressMap, isLoading } = useQuery({
    queryKey: userId ? progressQueryKey(userId) : ["speaking-progress-disabled"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("speaking_progress")
        .select("sentence_id, attempts, best_stars")
        .eq("user_id", userId!);
      if (error) throw error;
      const map = new Map<string, SpeakingStat>();
      for (const r of data) {
        map.set(r.sentence_id, { attempts: r.attempts, bestStars: r.best_stars as Stars });
      }
      return map;
    },
    enabled: userId != null,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const recordAttempt = useCallback(
    async (sentenceId: string, stars: Stars) => {
      if (!userId) return;
      const key = progressQueryKey(userId);
      const snapshot = queryClient.getQueryData<Map<string, SpeakingStat>>(key);
      const prevStat = snapshot?.get(sentenceId);
      const nextStat: SpeakingStat = {
        attempts: (prevStat?.attempts ?? 0) + 1,
        bestStars: Math.max(prevStat?.bestStars ?? 0, stars) as Stars,
      };
      queryClient.setQueryData(key, (prev: Map<string, SpeakingStat> | undefined) => {
        const next = new Map(prev ?? []);
        next.set(sentenceId, nextStat);
        return next;
      });
      const { error } = await supabase.from("speaking_progress").upsert(
        {
          user_id: userId,
          sentence_id: sentenceId,
          attempts: nextStat.attempts,
          best_stars: nextStat.bestStars,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,sentence_id" },
      );
      if (error) {
        queryClient.setQueryData(key, snapshot);
        console.error("Failed to save speaking attempt:", error);
        notifySaveFailed();
      }
    },
    [userId, queryClient],
  );

  // Called when an anonymous user logs in — merges their local practice stats into the DB.
  // Reads existing DB rows first so a sentence practiced on both this device and another
  // keeps the higher attempt count / star rating rather than one clobbering the other.
  const mergeLocalProgress = useCallback(
    async (localMap: SpeakingProgress): Promise<boolean> => {
      if (!userId) return true;
      const ids = Object.keys(localMap);
      if (ids.length === 0) return true;

      const { data: existingRows, error: fetchError } = await supabase
        .from("speaking_progress")
        .select("sentence_id, attempts, best_stars")
        .eq("user_id", userId)
        .in("sentence_id", ids);
      if (fetchError) {
        console.error("Speaking progress merge fetch error:", fetchError);
        toast.error("Một phần tiến độ nói cũ chưa lưu được vào tài khoản", {
          description: "Em kiểm tra mạng rồi tải lại trang nhé!",
        });
        return false;
      }
      const existingBySentence = new Map((existingRows ?? []).map((r) => [r.sentence_id, r]));

      const rows = ids.map((id) => {
        const local = localMap[id];
        const existing = existingBySentence.get(id);
        return {
          user_id: userId,
          sentence_id: id,
          attempts: Math.max(local.attempts, existing?.attempts ?? 0),
          best_stars: Math.max(local.bestStars, existing?.best_stars ?? 0),
          updated_at: new Date().toISOString(),
        };
      });

      const { error } = await supabase
        .from("speaking_progress")
        .upsert(rows, { onConflict: "user_id,sentence_id" });
      if (error) {
        console.error("Speaking progress merge upsert error:", error);
        toast.error("Một phần tiến độ nói cũ chưa lưu được vào tài khoản", {
          description: "Em kiểm tra mạng rồi tải lại trang nhé!",
        });
        return false;
      }

      await queryClient.invalidateQueries({ queryKey: progressQueryKey(userId) });
      return true;
    },
    [userId, queryClient],
  );

  return {
    progressMap: progressMap ?? new Map<string, SpeakingStat>(),
    isProgressLoading: isLoading && userId != null,
    recordAttempt,
    mergeLocalProgress,
  };
}
