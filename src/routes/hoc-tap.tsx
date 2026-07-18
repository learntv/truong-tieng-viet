import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/hoc-tap")({
  component: HocTapLayout,
});

function HocTapLayout() {
  const { location } = useRouterState();
  const pathname = location.pathname;

  // The roadmap itself (…/quyen-1 and …/quyen-1/chu-de-N) is a normal scrollable page with a
  // footer. Lesson pages (…/quyen-1/<changId>) stay a distraction-free full-screen view.
  const isRoadmap =
    pathname === "/hoc-tap/quyen-1" || pathname.startsWith("/hoc-tap/quyen-1/chu-de-");
  const isLesson = pathname.startsWith("/hoc-tap/quyen-1/") && !isRoadmap;

  // Every learning page now shares the same cream paper background as the rest of the site.
  return (
    <div
      className={[
        "relative bg-paper",
        isLesson ? "flex h-screen flex-col overflow-hidden" : "flex min-h-screen flex-col",
      ].join(" ")}
    >
      {isLesson ? (
        <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
          <Navbar />
          <Outlet />
        </div>
      ) : (
        <>
          <Navbar />
          <Outlet />
          <Footer />
        </>
      )}
    </div>
  );
}
