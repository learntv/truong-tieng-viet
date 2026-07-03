import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProgress } from "@/hooks/useUserProgress";
import type { ChangProgress } from "@/hooks/useUserProgress";

const LOCAL_PROGRESS_KEY = "vui-hoc-progress";

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
  const [localProgressMap, setLocalProgressMap] = useState<Map<string, ChangProgress>>(loadLocalProgress);
  const activeProgressMap = user ? progressMap : localProgressMap;

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
        setLocalProgressMap(new Map());
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
