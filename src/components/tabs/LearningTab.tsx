import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { learningDataQueryOptions } from "@/lib/learning";
import { RoadmapMap } from "@/components/learning/RoadmapMap";
import { LessonCard } from "@/components/learning/LessonCard";
import { ProgressSidebar } from "@/components/learning/ProgressSidebar";

export function LearningTab() {
  const { data, isLoading, error } = useQuery(learningDataQueryOptions);

  const [currentChuDeIndex, setCurrentChuDeIndex] = useState(0);
  const [currentChangIndex, setCurrentChangIndex] = useState(0);
  const [currentNoiDungIndex, setCurrentNoiDungIndex] = useState(0);
  const [completedByChuDe, setCompletedByChuDe] = useState<Record<number, number[]>>({});
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const chuDes = useMemo(() => (data ?? []).map((d) => d.chuDe), [data]);
  const chuDe = chuDes[currentChuDeIndex];
  const changs = useMemo(() => data?.[currentChuDeIndex]?.changs ?? [], [data, currentChuDeIndex]);
  const changTitles = useMemo(() => changs.map((s) => s.title), [changs]);
  const completedChangs = useMemo(
    () => new Set(completedByChuDe[currentChuDeIndex] ?? []),
    [completedByChuDe, currentChuDeIndex],
  );

  const completeChang = () => {
    setCompletedByChuDe((prev) => {
      const cur = new Set(prev[currentChuDeIndex] ?? []);
      cur.add(currentChangIndex);
      return { ...prev, [currentChuDeIndex]: Array.from(cur) };
    });
  };

  const openChang = (i: number) => {
    setCurrentChangIndex(i);
    setCurrentNoiDungIndex(0);
    setIsDetailOpen(false);

    const urls = changs[i]?.noiDungs.flatMap((nd) => nd.bais.flatMap((b) => b.hinhs.map((h) => h.url))) ?? [];
    urls.filter(Boolean).forEach((url) => {
      const img = new Image();
      img.src = url;
    });

    window.setTimeout(() => setIsDetailOpen(true), 750);
  };

  const nextChuDe = () => {
    if (currentChuDeIndex >= chuDes.length - 1) return;
    setCurrentChuDeIndex((i) => i + 1);
    setCurrentChangIndex(0);
    setCurrentNoiDungIndex(0);
    setCompletedByChuDe((prev) => ({ ...prev, [currentChuDeIndex + 1]: [] }));
    setIsDetailOpen(false);
  };

  const allDone = changs.length > 0 && completedChangs.size >= changs.length;
  const isLast = currentChuDeIndex >= chuDes.length - 1;

  useEffect(() => {
    if (!isDetailOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDetailOpen(false);
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
      <div
        id="roadmap-start"
        className={[
          "mx-auto grid h-full max-w-7xl grid-cols-1 gap-4 transition-[grid-template-columns] lg:gap-6",
          isSidebarCollapsed ? "lg:grid-cols-[1fr_72px]" : "lg:grid-cols-[1fr_320px]",
        ].join(" ")}
      >
        <div className="relative h-full min-h-0">
          <RoadmapMap
            chuDe={chuDe}
            chuDeIndex={currentChuDeIndex}
            changTitles={changTitles}
            currentChangIndex={currentChangIndex}
            completedChangs={completedChangs}
            onSelectStage={openChang}
            soundOn={soundOn}
            onToggleSound={() => setSoundOn((s) => !s)}
          />
        </div>

        <div className="relative lg:z-50">
          <ProgressSidebar
            chuDes={chuDes}
            currentChuDeIndex={currentChuDeIndex}
            completedCount={completedChangs.size}
            totalChangs={changs.length}
            allCurrentDone={allDone}
            isLast={isLast}
            onAdvance={nextChuDe}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapsed={() => setIsSidebarCollapsed((c) => !c)}
          />
        </div>
      </div>

      {isDetailOpen && currentChang && (
        <div
          className={[
            "fixed inset-0 z-40 flex h-dvh items-center justify-center bg-navy/40 backdrop-blur-sm transition-[padding] animate-modal-overlay-in sm:p-4",
            isSidebarCollapsed ? "lg:pr-[104px]" : "lg:pr-[352px]",
          ].join(" ")}
          onClick={() => setIsDetailOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="h-dvh w-full animate-modal-pop-in sm:h-[95dvh] sm:max-w-3xl"
          >
            <LessonCard
              chang={currentChang}
              changIndex={currentChangIndex}
              noiDungIndex={currentNoiDungIndex}
              isCompleted={completedChangs.has(currentChangIndex)}
              onPrevNoiDung={() => setCurrentNoiDungIndex((i) => Math.max(0, i - 1))}
              onNextNoiDung={() => setCurrentNoiDungIndex((i) => Math.min(noiDungCount - 1, i + 1))}
              onComplete={completeChang}
              onClose={() => setIsDetailOpen(false)}
            />
          </div>
        </div>
      )}
    </section>
  );
}
