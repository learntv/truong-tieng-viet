import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { learningDataQueryOptions } from "@/lib/learning";
import { RoadmapMap } from "@/components/learning/RoadmapMap";
import { RoadmapSkeleton } from "@/components/learning/RoadmapSkeleton";
import { LessonCard } from "@/components/learning/LessonCard";
import { STAGE_COLORS } from "@/components/learning/StageCard";
import { useAuth } from "@/hooks/useAuth";
import { useUserProgress } from "@/hooks/useUserProgress";
import type { ChangProgress } from "@/hooks/useUserProgress";

const LOCAL_PROGRESS_KEY = "vui-hoc-progress";
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
    // localStorage unavailable
  }
}

export function LearningTab() {
  const { data, isLoading, error } = useQuery(learningDataQueryOptions);

  const [currentChuDeIndex, setCurrentChuDeIndex] = useState(0);
  const [currentChangIndex, setCurrentChangIndex] = useState(0);
  const [currentNoiDungIndex, setCurrentNoiDungIndex] = useState(0);
  const { user, isLoading: authIsLoading } = useAuth();
  const { progressMap, isProgressLoading, markComplete, savePosition, mergeLocalProgress } = useUserProgress(user?.id ?? null);
  const [localProgressMap, setLocalProgressMap] = useState<Map<string, ChangProgress>>(loadLocalProgress);
  const activeProgressMap = user ? progressMap : localProgressMap;

  useEffect(() => {
    if (!user) persistLocalProgress(localProgressMap);
  }, [localProgressMap, user]);

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

  const [selectedChangIndex, setSelectedChangIndex] = useState<number | null>(null);
  const [buffaloChangIndex, setBuffaloChangIndex] = useState(0);

  // Restore position once data + progress are ready
  const hasRestoredRef = useRef(false);
  useEffect(() => {
    if (hasRestoredRef.current || !data || authIsLoading || isProgressLoading) return;
    hasRestoredRef.current = true;

    const restore = (chuDeIdx: number, changIdx: number, noiDungIdx: number = 0) => {
      setCurrentChuDeIndex(chuDeIdx);
      setCurrentChangIndex(changIdx);
      setCurrentNoiDungIndex(noiDungIdx);
      setBuffaloChangIndex(changIdx);
      setSelectedChangIndex(changIdx);
    };

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
        restore(saved.chuDeIndex, saved.changIndex, savedProg?.noiDungIndex ?? 0);
        return;
      }
      try { sessionStorage.removeItem(BUFFALO_POS_KEY); } catch { /* ignore */ }
    }

    for (let ti = 0; ti < data.length; ti++) {
      const topicChangs = data[ti].changs;
      const inProgress = topicChangs.findIndex((ch) => {
        const prog = activeProgressMap.get(ch.id);
        return prog && !prog.isCompleted && prog.noiDungIndex > 0;
      });
      if (inProgress !== -1) {
        const prog = activeProgressMap.get(topicChangs[inProgress].id);
        restore(ti, inProgress, prog?.noiDungIndex ?? 0);
        return;
      }
    }

    for (let ti = 0; ti < data.length; ti++) {
      const topicChangs = data[ti].changs;
      const firstIncomplete = topicChangs.findIndex((ch) => !activeProgressMap.get(ch.id)?.isCompleted);
      if (firstIncomplete !== -1) { restore(ti, firstIncomplete); return; }
    }

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

  const changProgress = useMemo(() => {
    const map = new Map<number, { current: number; total: number }>();
    changs.forEach((ch, i) => {
      const total = ch.noiDungs.length;
      if (total === 0) return;
      const prog = activeProgressMap.get(ch.id);
      if (prog && !prog.isCompleted) {
        map.set(i, { current: Math.min(prog.noiDungIndex + 1, total), total });
      }
    });
    if (!completedChangs.has(currentChangIndex)) {
      const total = changs[currentChangIndex]?.noiDungs.length ?? 0;
      if (total > 0) {
        map.set(currentChangIndex, { current: currentNoiDungIndex + 1, total });
      }
    }
    return map;
  }, [changs, activeProgressMap, currentChangIndex, currentNoiDungIndex, completedChangs]);

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

  const persistPosition = (changId: string, noiDungIdx: number) => {
    if (user) {
      savePosition(changId, noiDungIdx);
    } else {
      setLocalProgressMap((prev) => {
        const next = new Map(prev);
        const existing = next.get(changId);
        next.set(changId, { noiDungIndex: noiDungIdx, isCompleted: existing?.isCompleted ?? false });
        return next;
      });
    }
  };

  const completeChang = () => {
    if (completedChangs.has(currentChangIndex)) return;
    const changId = changs[currentChangIndex]?.id;
    if (!changId) return;
    if (user) {
      markComplete(changId);
    } else {
      setLocalProgressMap((prev) => {
        const next = new Map(prev);
        next.set(changId, { noiDungIndex: currentNoiDungIndex, isCompleted: true });
        return next;
      });
    }
    toast.success(`Chặng ${currentChangIndex + 1} hoàn thành! 🎉`, {
      description: "Tiếp tục giỏi nhé!",
      duration: 3000,
    });
  };

  const openChang = (i: number) => {
    if (i < 0 || i >= changs.length) return;
    const chang = changs[i];
    const savedProgress = activeProgressMap.get(chang.id);
    const maxSlide = Math.max(0, chang.noiDungs.length - 1);
    setCurrentChangIndex(i);
    setCurrentNoiDungIndex(Math.min(savedProgress?.noiDungIndex ?? 0, maxSlide));
    setSelectedChangIndex(i);
    setBuffaloChangIndex(i);
    saveBuffaloPos({ chuDeIndex: currentChuDeIndex, changIndex: i });

    // Scroll to lesson section
    setTimeout(() => {
      document.getElementById("lesson-content")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);

    const urls =
      chang.noiDungs.flatMap((nd) =>
        nd.bais.flatMap((b) => b.hinhs.map((h) => h.url)),
      );
    urls.filter(Boolean).forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  };

  const nextChuDe = () => {
    if (currentChuDeIndex >= chuDes.length - 1) return;
    const nextIndex = currentChuDeIndex + 1;
    setCurrentChuDeIndex(nextIndex);
    setCurrentChangIndex(0);
    setCurrentNoiDungIndex(0);
    setSelectedChangIndex(null);
    setBuffaloChangIndex(0);
    try { sessionStorage.removeItem(BUFFALO_POS_KEY); } catch { /* ignore */ }
  };

  const allDone = changs.length > 0 && completedChangs.size >= changs.length;
  const isLast = currentChuDeIndex >= chuDes.length - 1;

  if (isLoading || authIsLoading || isProgressLoading) {
    return (
      <section className="w-full px-4 py-3 sm:px-6 sm:py-4 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="h-[70vh]">
            <RoadmapSkeleton />
          </div>
        </div>
      </section>
    );
  }

  if (error || !chuDe || changs.length === 0) {
    return (
      <section className="w-full px-4 py-16 text-center text-navy">
        <p className="font-display text-lg font-bold">Chưa có dữ liệu bài học.</p>
        {error ? (
          <p className="mt-2 text-sm text-muted-foreground">{(error as Error).message}</p>
        ) : null}
      </section>
    );
  }

  const currentChang = changs[currentChangIndex];
  const noiDungCount = currentChang?.noiDungs.length ?? 0;
  const canPrev = currentNoiDungIndex > 0 || currentChangIndex > 0;
  const canNext =
    currentNoiDungIndex < noiDungCount - 1 || currentChangIndex < changs.length - 1;
  const modalColor = STAGE_COLORS[currentChangIndex % STAGE_COLORS.length];

  const goPrev = () => {
    if (currentNoiDungIndex > 0) {
      const nextIdx = currentNoiDungIndex - 1;
      setCurrentNoiDungIndex(nextIdx);
      const changId = currentChang?.id;
      if (changId && !completedChangs.has(currentChangIndex)) persistPosition(changId, nextIdx);
    } else if (currentChangIndex > 0) {
      openChang(currentChangIndex - 1);
    }
    setTimeout(() => {
      document.getElementById("lesson-content")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const goNext = () => {
    if (currentNoiDungIndex < noiDungCount - 1) {
      const nextIdx = currentNoiDungIndex + 1;
      setCurrentNoiDungIndex(nextIdx);
      const changId = currentChang?.id;
      if (changId && !completedChangs.has(currentChangIndex)) persistPosition(changId, nextIdx);
    } else if (currentChangIndex < changs.length - 1) {
      openChang(currentChangIndex + 1);
      return;
    }
    setTimeout(() => {
      document.getElementById("lesson-content")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const isLastNoiDungOfLastChang =
    currentChangIndex === changs.length - 1 && currentNoiDungIndex === noiDungCount - 1;

  return (
    <section className="w-full px-4 py-3 sm:px-6 sm:py-4 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6" id="roadmap-start">

        {/* Map — always at top */}
        <div className="h-[65vh] min-h-[420px] sm:h-[70vh]">
          <RoadmapMap
            chuDes={chuDes}
            chuDe={chuDe}
            chuDeIndex={currentChuDeIndex}
            changTitles={changTitles}
            changEmojis={changEmojis}
            currentChangIndex={currentChangIndex}
            buffaloChangIndex={buffaloChangIndex}
            completedChangs={completedChangs}
            startedChangs={startedChangs}
            selectedChangIndex={selectedChangIndex}
            onSelectStage={(i) => { setSelectedChangIndex(i); setBuffaloChangIndex(i); }}
            onOpenLesson={openChang}
            completedCount={completedChangs.size}
            allCurrentDone={allDone}
            isLast={isLast}
            onAdvance={nextChuDe}
            changProgress={changProgress}
          />
        </div>

        {/* Inline lesson content — blog post style */}
        {currentChang && (
          <div id="lesson-content" className="scroll-mt-4">
            <LessonCard
              chang={currentChang}
              changIndex={currentChangIndex}
              noiDungIndex={currentNoiDungIndex}
              isCompleted={completedChangs.has(currentChangIndex)}
              isLastNoiDungOfLastChang={isLastNoiDungOfLastChang}
              onComplete={completeChang}
            />

            {/* Prev / Next navigation */}
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                onClick={goPrev}
                disabled={!canPrev}
                className={[
                  "flex items-center gap-2 rounded-full bg-white px-5 py-3 font-display text-sm font-bold text-navy shadow-card transition sm:text-base",
                  canPrev ? "hover:scale-105 hover:shadow-lg" : "opacity-40 cursor-not-allowed",
                ].join(" ")}
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
                <span>Trang trước</span>
              </button>

              <span className="hidden text-sm font-bold text-navy/70 sm:inline">
                Trang {currentNoiDungIndex + 1} / {noiDungCount}
              </span>

              <button
                onClick={goNext}
                disabled={!canNext}
                className={[
                  "flex items-center gap-2 rounded-full px-5 py-3 font-display text-sm font-bold text-white shadow-card transition sm:text-base",
                  modalColor.gradient,
                  canNext ? "hover:scale-105 hover:shadow-lg" : "opacity-40 cursor-not-allowed",
                ].join(" ")}
              >
                <span>
                  {currentNoiDungIndex < noiDungCount - 1
                    ? "Trang tiếp"
                    : currentChangIndex < changs.length - 1
                      ? "Chặng tiếp"
                      : "Hết"}
                </span>
                <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
