import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LearningTab } from "@/components/tabs/LearningTab";

export const Route = createFileRoute("/hoc-tieng-viet")({
  component: HocTiengVietLayout,
});

function HocTiengVietLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLessonView = pathname !== "/hoc-tieng-viet" && pathname !== "/hoc-tieng-viet/";
  const changId = isLessonView ? decodeURIComponent(pathname.split("/").filter(Boolean).pop() ?? "") : null;

  return (
    <div className={isLessonView ? "flex min-h-screen flex-col" : "flex h-screen flex-col overflow-hidden"}>
      <Navbar />
      <LearningTab isLessonView={isLessonView} changId={changId} />
      <Outlet />
      {isLessonView && <Footer />}
    </div>
  );
}
