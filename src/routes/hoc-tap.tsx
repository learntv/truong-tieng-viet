import { createFileRoute, Outlet, useChildMatches, useRouterState } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/hoc-tap")({
  component: HocTapLayout,
});

function HocTapLayout() {
  const { location } = useRouterState();
  const pathname = location.pathname;

  const childMatches = useChildMatches();
  const isLessonView = childMatches.some((m) => m.routeId === "/hoc-tap/quyen-1/$changId");
  const isImmersive = pathname.startsWith("/hoc-tap/quyen-1") && !isLessonView;
  const isAlphabetPage = pathname === "/hoc-tap/bang-chu-cai";
  const isHocTapHome = pathname === "/hoc-tap";

  return (
    <div
      className={[
        isImmersive ? "flex h-screen flex-col overflow-hidden" : "flex min-h-screen flex-col",
        isAlphabetPage && "bg-gradient-to-b from-sky-300 to-sky-200",
        isHocTapHome && "bg-gradient-to-b from-amber-100 via-rose-50 to-sky-100",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Navbar />

      <Outlet />

      {!isImmersive && <Footer />}
    </div>
  );
}
