import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { isQuyen1Path } from "@/lib/learning";
import halongScene from "@/assets/halong-scene.jpg";

export const Route = createFileRoute("/hoc-tap")({
  component: HocTapLayout,
});

function HocTapLayout() {
  const { location } = useRouterState();
  const pathname = location.pathname;

  const isImmersive = isQuyen1Path(pathname);
  const isAlphabetPage = pathname === "/hoc-tap/bang-chu-cai";
  const isHocTapHome = pathname === "/hoc-tap";

  return (
    <div
      className={[
        "relative",
        isImmersive ? "flex h-screen flex-col overflow-hidden" : "flex min-h-screen flex-col",
        isAlphabetPage && "bg-gradient-to-b from-sky-300 to-sky-200",
        isHocTapHome && "bg-gradient-to-b from-amber-100 via-rose-50 to-sky-100",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Background bleeds behind the Navbar too, so there's no white strip above the map. */}
      {isImmersive ? (
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
