import { createFileRoute, Link, Outlet, useChildMatches, useRouterState } from "@tanstack/react-router";
import { BookOpen, Mic, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const TABS = [
  { to: "/hoc-tap/lo-trinh", label: "Lộ trình", Icon: BookOpen },
  { to: "/hoc-tap/luyen-noi", label: "Luyện nói", Icon: Mic },
  { to: "/hoc-tap/bang-chu-cai", label: "Bảng chữ cái", Icon: Sparkles },
] as const;

export const Route = createFileRoute("/hoc-tap")({
  component: HocTapLayout,
});

function HocTapLayout() {
  const { location } = useRouterState();
  const pathname = location.pathname;

  const childMatches = useChildMatches();
  const isLessonView = childMatches.some((m) => m.routeId === "/hoc-tap/lo-trinh/quyen-1/$changId");
  const isImmersive = pathname.startsWith("/hoc-tap/lo-trinh/quyen-1") && !isLessonView;
  const isAlphabetPage = pathname === "/hoc-tap/bang-chu-cai";

  const activeTab = TABS.find((tab) => pathname === tab.to || pathname.startsWith(`${tab.to}/`)) ?? TABS[0];
  const extraCrumb = isLessonView ? "Quyển 1" : pathname === "/hoc-tap/lo-trinh/quyen-2" ? "Quyển 2" : null;

  return (
    <div
      className={[
        isImmersive ? "flex h-screen flex-col overflow-hidden" : "flex min-h-screen flex-col",
        isAlphabetPage && "bg-gradient-to-b from-sky-300 to-sky-200",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Navbar />

      {!isImmersive && (
        <div
          className={[
            "flex shrink-0 justify-center px-4 pb-3 pt-6 sm:px-5 sm:pb-4 sm:pt-8",
            isAlphabetPage ? "" : "border-b border-black/5 bg-white/60 backdrop-blur-md",
          ].join(" ")}
        >
          <Breadcrumb className="mx-auto w-full max-w-7xl">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/hoc-tap/lo-trinh">Học tập</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {extraCrumb ? (
                  <BreadcrumbLink asChild>
                    <Link to={activeTab.to}>{activeTab.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="font-bold text-navy">{activeTab.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {extraCrumb && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-bold text-navy">{extraCrumb}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}

      <Outlet />

      {!isImmersive && <Footer />}
    </div>
  );
}
