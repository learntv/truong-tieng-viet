import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { learningDataQueryOptions } from "@/lib/learning";
import { RoadmapMap } from "@/components/learning/RoadmapMap";
import { LessonCard } from "@/components/learning/LessonCard";
import { STAGE_COLORS } from "@/components/learning/StageCard";

export function LearningTab() {
  const { data, isLoading, error } = useQuery(learningDataQueryOptions);

  const [currentChuDeIndex, setCurrentChuDeIndex] = useState(0);
  const [currentChangIndex, setCurrentChangIndex] = useState(0);
  const [currentNoiDungIndex, setCurrentNoiDungIndex] = useState(0);
  const [completedByChuDe, setCompletedByChuDe] = useState<Record<number, number[]>>({});
  const [startedByChuDe, setStartedByChuDe] = useState<Record<number, number[]>>({});
  const [selectedChangIndex, setSelectedChangIndex] = useState<number | null>(null);
  const [buffaloChangIndex, setBuffaloChangIndex] = useState(0);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const chuDes = useMemo(() => (data ?? []).map((d) => d.chuDe), [data]);
  const chuDe = chuDes[currentChuDeIndex];
  const changs = useMemo(() => data?.[currentChuDeIndex]?.changs ?? [], [data, currentChuDeIndex]);
  const changTitles = useMemo(() => changs.map((s) => s.title), [changs]);
  const changEmojis = useMemo(() => changs.map((s) => s.emoji), [changs]);
  const completedChangs = useMemo(
    () => new Set(completedByChuDe[currentChuDeIndex] ?? []),
    [completedByChuDe, currentChuDeIndex],
  );
  const startedChangs = useMemo(
    () => new Set(startedByChuDe[currentChuDeIndex] ?? []),
    [startedByChuDe, currentChuDeIndex],
  );

  const completeChang = () => {
    setCompletedByChuDe((prev) => {
      const cur = new Set(prev[currentChuDeIndex] ?? []);
      cur.add(currentChangIndex);
      return { ...prev, [currentChuDeIndex]: Array.from(cur) };
    });
    toast.success(`Chặng ${currentChangIndex + 1} hoàn thành! 🎉`, {
      description: "Tiếp tục giỏi nhé!",
      duration: 3000,
    });
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsDetailOpen(false);
      setIsClosing(false);
      setIsFullscreen(false);
    }, 200);
  };

  const openChang = (i: number) => {
    setCurrentChangIndex(i);
    setCurrentNoiDungIndex(0);
    setIsFullscreen(false);
    setIsDetailOpen(true);

    const urls =
      changs[i]?.noiDungs.flatMap((nd) =>
        nd.bais.flatMap((b) => b.hinhs.map((h) => h.url)),
      ) ?? [];
    urls.filter(Boolean).forEach((url) => {
      const img = new Image();
      img.src = url;
    });

    setStartedByChuDe((prev) => {
      const cur = new Set(prev[currentChuDeIndex] ?? []);
      cur.add(i);
      return { ...prev, [currentChuDeIndex]: Array.from(cur) };
    });
  };

  const nextChuDe = () => {
    if (currentChuDeIndex >= chuDes.length - 1) return;
    setCurrentChuDeIndex((i) => i + 1);
    setCurrentChangIndex(0);
    setCurrentNoiDungIndex(0);
    setSelectedChangIndex(null);
    setCompletedByChuDe((prev) => ({ ...prev, [currentChuDeIndex + 1]: [] }));
    setIsDetailOpen(false);
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

  if (isLoading) {
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

                {canPrev && (
                  <button
                    onClick={() => setCurrentNoiDungIndex((i) => Math.max(0, i - 1))}
                    aria-label="Trang trước"
                    className={["absolute left-2 top-1/2 z-50 -translate-y-1/2", !isFullscreen && "sm:-left-14"].filter(Boolean).join(" ")}
                  >
                    <div className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-navy shadow-card backdrop-blur transition hover:scale-110 hover:bg-white">
                      <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
                    </div>
                  </button>
                )}

                {canNext && (
                  <button
                    onClick={() => setCurrentNoiDungIndex((i) => Math.min(noiDungCount - 1, i + 1))}
                    aria-label="Trang tiếp"
                    className={["absolute right-2 top-1/2 z-50 -translate-y-1/2", !isFullscreen && "sm:-right-14"].filter(Boolean).join(" ")}
                  >
                    <div className={["grid h-11 w-11 place-items-center rounded-full text-white shadow-card transition hover:scale-110", modalColor.gradient].join(" ")}>
                      <ChevronRight className="h-6 w-6" strokeWidth={2.5} />
                    </div>
                  </button>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
