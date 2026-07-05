import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useUserProgress } from "@/hooks/useUserProgress";
import type { ChangProgress } from "@/hooks/useUserProgress";

const LOCAL_PROGRESS_KEY = "vui-hoc-progress";
const LOCAL_PROGRESS_QUERY_KEY = ["local-progress"] as const;

function loadLocalProgress(): Map<string, ChangProgress> {
  try {
    const raw = localStorage.getItem(LOCAL_PROGRESS_KEY);
    if (!raw) return new Map();
    return new Map(JSON.parse(raw) as [string, ChangProgress][]);
  } catch {
    return new Map();
  }
}

function persistLocalProgress(map: Map<string, ChangProgress>) {
  try {
    localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(Array.from(map.entries())));
  } catch {
    // localStorage unavailable (private browsing, quota exceeded, etc.)
  }
}

export function useLearningProgress() {
  const { user, isLoading: authIsLoading } = useAuth();
  const { progressMap, isProgressLoading, markComplete, savePosition, mergeLocalProgress } = useUserProgress(user?.id ?? null);
  const queryClient = useQueryClient();
  // Shared across all hook instances via the QueryClient cache, so completing a
  // stage in one mounted component (e.g. LessonPage) is immediately reflected
  // in others (e.g. the roadmap) without a page refresh.
  const { data: localProgressMap = new Map<string, ChangProgress>() } = useQuery({
    queryKey: LOCAL_PROGRESS_QUERY_KEY,
    queryFn: loadLocalProgress,
    enabled: !user,
    staleTime: Infinity,
  });
  const activeProgressMap = user ? progressMap : localProgressMap;

  const setLocalProgressMap = (updater: (prev: Map<string, ChangProgress>) => Map<string, ChangProgress>) => {
    queryClient.setQueryData<Map<string, ChangProgress>>(LOCAL_PROGRESS_QUERY_KEY, (prev) => updater(prev ?? new Map()));
  };

  // Persist anonymous progress to localStorage whenever it changes
  useEffect(() => {
    if (!user) persistLocalProgress(localProgressMap);
  }, [localProgressMap, user]);

  // Merge anonymous progress into DB when user logs in, then clear localStorage
  const prevUserIdRef = useRef<string | null>(null);
  useEffect(() => {
    const prevId = prevUserIdRef.current;
    const currentId = user?.id ?? null;
    prevUserIdRef.current = currentId;
    if (currentId && !prevId && localProgressMap.size > 0) {
      mergeLocalProgress(localProgressMap).then(() => {
        setLocalProgressMap(() => new Map());
        try { localStorage.removeItem(LOCAL_PROGRESS_KEY); } catch { /* ignore */ }
      });
    }
  }, [user?.id]);

  const markChangComplete = (changId: string, noiDungIndex: number) => {
    if (user) {
      markComplete(changId);
    } else {
      setLocalProgressMap((prev) => {
        const next = new Map(prev);
        next.set(changId, { noiDungIndex, isCompleted: true });
        return next;
      });
    }
  };

  const saveChangPosition = (changId: string, noiDungIndex: number, isCompleted: boolean) => {
    if (user) {
      savePosition(changId, noiDungIndex);
    } else {
      setLocalProgressMap((prev) => {
        const next = new Map(prev);
        next.set(changId, { noiDungIndex, isCompleted });
        return next;
      });
    }
  };

  return {
    user,
    authIsLoading,
    activeProgressMap,
    isProgressLoading,
    markChangComplete,
    saveChangPosition,
  };
}
