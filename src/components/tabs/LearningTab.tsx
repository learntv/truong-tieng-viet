import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { learningDataQueryOptions } from "@/lib/learning";
import { RoadmapMap } from "@/components/learning/RoadmapMap";
import { RoadmapSkeleton } from "@/components/learning/RoadmapSkeleton";
import { buildSlides } from "@/components/learning/LessonPage";
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

// How long the connector triangle takes to glide to its new position/height.
const CONNECTOR_TRANSITION_MS = 450;

export function LearningTab({ isLessonView, changId }: { isLessonView: boolean; changId: string | null }) {
  const { data, isLoading, error } = useQuery(learningDataQueryOptions);
  const navigate = useNavigate();

  const [currentChuDeIndex, setCurrentChuDeIndex] = useState(0);
  const [currentChangIndex, setCurrentChangIndex] = useState(0);
  const { authIsLoading, activeProgressMap, isProgressLoading } = useLearningProgress();

  const [selectedChangIndex, setSelectedChangIndex] = useState<number | null>(null);
  const [buffaloChangIndex, setBuffaloChangIndex] = useState(0);

  const mapSectionRef = useRef<HTMLElement>(null);
  const mapInnerRef = useRef<HTMLDivElement>(null);
  const activeNodeRef = useRef<HTMLDivElement>(null);

  // Scroll position at the moment a lesson is opened/switched, so it can be restored
  // before paint — otherwise the router's own scroll-restoration snaps to 0 first,
  // producing a visible jump before our own smooth scroll-to-target kicks in.
  const pendingScrollYRef = useRef<number | null>(null);
  useLayoutEffect(() => {
    if (!isLessonView || pendingScrollYRef.current == null) return;
    window.scrollTo(0, pendingScrollYRef.current);
    pendingScrollYRef.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changId]);

  // The lesson actually being displayed (from the URL), which can differ from
  // `currentChangIndex` — e.g. right after a refresh, `currentChangIndex` still reflects
  // the last saved "Đang học" position until the restore effect below (re)confirms it,
  // but the page shown is whatever `changId` says. The buffalo and connector should
  // always track this, not the saved position, to avoid a visible mismatch.
  const displayedChangIndex = useMemo(() => {
    if (!isLessonView || !changId) return currentChangIndex;
    const changsForTopic = data?.[currentChuDeIndex]?.changs ?? [];
    const idx = changsForTopic.findIndex((ch) => ch.id === changId);
    return idx !== -1 ? idx : currentChangIndex;
  }, [isLessonView, changId, data, currentChuDeIndex, currentChangIndex]);

  // Measures the connector triangle's height: the vertical distance from the displayed
  // node's bottom edge down to the map's own bottom edge. This is unaffected by horizontal
  // scroll (both ends move together), so it only needs to be measured on lesson switches
  // and resize — the triangle itself is rendered in-flow with the map's nodes (see
  // RoadmapMap), positioned by the same percentage the nodes use, so it scrolls natively
  // with zero JS-driven lag and touches on it fall through to the map's own scrolling.
  const [connectorHeight, setConnectorHeight] = useState<number | null>(null);
  useEffect(() => {
    if (!isLessonView) { setConnectorHeight(null); return; }
    const measure = () => {
      const node = activeNodeRef.current;
      const inner = mapInnerRef.current;
      if (!node || !inner) return;
      const nodeRect = node.getBoundingClientRect();
      const innerRect = inner.getBoundingClientRect();
      setConnectorHeight(Math.max(24, innerRect.bottom - nodeRect.bottom));
    };
    measure();
    // Re-measure shortly after mount too, since fonts/images can still be settling.
    const t = setTimeout(measure, 300);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, [isLessonView, changId, displayedChangIndex]);

  // The full map's height in lesson view (a normal document-flow section, so it needs an
  // explicit pixel height): one viewport minus the navbar, matching the immersive roadmap.
  const [fullHeightPx, setFullHeightPx] = useState<number | null>(null);
  useEffect(() => {
    const measure = () => {
      const navbarHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
      setFullHeightPx(window.innerHeight - navbarHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Whenever a lesson is opened or switched, scroll just past the full map so the lesson
  // content is immediately visible. The map itself never changes size, so this is a plain
  // scroll — no layout feedback loop. Scrolling back up past this point naturally reveals
  // the full map again, in normal flow.
  useEffect(() => {
    if (!isLessonView) return;
    // Delayed past both the router's own scroll-restoration-to-top (which otherwise fights
    // and wins over a scrollTo issued immediately on navigation) and the connector's own
    // glide-into-position transition, so the triangle finishes moving before the page scrolls.
    const id = setTimeout(() => {
      const section = mapSectionRef.current;
      if (!section) return;
      const target = section.getBoundingClientRect().bottom + window.scrollY - 24;
      window.scrollTo({ top: target, behavior: "smooth" });
    }, CONNECTOR_TRANSITION_MS + 50);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLessonView, changId]);

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

  // "X/Y trang" tracks flattened slides (one per bai, matching what the lesson page itself
  // calls a "trang") — not raw noiDung steps, which are usually fewer and give a wrong count.
  const changProgress = useMemo(() => {
    const map = new Map<number, { current: number; total: number }>();
    changs.forEach((ch, i) => {
      const slides = buildSlides(ch.noiDungs);
      const total = slides.length;
      if (total === 0) return;
      const prog = activeProgressMap.get(ch.id);
      if (prog && !prog.isCompleted) {
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
    pendingScrollYRef.current = window.scrollY;
    setCurrentChangIndex(i);
    saveBuffaloPos({ chuDeIndex: currentChuDeIndex, changIndex: i });
    navigate({ to: "/hoc-tieng-viet/$changId", params: { changId: chang.id } });
  };

  const nextChuDe = () => {
    if (currentChuDeIndex >= chuDes.length - 1) return;
    const nextIndex = currentChuDeIndex + 1;
    setCurrentChuDeIndex(nextIndex);
    setCurrentChangIndex(0);
    setSelectedChangIndex(null);
    setBuffaloChangIndex(0);
    try { sessionStorage.removeItem(BUFFALO_POS_KEY); } catch { /* ignore */ }
  };

  const allDone = changs.length > 0 && completedChangs.size >= changs.length;
  const isLast = currentChuDeIndex >= chuDes.length - 1;

  if (isLoading || authIsLoading || isProgressLoading) {
    if (isLessonView) {
      return <div className="h-16 w-full shrink-0 animate-pulse rounded-2xl bg-muted/40" />;
    }
    return (
      <section className="h-full w-full px-4 py-3 sm:px-6 sm:py-4 lg:px-10">
        <div className="relative mx-auto h-full max-w-7xl">
          <div className="h-full">
            <RoadmapSkeleton />
          </div>
        </div>
      </section>
    );
  }

  if (error || !chuDe || changs.length === 0) {
    if (isLessonView) return null;
    return (
      <section className="w-full px-4 py-16 text-center text-navy">
        <p className="font-display text-lg font-bold">Chưa có dữ liệu bài học.</p>
        {error ? (
          <p className="mt-2 text-sm text-muted-foreground">{(error as Error).message}</p>
        ) : null}
      </section>
    );
  }

  return (
    <section
      ref={mapSectionRef}
      className={[
        "w-full shrink-0 px-4 py-3 sm:px-6 sm:py-4 lg:px-10",
        isLessonView ? "" : "h-full flex-1",
      ].join(" ")}
      style={isLessonView ? { height: `${fullHeightPx ?? 600}px` } : undefined}
    >
      <div ref={mapInnerRef} className="relative mx-auto h-full max-w-7xl" id="roadmap-start">
        <RoadmapMap
          chuDes={chuDes}
          chuDe={chuDe}
          chuDeIndex={currentChuDeIndex}
          changTitles={changTitles}
          changEmojis={changEmojis}
          currentChangIndex={currentChangIndex}
          buffaloChangIndex={isLessonView ? displayedChangIndex : buffaloChangIndex}
          connectorChangIndex={displayedChangIndex}
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
          activeNodeRef={activeNodeRef}
          connectorHeight={connectorHeight ?? undefined}
        />
      </div>
    </section>
  );
}
