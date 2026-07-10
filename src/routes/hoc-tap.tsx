import { createFileRoute, Link, Outlet, useChildMatches, useRouterState } from "@tanstack/react-router";
import { BookOpen, Mic, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/hoc-tap")({
  component: HocTapLayout,
});

const TABS = [
  { to: "/hoc-tap/lo-trinh", label: "Lộ trình", Icon: BookOpen },
  { to: "/hoc-tap/bang-chu-cai", label: "Bảng chữ cái", Icon: Sparkles },
  { to: "/hoc-tap/luyen-noi", label: "Luyện nói", Icon: Mic },
] as const;

function HocTapLayout() {
  const { location } = useRouterState();
  const pathname = location.pathname;

  const childMatches = useChildMatches();
  const isLessonView = childMatches.some((m) => m.routeId === "/hoc-tap/lo-trinh/quyen-1/$changId");
  const isImmersive = pathname.startsWith("/hoc-tap/lo-trinh/quyen-1") && !isLessonView;
  // Only the top-level list screens show the tab switcher — once a book or a topic is
  // open, the switcher just adds clutter above content that already has its own back link.
  const isTopLevel =
    pathname === "/hoc-tap/lo-trinh" ||
    pathname === "/hoc-tap/luyen-noi" ||
    pathname === "/hoc-tap/bang-chu-cai";

  return (
    <div className={isImmersive ? "flex h-screen flex-col overflow-hidden" : "flex min-h-screen flex-col"}>
      <Navbar />

      {isTopLevel && (
        <div className="flex shrink-0 justify-center border-b border-black/5 bg-white/60 px-4 pt-3 backdrop-blur-md sm:pt-5">
          <div className="flex items-center gap-6 sm:gap-10">
            {TABS.map(({ to, label, Icon }) => {
              const isActive = pathname === to || pathname.startsWith(`${to}/`);
              return (
                <Link
                  key={to}
                  to={to}
                  className="group relative flex items-center gap-2 py-3 text-sm font-display font-extrabold transition-colors sm:py-4 sm:text-base"
                >
                  <Icon
                    className={[
                      "h-4 w-4 transition-colors sm:h-5 sm:w-5",
                      isActive ? "text-primary" : "text-navy/40 group-hover:text-navy/70",
                    ].join(" ")}
                    strokeWidth={2.5}
                  />
                  <span className={isActive ? "text-primary" : "text-navy/60 group-hover:text-navy"}>
                    {label}
                  </span>
                  <span
                    className={[
                      "absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-primary transition-transform ease-bounce",
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50",
                    ].join(" ")}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <Outlet />

      {!isImmersive && <Footer />}
    </div>
  );
}
