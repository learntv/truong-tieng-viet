import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { learningDataQueryOptions } from "@/lib/learning";
import { RoadmapMap, NODE_POSITIONS } from "@/components/learning/RoadmapMap";
import { RoadmapSkeleton } from "@/components/learning/RoadmapSkeleton";
import { buildSlides } from "@/components/learning/LessonPage";
import { ConfettiBurst } from "@/components/learning/ConfettiBurst";
import { useLearningProgress } from "@/hooks/useLearningProgress";


const BUFFALO_POS_KEY = "vui-hoc-buffalo-pos";

type BuffaloPos = { chuDeIndex: number; changIndex: number };

function loadBuffaloPos(): BuffaloPos | null {
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

export function LearningTab() {
  const { data, isLoading, error } = useQuery(learningDataQueryOptions);
  const navigate = useNavigate();

  // Seed state from the last-saved position (if any) synchronously on mount, so the first
  // paint already lands on the right stage — otherwise the buffalo would render at index 0
  // for a frame and then visibly hop to its real position once the restore effect below runs.
  const [currentChuDeIndex, setCurrentChuDeIndex] = useState(() => loadBuffaloPos()?.chuDeIndex ?? 0);
  const [currentChangIndex, setCurrentChangIndex] = useState(() => loadBuffaloPos()?.changIndex ?? 0);
  const { authIsLoading, activeProgressMap, isProgressLoading } = useLearningProgress();

  const [selectedChangIndex, setSelectedChangIndex] = useState<number | null>(() => loadBuffaloPos()?.changIndex ?? null);
  const [buffaloChangIndex, setBuffaloChangIndex] = useState(() => loadBuffaloPos()?.changIndex ?? 0);

  // The roadmap renders exactly NODE_POSITIONS.length nodes per topic. A topic with more
  // stages in the DB silently hides the extras; fewer renders empty cards. Warn so a
  // content-shape change is caught in the console instead of by a confused user.
  useEffect(() => {
    if (!data) return;
    for (const { chuDe, changs: topicChangs } of data) {
      if (topicChangs.length !== NODE_POSITIONS.length) {
        console.warn(
          `[roadmap] Topic "${chuDe.title}" has ${topicChangs.length} stages but the map ` +
            `renders exactly ${NODE_POSITIONS.length} — extra stages are hidden, missing ones show empty cards.`,
        );
      }
    }
  }, [data]);

  // Restore position once data + progress are both ready.
  // Priority: last-opened stage (sessionStorage) → in-progress "đang học" stage → first incomplete → last stage.
  const hasRestoredRef = useRef(false);
  useEffect(() => {
    if (hasRestoredRef.current || !data || authIsLoading || isProgressLoading) return;
    hasRestoredRef.current = true;

    const restore = (chuDeIdx: number, changIdx: number) => {
      setCurrentChuDeIndex(chuDeIdx);
      setCurrentChangIndex(changIdx);
      setBuffaloChangIndex(changIdx);
      setSelectedChangIndex(changIdx);
    };

    // Prefer the stage the user last opened (saved in sessionStorage by openChang).
    // Reset clears sessionStorage explicitly, so no need to guard against stale data here.
    const saved = loadBuffaloPos();
    if (
      saved &&
      saved.chuDeIndex < data.length &&
      saved.changIndex < (data[saved.chuDeIndex]?.changs.length ?? 0)
    ) {
      const savedChangs = data[saved.chuDeIndex].changs;
      const savedChang = savedChangs[saved.changIndex];
      const savedProg = activeProgressMap.get(savedChang.id);
      const prevChangId = saved.changIndex > 0 ? savedChangs[saved.changIndex - 1]?.id : null;
      const isLocked = prevChangId ? !activeProgressMap.get(prevChangId)?.isCompleted : false;
      if (!savedProg?.isCompleted && !isLocked) {
        restore(saved.chuDeIndex, saved.changIndex);
        return;
      }
      // Saved stage is completed or locked — discard stale position
      try { sessionStorage.removeItem(BUFFALO_POS_KEY); } catch { /* ignore */ }
    }

    // Fall back to the in-progress "đang học" stage (has saved progress > slide 0)
    for (let ti = 0; ti < data.length; ti++) {
      const topicChangs = data[ti].changs;
      const inProgress = topicChangs.findIndex((ch) => {
        const prog = activeProgressMap.get(ch.id);
        return prog && !prog.isCompleted && prog.noiDungIndex > 0;
      });
      if (inProgress !== -1) { restore(ti, inProgress); return; }
    }

    // Fall back to first incomplete
    for (let ti = 0; ti < data.length; ti++) {
      const topicChangs = data[ti].changs;
      const firstIncomplete = topicChangs.findIndex((ch) => !activeProgressMap.get(ch.id)?.isCompleted);
      if (firstIncomplete !== -1) { restore(ti, firstIncomplete); return; }
    }

    // All done — land on the last stage of the last topic
    const lastTi = data.length - 1;
    restore(lastTi, Math.max(0, data[lastTi].changs.length - 1));
  }, [data, authIsLoading, isProgressLoading, activeProgressMap]);

  const chuDes = useMemo(() => (data ?? []).map((d) => d.chuDe), [data]);
  const chuDe = chuDes[currentChuDeIndex];
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

  // Lets a user switch to a different chủ đề to review it (any topic) or advance to the
  // next one (only once the current one is fully done) — the only way to do either, since
  // the map otherwise only auto-lands on a topic via the one-time restore effect above.
  const goToChuDe = (index: number) => {
    if (index < 0 || index >= chuDes.length || index === currentChuDeIndex) return;
    setCurrentChuDeIndex(index);
    setCurrentChangIndex(0);
    setSelectedChangIndex(0);
    setBuffaloChangIndex(0);
    try { sessionStorage.removeItem(BUFFALO_POS_KEY); } catch { /* ignore */ }
  };
  const currentChuDeAllDone = changs.length > 0 && completedChangs.size >= changs.length;

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
    } catch { /* ignore */ }
    setShowCelebration(true);
  }, [allEverythingDone]);
  const dismissCelebration = () => {
    setShowCelebration(false);
    try { localStorage.setItem(CELEBRATION_SEEN_KEY, "1"); } catch { /* ignore */ }
  };

  if (isLoading || authIsLoading || isProgressLoading) {
    return (
      <section className="h-full w-full flex-1">
        <RoadmapSkeleton />
      </section>
    );
  }

  if (error || !chuDe || changs.length === 0) {
    return (
      <section className="flex h-full w-full flex-1 items-center justify-center px-4 text-center text-navy">
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
    <section className="h-full w-full flex-1 shrink-0" id="roadmap-start">
      <div className="relative h-full w-full">
        <RoadmapMap
          chuDe={chuDe}
          chuDeIndex={currentChuDeIndex}
          chuDeCount={chuDes.length}
          canGoPrevChuDe={currentChuDeIndex > 0}
          canGoNextChuDe={currentChuDeIndex < chuDes.length - 1 && currentChuDeAllDone}
          onPrevChuDe={() => goToChuDe(currentChuDeIndex - 1)}
          onNextChuDe={() => goToChuDe(currentChuDeIndex + 1)}
          changTitles={changTitles}
          changEmojis={changEmojis}
          currentChangIndex={currentChangIndex}
          buffaloChangIndex={buffaloChangIndex}
          completedChangs={completedChangs}
          startedChangs={startedChangs}
          selectedChangIndex={selectedChangIndex}
          onSelectStage={(i) => { setSelectedChangIndex(i); setBuffaloChangIndex(i); }}
          onOpenLesson={openChang}
          changProgress={changProgress}
        />
      </div>
      {showCelebration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center ring-[3px] ring-white shadow-soft">
            <ConfettiBurst onDone={() => { /* keep card visible until user dismisses */ }} />
            <p className="font-display text-xl font-extrabold text-navy sm:text-2xl">
              🎉 Em đã hoàn thành cả lộ trình! Em giỏi lắm!
            </p>
            <button
              onClick={dismissCelebration}
              className="mt-6 rounded-full bg-gradient-sunset px-6 py-3 font-display text-base font-extrabold text-navy shadow-bevel-yellow transition-[transform,box-shadow,filter] ease-bounce hover:-translate-y-0.5 hover:scale-[1.03] hover:brightness-105 active:translate-y-[3px] active:scale-100 active:shadow-bevel-yellow-active"
            >
              Ôn tập lại
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

