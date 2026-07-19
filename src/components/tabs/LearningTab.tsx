import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  learningImagesQueryOptions,
  learningStructureQueryOptions,
  quyen1ChuDes,
} from "@/lib/learning";
import { RoadmapList } from "@/components/learning/RoadmapList";
import { RoadmapSkeleton } from "@/components/learning/RoadmapSkeleton";
import { buildSlides } from "@/components/learning/LessonPage";
import { ConfettiBurst } from "@/components/learning/ConfettiBurst";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { Button } from "@/components/ui/button";

export const BUFFALO_POS_KEY = "vui-hoc-buffalo-pos";

export type BuffaloPos = { chuDeIndex: number; changIndex: number };

export function loadBuffaloPos(): BuffaloPos | null {
  try {
    const raw = sessionStorage.getItem(BUFFALO_POS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BuffaloPos;
  } catch {
    return null;
  }
}

function saveBuffaloPos(pos: BuffaloPos) {
  try {
    sessionStorage.setItem(BUFFALO_POS_KEY, JSON.stringify(pos));
  } catch {
    // sessionStorage unavailable
  }
}

export function LearningTab({ chuDeIndex: currentChuDeIndex }: { chuDeIndex: number }) {
  const { data: allChuDes, isLoading, error } = useQuery(learningStructureQueryOptions);
  const navigate = useNavigate();

  // The roadmap only ever shows Quyển 1's chủ đề; the rest of the `chude` table belongs to
  // Quyển 2. Narrowing once here keeps every count below (progress, celebration) on-book.
  const data = useMemo(() => (allChuDes ? quyen1ChuDes(allChuDes) : undefined), [allChuDes]);

  const queryClient = useQueryClient();

  // The roadmap loads a lightweight, image-free payload so its skeleton clears fast. Once it's
  // up, warm just the image table in the background during idle time so opening an actual lesson
  // is instant. Only `hinh` is fetched here — the structural tables are already cached from the
  // roadmap's own query, so nothing gets downloaded twice.
  useEffect(() => {
    if (isLoading) return;
    const prefetch = () => queryClient.prefetchQuery(learningImagesQueryOptions);
    const ric = window.requestIdleCallback;
    if (ric) {
      const handle = ric(prefetch);
      return () => window.cancelIdleCallback?.(handle);
    }
    const t = setTimeout(prefetch, 1500);
    return () => clearTimeout(t);
  }, [isLoading, queryClient]);

  // The chủ đề itself now lives in the URL (source of truth). The stage *within* that chủ đề
  // isn't part of the URL, so it's still seeded from the last-saved position (if any) — but
  // only when that saved position actually belongs to the topic we're mounting on, otherwise
  // it'd bleed a stage index from a different chủ đề into this one.
  const seedChangIndex = () => {
    const saved = loadBuffaloPos();
    return saved && saved.chuDeIndex === currentChuDeIndex ? saved.changIndex : 0;
  };
  const [currentChangIndex, setCurrentChangIndex] = useState(seedChangIndex);
  const { authIsLoading, activeProgressMap, isProgressLoading } = useLearningProgress();

  // Restore the stage *within* the current chủ đề once data + progress are ready. The chủ đề
  // itself is pinned by the URL (source of truth), so this never navigates to a *different* chủ
  // đề — refreshing or deep-linking to a chủ đề keeps you exactly there. Cross-chủ-đề "resume
  // where you left off" is the job of the "/hoc-tap/quyen-1" index redirect, not this effect.
  // Stage priority: last-opened stage (sessionStorage) → first in-progress / incomplete → last.
  const hasRestoredRef = useRef(false);
  useEffect(() => {
    if (hasRestoredRef.current || !data || authIsLoading || isProgressLoading) return;
    hasRestoredRef.current = true;

    const setStage = (changIdx: number) => {
      setCurrentChangIndex(changIdx);
    };

    const firstIncompleteWithin = (ti: number) => {
      const topicChangs = data[ti]?.changs ?? [];
      const inProgress = topicChangs.findIndex((ch) => {
        const prog = activeProgressMap.get(ch.id);
        return prog && !prog.isCompleted && prog.noiDungIndex > 0;
      });
      if (inProgress !== -1) return inProgress;
      const firstIncomplete = topicChangs.findIndex(
        (ch) => !activeProgressMap.get(ch.id)?.isCompleted,
      );
      if (firstIncomplete !== -1) return firstIncomplete;
      return Math.max(0, topicChangs.length - 1);
    };

    // Prefer the stage the user last opened (saved in sessionStorage by openChang), but only
    // when it belongs to the chủ đề we're actually on and isn't already completed/locked.
    const saved = loadBuffaloPos();
    if (
      saved &&
      saved.chuDeIndex === currentChuDeIndex &&
      saved.changIndex < (data[currentChuDeIndex]?.changs.length ?? 0)
    ) {
      const savedChangs = data[currentChuDeIndex].changs;
      const savedChang = savedChangs[saved.changIndex];
      const savedProg = activeProgressMap.get(savedChang.id);
      const prevChangId = saved.changIndex > 0 ? savedChangs[saved.changIndex - 1]?.id : null;
      const isLocked = prevChangId ? !activeProgressMap.get(prevChangId)?.isCompleted : false;
      if (!savedProg?.isCompleted && !isLocked) {
        setStage(saved.changIndex);
        return;
      }
      // Saved stage is completed or locked — discard stale position
      try {
        sessionStorage.removeItem(BUFFALO_POS_KEY);
      } catch {
        /* ignore */
      }
    }

    setStage(firstIncompleteWithin(currentChuDeIndex));
  }, [data, authIsLoading, isProgressLoading, activeProgressMap, currentChuDeIndex]);

  const chuDes = useMemo(() => (data ?? []).map((d) => d.chuDe), [data]);

  // A chủ đề the book plans for but the DB has no content for yet renders as "coming soon".
  const availableCount = chuDes.length;
  const currentTopic = chuDes[currentChuDeIndex] ?? chuDes[0];
  const isCurrentLocked = currentChuDeIndex >= availableCount;

  const changs = useMemo(() => data?.[currentChuDeIndex]?.changs ?? [], [data, currentChuDeIndex]);
  const changTitles = useMemo(() => changs.map((s) => s.title), [changs]);
  const changEmojis = useMemo(() => changs.map((s) => s.emoji), [changs]);

  const completedByChuDe = useMemo<Record<number, number[]>>(() => {
    if (!data) return {};
    const result: Record<number, number[]> = {};
    data.forEach((chuDeData, chuDeIdx) => {
      result[chuDeIdx] = chuDeData.changs
        .map((ch, changIdx) => (activeProgressMap.get(ch.id)?.isCompleted ? changIdx : -1))
        .filter((idx) => idx !== -1);
    });
    return result;
  }, [data, activeProgressMap]);

  const completedChangs = useMemo(
    () => new Set(completedByChuDe[currentChuDeIndex] ?? []),
    [completedByChuDe, currentChuDeIndex],
  );

  // "X/Y bài" tracks flattened slides (one per bai) — not raw noiDung steps, which are
  // usually fewer and give a wrong count. Completed changs show total/total (full bar).
  const changProgress = useMemo(() => {
    const map = new Map<number, { current: number; total: number }>();
    changs.forEach((ch, i) => {
      const slides = buildSlides(ch.noiDungs);
      const total = slides.length;
      if (total === 0) return;
      const prog = activeProgressMap.get(ch.id);
      if (prog?.isCompleted) {
        map.set(i, { current: total, total });
      } else if (prog) {
        const firstOfStep = slides.findIndex((s) => s.ndIndex === prog.noiDungIndex);
        const current = firstOfStep !== -1 ? firstOfStep + 1 : 1;
        map.set(i, { current: Math.min(current, total), total });
      }
    });
    return map;
  }, [changs, activeProgressMap]);

  // A stage is "started" if it has a saved progress record that isn't completed yet
  const startedChangs = useMemo(
    () =>
      new Set(
        changs
          .map((ch, i) => ({ ch, i }))
          .filter(({ ch }) => {
            const prog = activeProgressMap.get(ch.id);
            return prog !== undefined && !prog.isCompleted;
          })
          .map(({ i }) => i),
      ),
    [changs, activeProgressMap],
  );

  const openChang = (i: number) => {
    if (i < 0 || i >= changs.length) return;
    const chang = changs[i];
    setCurrentChangIndex(i);
    saveBuffaloPos({ chuDeIndex: currentChuDeIndex, changIndex: i });
    navigate({ to: "/hoc-tap/quyen-1/$changId", params: { changId: chang.id } });
  };

  // One-time celebration when the entire roadmap is complete.
  const CELEBRATION_SEEN_KEY = "vui-hoc-celebration-seen";
  const totalStages = useMemo(
    () => (data ?? []).reduce((sum, d) => sum + d.changs.length, 0),
    [data],
  );
  const totalCompleted = useMemo(
    () => Object.values(completedByChuDe).reduce((s, a) => s + a.length, 0),
    [completedByChuDe],
  );
  const allEverythingDone = totalStages > 0 && totalCompleted >= totalStages;
  const [showCelebration, setShowCelebration] = useState(false);
  useEffect(() => {
    if (!allEverythingDone) return;
    try {
      if (localStorage.getItem(CELEBRATION_SEEN_KEY)) return;
    } catch {
      /* ignore */
    }
    setShowCelebration(true);
  }, [allEverythingDone]);
  const dismissCelebration = () => {
    setShowCelebration(false);
    try {
      localStorage.setItem(CELEBRATION_SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  if (isLoading || authIsLoading || isProgressLoading) {
    return (
      <section className="min-h-[70vh] w-full">
        <RoadmapSkeleton />
      </section>
    );
  }

  if (error || chuDes.length === 0 || !currentTopic) {
    return (
      <section className="flex min-h-[60vh] w-full items-center justify-center px-4 text-center text-navy">
        <div>
          <p className="font-display text-lg font-bold">Chưa có dữ liệu bài học.</p>
          {error ? (
            <p className="mt-2 text-sm text-muted-foreground">{(error as Error).message}</p>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full" id="roadmap-start">
      <div className="relative w-full">
        <RoadmapList
          chuDe={currentTopic}
          chuDeIndex={currentChuDeIndex}
          isLocked={isCurrentLocked}
          changTitles={changTitles}
          changEmojis={changEmojis}
          currentChangIndex={currentChangIndex}
          completedChangs={completedChangs}
          startedChangs={startedChangs}
          onOpenLesson={openChang}
          changProgress={changProgress}
        />
      </div>
      {showCelebration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md rounded-3xl border-2 border-black/10 bg-white p-8 text-center shadow-[0_4px_0_0_rgba(0,0,0,0.12)]">
            <ConfettiBurst
              onDone={() => {
                /* keep card visible until user dismisses */
              }}
            />
            <p className="font-display text-xl font-extrabold text-navy sm:text-2xl">
              🎉 Em đã hoàn thành cả lộ trình! Em giỏi lắm!
            </p>
            <Button variant="bevel" tone="stage-4" onClick={dismissCelebration} className="mt-6">
              Ôn tập lại
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
