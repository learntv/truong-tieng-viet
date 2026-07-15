import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useSpeakingUserProgress } from "@/hooks/useSpeakingUserProgress";
import {
  clearSpeakingProgress,
  loadSpeakingProgress,
  recordSpeakingAttempt as recordLocalSpeakingAttempt,
  type SpeakingProgress,
} from "@/lib/speaking-progress";
import type { Stars } from "@/lib/speech";

const LOCAL_PROGRESS_QUERY_KEY = ["local-speaking-progress"] as const;

export function useSpeakingProgress() {
  const { user } = useAuth();
  const {
    progressMap: dbProgressMap,
    isProgressLoading,
    recordAttempt: recordDbAttempt,
    mergeLocalProgress,
  } = useSpeakingUserProgress(user?.id ?? null);
  const queryClient = useQueryClient();

  // Shared across all hook instances via the QueryClient cache, so an attempt
  // recorded in the practice screen is reflected immediately in the topic
  // picker's stats without a page refresh.
  const { data: localProgressMap = {}, isSuccess: isLocalProgressLoaded } = useQuery({
    queryKey: LOCAL_PROGRESS_QUERY_KEY,
    queryFn: loadSpeakingProgress,
    enabled: !user,
    staleTime: Infinity,
  });

  const progress: SpeakingProgress = user ? Object.fromEntries(dbProgressMap) : localProgressMap;

  // Merge anonymous progress into the DB when the user logs in, then clear
  // localStorage only if all upserts succeeded — same transition-detection
  // pattern as useLearningProgress.
  const prevUserIdRef = useRef<string | null>(null);
  useEffect(() => {
    const prevId = prevUserIdRef.current;
    const currentId = user?.id ?? null;
    prevUserIdRef.current = currentId;
    if (currentId && !prevId && isLocalProgressLoaded && Object.keys(localProgressMap).length > 0) {
      mergeLocalProgress(localProgressMap).then((ok) => {
        if (!ok) return;
        queryClient.setQueryData(LOCAL_PROGRESS_QUERY_KEY, {});
        clearSpeakingProgress();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, isLocalProgressLoaded]);

  const recordAttempt = (sentenceId: string, stars: Stars) => {
    if (user) {
      recordDbAttempt(sentenceId, stars);
    } else {
      const updated = recordLocalSpeakingAttempt(sentenceId, stars);
      queryClient.setQueryData(LOCAL_PROGRESS_QUERY_KEY, updated);
    }
  };

  return {
    progress,
    isProgressLoading: user ? isProgressLoading : !isLocalProgressLoaded,
    recordAttempt,
  };
}
