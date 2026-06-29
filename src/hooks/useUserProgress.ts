import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ChangProgress = { noiDungIndex: number; isCompleted: boolean };

function progressQueryKey(userId: string) {
  return ["user-progress", userId] as const;
}

export function useUserProgress(userId: string | null) {
  const queryClient = useQueryClient();

  const { data: progressMap, isLoading } = useQuery({
    queryKey: userId ? progressQueryKey(userId) : ["user-progress-disabled"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_progress")
        .select("chang_id, noidung_index, completed_at");
      if (error) throw error;
      const map = new Map<string, ChangProgress>();
      for (const r of data) {
        map.set(r.chang_id, {
          noiDungIndex: r.noidung_index,
          isCompleted: r.completed_at != null,
        });
      }
      return map;
    },
    enabled: userId != null,
    staleTime: Infinity,
  });

  const upsertProgress = useCallback(
    async (changId: string, patch: { noidung_index?: number; completed_at?: string | null }) => {
      if (!userId) return;
      const { error } = await supabase
        .from("user_progress")
        .upsert({ user_id: userId, chang_id: changId, ...patch }, { onConflict: "user_id,chang_id" });
      if (error) {
        queryClient.invalidateQueries({ queryKey: progressQueryKey(userId) });
        console.error("Failed to save progress:", error);
      }
    },
    [userId, queryClient],
  );

  const markComplete = useCallback(
    (changId: string) => {
      if (!userId) return;
      queryClient.setQueryData(progressQueryKey(userId), (prev: Map<string, ChangProgress> | undefined) => {
        const next = new Map(prev ?? []);
        next.set(changId, { noiDungIndex: next.get(changId)?.noiDungIndex ?? 0, isCompleted: true });
        return next;
      });
      upsertProgress(changId, { completed_at: new Date().toISOString() });
    },
    [userId, queryClient, upsertProgress],
  );

  const savePosition = useCallback(
    (changId: string, noiDungIndex: number) => {
      if (!userId) return;
      queryClient.setQueryData(progressQueryKey(userId), (prev: Map<string, ChangProgress> | undefined) => {
        const next = new Map(prev ?? []);
        const existing = next.get(changId);
        next.set(changId, { noiDungIndex, isCompleted: existing?.isCompleted ?? false });
        return next;
      });
      upsertProgress(changId, { noidung_index: noiDungIndex });
    },
    [userId, queryClient, upsertProgress],
  );

  return {
    progressMap: progressMap ?? new Map<string, ChangProgress>(),
    isProgressLoading: isLoading && userId != null,
    markComplete,
    savePosition,
  };
}
