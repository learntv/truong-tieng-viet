import { useEffect, useMemo, useState } from "react";
import { TOPICS, getStagesForTopic } from "@/data/topics";
import { RoadmapMap } from "@/components/learning/RoadmapMap";
import { LessonCard } from "@/components/learning/LessonCard";
import { ProgressSidebar } from "@/components/learning/ProgressSidebar";

export function LearningTab() {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [completedByTopic, setCompletedByTopic] = useState<Record<number, number[]>>({});
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const topic = TOPICS[currentTopicIndex];
  const stages = useMemo(() => getStagesForTopic(currentTopicIndex), [currentTopicIndex]);
  const stageTitles = useMemo(() => stages.map((s) => s.title), [stages]);
  const completedSet = useMemo(
    () => new Set(completedByTopic[currentTopicIndex] ?? []),
    [completedByTopic, currentTopicIndex],
  );

  const completeStage = () => {
    setCompletedByTopic((prev) => {
      const cur = new Set(prev[currentTopicIndex] ?? []);
      cur.add(currentStageIndex);
      return { ...prev, [currentTopicIndex]: Array.from(cur) };
    });
  };

  const nextTopic = () => {
    if (currentTopicIndex >= TOPICS.length - 1) return;
    setCurrentTopicIndex((i) => i + 1);
    setCurrentStageIndex(0);
    setCompletedByTopic((prev) => ({ ...prev, [currentTopicIndex + 1]: [] }));
    setIsDetailOpen(false);
  };

  const allDone = completedSet.size >= stages.length;
  const isLast = currentTopicIndex >= TOPICS.length - 1;

  useEffect(() => {
    if (!isDetailOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDetailOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDetailOpen]);

  return (
    <section className="w-full px-4 py-6 sm:px-6 lg:px-10">
      <div
        id="roadmap-start"
        className={[
          "mx-auto grid max-w-7xl grid-cols-1 gap-6 transition-[grid-template-columns]",
          isSidebarCollapsed ? "lg:grid-cols-[1fr_72px]" : "lg:grid-cols-[1fr_320px]",
        ].join(" ")}
      >
        <div className="relative">
          <RoadmapMap
            topic={topic}
            topicIndex={currentTopicIndex}
            stageTitles={stageTitles}
            currentStageIndex={currentStageIndex}
            completedStages={completedSet}
            onSelectStage={(i) => {
              setCurrentStageIndex(i);
              setIsDetailOpen(true);
            }}
            soundOn={soundOn}
            onToggleSound={() => setSoundOn((s) => !s)}
          />

          {isDetailOpen && (
            <div
              className="absolute inset-x-2 top-16 bottom-24 z-30 flex items-center justify-center rounded-3xl bg-navy/40 p-2 backdrop-blur-sm sm:inset-x-8 sm:top-20 sm:bottom-28"
              onClick={() => setIsDetailOpen(false)}
            >
              <div onClick={(e) => e.stopPropagation()} className="h-full w-full">
                <LessonCard
                  stage={stages[currentStageIndex]}
                  stageIndex={currentStageIndex}
                  totalStages={stages.length}
                  isCompleted={completedSet.has(currentStageIndex)}
                  onPrev={() => setCurrentStageIndex((i) => Math.max(0, i - 1))}
                  onNext={() => setCurrentStageIndex((i) => Math.min(stages.length - 1, i + 1))}
                  onComplete={completeStage}
                  onClose={() => setIsDetailOpen(false)}
                />
              </div>
            </div>
          )}
        </div>

        <ProgressSidebar
          topics={TOPICS}
          currentTopicIndex={currentTopicIndex}
          completedCount={completedSet.size}
          totalStages={stages.length}
          allCurrentDone={allDone}
          isLast={isLast}
          onAdvance={nextTopic}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapsed={() => setIsSidebarCollapsed((c) => !c)}
        />
      </div>
    </section>
  );
}
