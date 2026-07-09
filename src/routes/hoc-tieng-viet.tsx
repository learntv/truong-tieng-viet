import { createFileRoute, Outlet, useChildMatches } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LearningTab } from "@/components/tabs/LearningTab";

export const Route = createFileRoute("/hoc-tieng-viet")({
  component: HocTiengVietLayout,
});

function HocTiengVietLayout() {
  const childMatches = useChildMatches();
  const lessonMatch = childMatches.find((m) => m.routeId === "/hoc-tieng-viet/$changId");
  const isLessonView = !!lessonMatch;
  const changId = lessonMatch ? (lessonMatch.params as { changId: string }).changId : null;

  return (
    <div className={isLessonView ? "flex min-h-screen flex-col" : "flex h-screen flex-col overflow-hidden"}>
      <Navbar />
      <LearningTab isLessonView={isLessonView} changId={changId} />
      <Outlet />
      {isLessonView && <Footer />}
    </div>
  );
}
