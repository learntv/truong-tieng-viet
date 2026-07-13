import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { learningDataQueryOptions } from "@/lib/learning";
import { TOPICS } from "@/data/topics";
import { RoadmapMap, NODE_POSITIONS, type ChuDeNavItem } from "@/components/learning/RoadmapMap";
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
  const { data, isLoading, error } = useQuery(learningDataQueryOptions);
  const navigate = useNavigate();

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

  const [selectedChangIndex, setSelectedChangIndex] = useState<number | null>(seedChangIndex);
  const [buffaloChangIndex, setBuffaloChangIndex] = useState(seedChangIndex);

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

  // Restore the stage within the current chủ đề once data + progress are both ready. The chủ
  // đề itself comes from the URL, so this only ever redirects to a *different* chủ đề for the
  // one case where the URL doesn't pin a specific choice yet (fresh "/hoc-tap/quyen-1" entry
  // with nothing in sessionStorage) — any deep link or back-navigation to a specific chủ đề is
  // respected as-is.
  // Priority: last-opened stage (sessionStorage) → in-progress "đang học" stage → first incomplete → last stage.
  const hasRestoredRef = useRef(false);
  useEffect(() => {
    if (hasRestoredRef.current || !data || authIsLoading || isProgressLoading) return;
    hasRestoredRef.current = true;

    const restore = (chuDeIdx: number, changIdx: number) => {
      if (chuDeIdx !== currentChuDeIndex) {
        navigate({
          to: "/hoc-tap/quyen-1/chu-de-{$chuDeIndex}",
          params: { chuDeIndex: String(chuDeIdx + 1) },
          replace: true,
        });
      }
      setCurrentChangIndex(changIdx);
      setBuffaloChangIndex(changIdx);
      setSelectedChangIndex(changIdx);
    };

    const firstIncompleteWithin = (ti: number) => {
      const topicChangs = data[ti]?.changs ?? [];
      const inProgress = topicChangs.findIndex((ch) => {
        const prog = activeProgressMap.get(ch.id);
        return prog && !prog.isCompleted && prog.noiDungIndex > 0;
      });
      if (inProgress !== -1) return inProgress;
      const firstIncomplete = topicChangs.findIndex((ch) => !activeProgressMap.get(ch.id)?.isCompleted);
      if (firstIncomplete !== -1) return firstIncomplete;
      return Math.max(0, topicChangs.length - 1);
    };

    // Prefer the stage the user last opened (saved in sessionStorage by openChang), but only
    // when it belongs to the chủ đề we're actually on.
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
        restore(currentChuDeIndex, saved.changIndex);
        return;
      }
      // Saved stage is completed or locked — discard stale position
      try { sessionStorage.removeItem(BUFFALO_POS_KEY); } catch { /* ignore */ }
    }

    // Nothing usable was saved for this chủ đề. If we're on the default entry (chủ đề 1) with
    // no saved position at all, pick up wherever the user left off across the whole roadmap.
    // Otherwise the URL asked for this specific chủ đề on purpose — just land on the right
    // stage inside it.
    if (!saved && currentChuDeIndex === 0) {
      for (let ti = 0; ti < data.length; ti++) {
        const topicChangs = data[ti].changs;
        const inProgress = topicChangs.findIndex((ch) => {
          const prog = activeProgressMap.get(ch.id);
          return prog && !prog.isCompleted && prog.noiDungIndex > 0;
        });
        if (inProgress !== -1) { restore(ti, inProgress); return; }
      }
      for (let ti = 0; ti < data.length; ti++) {
        const topicChangs = data[ti].changs;
        const firstIncomplete = topicChangs.findIndex((ch) => !activeProgressMap.get(ch.id)?.isCompleted);
        if (firstIncomplete !== -1) { restore(ti, firstIncomplete); return; }
      }
      const lastTi = data.length - 1;
      restore(lastTi, Math.max(0, data[lastTi].changs.length - 1));
      return;
    }

    restore(currentChuDeIndex, firstIncompleteWithin(currentChuDeIndex));
  }, [data, authIsLoading, isProgressLoading, activeProgressMap, currentChuDeIndex, navigate]);

  const chuDes = useMemo(() => (data ?? []).map((d) => d.chuDe), [data]);

  // The DB only has content for the first `availableCount` chủ đề; the rest of the planned
  // journey (TOPICS) is surfaced as "coming soon" so the child can see the whole path —
  // where they are, what's done, and what's next — even before that content ships.
  const availableCount = chuDes.length;
  const plannedCount = TOPICS.length;
  const allTopics = useMemo(
    () => TOPICS.map((planned, i) => (i < availableCount ? chuDes[i] : planned)),
    [chuDes, availableCount],
  );
  const currentTopic = allTopics[currentChuDeIndex] ?? chuDes[0];
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

  // The full 8-topic navigator: each planned chủ đề tagged with its progress state so the
  // header can draw a clear stepper (done / current / available / coming-soon).
  const chuDeNav = useMemo<ChuDeNavItem[]>(
    () =>
      TOPICS.map((planned, i) => {
        const isAvailable = i < availableCount;
        const src = isAvailable ? chuDes[i] : planned;
        const shortTitle = src.title.replace(/^Chủ đề\s*\d+\s*[:：]\s*/i, "").trim() || src.title;
        let status: ChuDeNavItem["status"];
        if (i === currentChuDeIndex) status = "current";
        else if (!isAvailable) status = "locked";
        else {
          const total = data?.[i]?.changs.length ?? 0;
          const done = completedByChuDe[i]?.length ?? 0;
          status = total > 0 && done >= total ? "completed" : "available";
        }
        return { index: i, title: src.title, shortTitle, emoji: src.emoji, status };
      }),
    [chuDes, availableCount, currentChuDeIndex, data, completedByChuDe],
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

  // Lets a user freely move between chủ đề: any available topic (to review), plus the first
  // upcoming one (shown as a "coming soon" preview). This is the only way to switch topics,
  // since the map otherwise only auto-lands on one via the one-time restore effect above.
  const goToChuDe = (index: number) => {
    if (index < 0 || index > availableCount || index >= plannedCount || index === currentChuDeIndex) return;
    setCurrentChangIndex(0);
    setSelectedChangIndex(0);
    setBuffaloChangIndex(0);
    try { sessionStorage.removeItem(BUFFALO_POS_KEY); } catch { /* ignore */ }
    navigate({
      to: "/hoc-tap/quyen-1/chu-de-{$chuDeIndex}",
      params: { chuDeIndex: String(index + 1) },
    });
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
    } catch { /* ignore */ }
    setShowCelebration(true);
  }, [allEverythingDone]);
  const dismissCelebration = () => {
    setShowCelebration(false);
    try { localStorage.setItem(CELEBRATION_SEEN_KEY, "1"); } catch { /* ignore */ }
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
        <RoadmapMap
          chuDe={currentTopic}
          chuDeIndex={currentChuDeIndex}
          chuDeNav={chuDeNav}
          isLocked={isCurrentLocked}
          onSelectChuDe={goToChuDe}
          canGoPrevChuDe={currentChuDeIndex > 0}
          canGoNextChuDe={currentChuDeIndex < availableCount && currentChuDeIndex < plannedCount - 1}
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
          <div className="relative w-full max-w-md rounded-3xl border-2 border-black/10 bg-white p-8 text-center shadow-[0_4px_0_0_rgba(0,0,0,0.12)]">
            <ConfettiBurst onDone={() => { /* keep card visible until user dismisses */ }} />
            <p className="font-display text-xl font-extrabold text-navy sm:text-2xl">
              🎉 Em đã hoàn thành cả lộ trình! Em giỏi lắm!
            </p>
            <Button variant="bevel-yellow" onClick={dismissCelebration} className="mt-6">
              Ôn tập lại
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

