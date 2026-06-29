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

  const markComplete = useCallback(
    async (changId: string) => {
      if (!userId) return;
      const key = progressQueryKey(userId);
      // Snapshot before optimistic update for rollback
      const snapshot = queryClient.getQueryData<Map<string, ChangProgress>>(key);
      queryClient.setQueryData(key, (prev: Map<string, ChangProgress> | undefined) => {
        const next = new Map(prev ?? []);
        next.set(changId, { noiDungIndex: next.get(changId)?.noiDungIndex ?? 0, isCompleted: true });
        return next;
      });
      const { error } = await supabase
        .from("user_progress")
        .upsert(
          { user_id: userId, chang_id: changId, completed_at: new Date().toISOString() },
          { onConflict: "user_id,chang_id" },
        );
      if (error) {
        queryClient.setQueryData(key, snapshot);
        console.error("Failed to save completion:", error);
      } else {
        // DB trigger updates profiles.completed_count — invalidate dependent caches
        queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
        queryClient.invalidateQueries({ queryKey: ["streak", userId] });
        queryClient.invalidateQueries({ queryKey: ["public-profile"] });
      }
    },
    [userId, queryClient],
  );

  const savePosition = useCallback(
    async (changId: string, noiDungIndex: number) => {
      if (!userId) return;
      const key = progressQueryKey(userId);
      const snapshot = queryClient.getQueryData<Map<string, ChangProgress>>(key);
      queryClient.setQueryData(key, (prev: Map<string, ChangProgress> | undefined) => {
        const next = new Map(prev ?? []);
        const existing = next.get(changId);
        next.set(changId, { noiDungIndex, isCompleted: existing?.isCompleted ?? false });
        return next;
      });
      const { error } = await supabase
        .from("user_progress")
        .upsert(
          { user_id: userId, chang_id: changId, noidung_index: noiDungIndex },
          { onConflict: "user_id,chang_id" },
        );
      if (error) {
        queryClient.setQueryData(key, snapshot);
        console.error("Failed to save position:", error);
      }
    },
    [userId, queryClient],
  );

  // Called when an anonymous user logs in — merges their local session progress into the DB.
  // Completed stages are always upserted. In-progress stages are inserted only if no DB row
  // exists yet (ignoreDuplicates) to avoid overwriting further DB progress with local.
  const mergeLocalProgress = useCallback(
    async (localMap: Map<string, ChangProgress>) => {
      if (!userId || localMap.size === 0) return;

      const completedRows: { user_id: string; chang_id: string; noidung_index: number; completed_at: string }[] = [];
      const inProgressRows: { user_id: string; chang_id: string; noidung_index: number; completed_at: null }[] = [];

      localMap.forEach((prog, changId) => {
        if (prog.isCompleted) {
          completedRows.push({ user_id: userId, chang_id: changId, noidung_index: prog.noiDungIndex, completed_at: new Date().toISOString() });
        } else {
          inProgressRows.push({ user_id: userId, chang_id: changId, noidung_index: prog.noiDungIndex, completed_at: null });
        }
      });

      const ops: Promise<void>[] = [];
      if (completedRows.length > 0) {
        ops.push(
          Promise.resolve(
            supabase.from("user_progress").upsert(completedRows, { onConflict: "user_id,chang_id" })
          ).then(({ error }) => { if (error) console.error("Merge completed error:", error); }),
        );
      }
      if (inProgressRows.length > 0) {
        ops.push(
          Promise.resolve(
            supabase.from("user_progress").upsert(inProgressRows, { onConflict: "user_id,chang_id", ignoreDuplicates: true })
          ).then(({ error }) => { if (error) console.error("Merge in-progress error:", error); }),
        );
      }
      await Promise.all(ops);
      // Refetch progress and invalidate dependent caches
      await queryClient.invalidateQueries({ queryKey: progressQueryKey(userId) });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["streak", userId] });
      queryClient.invalidateQueries({ queryKey: ["public-profile"] });
    },
    [userId, queryClient],
  );

  return {
    progressMap: progressMap ?? new Map<string, ChangProgress>(),
    isProgressLoading: isLoading && userId != null,
    markComplete,
    savePosition,
    mergeLocalProgress,
  };
}
