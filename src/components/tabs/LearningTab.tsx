import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { learningDataQueryOptions } from "@/lib/learning";
import { RoadmapMap } from "@/components/learning/RoadmapMap";
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
    // localStorage unavailable (private browsing, quota exceeded, etc.)
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

  const [selectedChangIndex, setSelectedChangIndex] = useState<number | null>(null);
  const [buffaloChangIndex, setBuffaloChangIndex] = useState(0);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Restore position once data + progress are both ready.
  // Priority: last-opened stage (sessionStorage) → in-progress "đang học" stage → first incomplete → last stage.
  const hasRestoredRef = useRef(false);
  useEffect(() => {
    if (hasRestoredRef.current || !data || isProgressLoading) return;
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
  }, [data, isProgressLoading, activeProgressMap]);

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
    // Reflect live slide position while the modal is open
    if (isDetailOpen && !completedChangs.has(currentChangIndex)) {
      const total = changs[currentChangIndex]?.noiDungs.length ?? 0;
      if (total > 0) {
        map.set(currentChangIndex, { current: currentNoiDungIndex + 1, total });
      }
    }
    return map;
  }, [changs, activeProgressMap, isDetailOpen, currentChangIndex, currentNoiDungIndex, completedChangs]);

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

  const completeChang = () => {
    // Guard: already completed or no valid chang
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

  const closeModal = () => {
    if (!isDetailOpen) return;
    const changId = changs[currentChangIndex]?.id;
    if (changId && !completedChangs.has(currentChangIndex)) {
      if (user) {
        savePosition(changId, currentNoiDungIndex);
      } else {
        setLocalProgressMap((prev) => {
          const next = new Map(prev);
          const existing = next.get(changId);
          next.set(changId, { noiDungIndex: currentNoiDungIndex, isCompleted: existing?.isCompleted ?? false });
          return next;
        });
      }
    }
    setIsClosing(true);
    setTimeout(() => {
      setIsDetailOpen(false);
      setIsClosing(false);
      setIsFullscreen(false);
    }, 200);
  };

  const openChang = (i: number) => {
    if (i < 0 || i >= changs.length) return;
    const chang = changs[i];
    const savedProgress = activeProgressMap.get(chang.id);
    const maxSlide = Math.max(0, chang.noiDungs.length - 1);
    setCurrentChangIndex(i);
    setCurrentNoiDungIndex(Math.min(savedProgress?.noiDungIndex ?? 0, maxSlide));
    setIsFullscreen(false);
    setIsDetailOpen(true);
    saveBuffaloPos({ chuDeIndex: currentChuDeIndex, changIndex: i });

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
    setIsDetailOpen(false);
    try { sessionStorage.removeItem(BUFFALO_POS_KEY); } catch { /* ignore */ }
  };

  const allDone = changs.length > 0 && completedChangs.size >= changs.length;
  const isLast = currentChuDeIndex >= chuDes.length - 1;

  useEffect(() => {
    if (!isDetailOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDetailOpen]);

  if (isLoading || authIsLoading || isProgressLoading) {
    return (
      <section className="w-full px-4 py-16 text-center text-navy">
        <p className="font-display text-lg font-bold">Đang tải bài học…</p>
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

  return (
    <section className="h-full w-full px-4 py-3 sm:px-6 sm:py-4 lg:px-10">
      <div className="relative mx-auto h-full max-w-7xl" id="roadmap-start">

        <div className="h-full">
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

        {/* Centered modal overlay */}
        {isDetailOpen && currentChang && (() => {
          const modalColor = STAGE_COLORS[currentChangIndex % STAGE_COLORS.length];
          const canPrev = currentNoiDungIndex > 0;
          const canNext = currentNoiDungIndex < noiDungCount - 1;
          return (
            <div
              className={[
                "fixed inset-0 z-40 flex h-dvh items-center justify-center bg-navy/70 backdrop-blur-sm",
                isFullscreen ? "p-0" : "p-0 sm:p-4",
                isClosing ? "animate-modal-overlay-out" : "animate-modal-overlay-in",
              ].join(" ")}
              onClick={closeModal}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className={[
                  "relative",
                  isClosing ? "animate-modal-pop-out" : "animate-modal-pop-in",
                  isFullscreen
                    ? "h-dvh w-full"
                    : "h-dvh w-full sm:h-[95dvh] sm:max-w-2xl",
                ].join(" ")}
              >
                <LessonCard
                  chang={currentChang}
                  changIndex={currentChangIndex}
                  noiDungIndex={currentNoiDungIndex}
                  isCompleted={completedChangs.has(currentChangIndex)}
                  isFullscreen={isFullscreen}
                  onToggleFullscreen={() => setIsFullscreen((f) => !f)}
                  onPrevNoiDung={() => setCurrentNoiDungIndex((i) => Math.max(0, i - 1))}
                  onNextNoiDung={() =>
                    setCurrentNoiDungIndex((i) => Math.min(noiDungCount - 1, i + 1))
                  }
                  onNoiDungChange={setCurrentNoiDungIndex}
                  onComplete={completeChang}
                  onClose={closeModal}
                />

                <button
                  onClick={() => setCurrentNoiDungIndex((i) => Math.max(0, i - 1))}
                  aria-label="Trang trước"
                  disabled={!canPrev}
                  className={["absolute left-2 top-1/2 z-50 -translate-y-1/2", !isFullscreen && "sm:-left-14"].filter(Boolean).join(" ")}
                >
                  <div className={["grid h-11 w-11 place-items-center rounded-full bg-white/90 text-navy shadow-card backdrop-blur transition", canPrev ? "hover:scale-110 hover:bg-white" : "opacity-30 cursor-not-allowed"].join(" ")}>
                    <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
                  </div>
                </button>

                <button
                  onClick={() => setCurrentNoiDungIndex((i) => Math.min(noiDungCount - 1, i + 1))}
                  aria-label="Trang tiếp"
                  disabled={!canNext}
                  className={["absolute right-2 top-1/2 z-50 -translate-y-1/2", !isFullscreen && "sm:-right-14"].filter(Boolean).join(" ")}
                >
                  <div className={["grid h-11 w-11 place-items-center rounded-full text-white shadow-card transition", modalColor.gradient, canNext ? "hover:scale-110" : "opacity-30 cursor-not-allowed"].join(" ")}>
                    <ChevronRight className="h-6 w-6" strokeWidth={2.5} />
                  </div>
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
