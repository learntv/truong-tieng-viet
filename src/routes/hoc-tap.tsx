import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { halongScene } from "@/data/scenes";

export const Route = createFileRoute("/hoc-tap")({
  component: HocTapLayout,
});

function HocTapLayout() {
  const { location } = useRouterState();
  const pathname = location.pathname;

  // The roadmap itself (…/quyen-1 and …/quyen-1/chu-de-N) is a normal scrollable page with a
  // footer. Lesson pages (…/quyen-1/<changId>) stay a distraction-free full-screen view.
  const isRoadmap = pathname === "/hoc-tap/quyen-1" || pathname.startsWith("/hoc-tap/quyen-1/chu-de-");
  const isLesson = pathname.startsWith("/hoc-tap/quyen-1/") && !isRoadmap;
  const isAlphabetPage = pathname === "/hoc-tap/bang-chu-cai";
  const isHocTapHome = pathname === "/hoc-tap";

  return (
    <div
      className={[
        "relative",
        isLesson ? "flex h-screen flex-col overflow-hidden" : "flex min-h-screen flex-col",
        isAlphabetPage && "bg-gradient-to-b from-sky-300 to-sky-200",
        isHocTapHome && "bg-gradient-to-b from-amber-100 via-rose-50 to-sky-100",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Background bleeds behind the Navbar too, so there's no white strip above the map. */}
      {isLesson ? (
        <>
          <img
            src={halongScene}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sky/60 via-transparent to-white/10" />

          <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
            <Navbar />
            <Outlet />
          </div>
        </>
      ) : isRoadmap ? (
        <>
          {/* Sky sits behind the Navbar + roadmap card; the Halong map (rendered inside the
              Outlet) begins below the card and blends up into this sky. */}
          <div className="relative bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100">
            <div className="relative z-10">
              <Navbar />
              <Outlet />
            </div>
            <Footer />
          </div>
        </>
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
