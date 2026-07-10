import { useRef, useState } from "react";
import { BookOpen, ChevronDown, ChevronRight, Home, LogOut, Menu, Mic, Sparkles, Star, Trophy, User, UserCircle, X } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import iconLogo from "@/assets/icon.png";
import { useAuth } from "@/hooks/useAuth";
import { generateUsername } from "@/lib/profile";
import { AuthModal } from "@/components/AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const tabs: {
  to: "/" | "/hoc-tap" | "/san-pham-cua-em" | "/bang-xep-hang";
  label: string;
  Icon: typeof Home;
}[] = [
  { to: "/", label: "Trang chủ", Icon: Home },
  { to: "/hoc-tap", label: "Học tập", Icon: BookOpen },
  { to: "/san-pham-cua-em", label: "Sản phẩm của em", Icon: Star },
  { to: "/bang-xep-hang", label: "Xếp hạng", Icon: Trophy },
];

const HOC_TAP_SECTIONS = [
  { to: "/hoc-tap/lo-trinh", label: "Lộ trình", Icon: BookOpen },
  { to: "/hoc-tap/luyen-noi", label: "Luyện nói", Icon: Mic },
  { to: "/hoc-tap/bang-chu-cai", label: "Bảng chữ cái", Icon: Sparkles },
] as const;

export function Navbar() {
  const { location } = useRouterState();
  const pathname = location.pathname;
  const { user, isLoading, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hocTapMenuOpen, setHocTapMenuOpen] = useState(false);
  const [mobileHocTapOpen, setMobileHocTapOpen] = useState(() => pathname.startsWith("/hoc-tap"));
  const hocTapCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openHocTapMenu = () => {
    if (hocTapCloseTimer.current) {
      clearTimeout(hocTapCloseTimer.current);
      hocTapCloseTimer.current = null;
    }
    setHocTapMenuOpen(true);
  };

  const scheduleCloseHocTapMenu = () => {
    hocTapCloseTimer.current = setTimeout(() => setHocTapMenuOpen(false), 150);
  };

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "Học sinh";
  const avatarLetter = displayName[0]?.toUpperCase() ?? "?";
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const avatarEmoji = user?.user_metadata?.avatar_emoji as string | undefined;
  const myUsername = user ? generateUsername(displayName, user.id) : null;

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      <header className="sticky top-3 z-40 w-full px-3 sm:top-4 sm:px-4">
        <nav className="mx-auto flex max-w-7xl items-center gap-4 rounded-full border border-black/5 bg-white/80 px-4 py-2.5 shadow-[0_8px_24px_-8px_oklch(0.22_0.05_30/0.18)] backdrop-blur-md sm:px-5">

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-foreground/70 transition-all hover:bg-muted md:hidden"
            aria-label="Mở menu"
          >
            <Menu className="h-5 w-5" strokeWidth={2.5} />
          </button>

          <Link
            to="/"
            className="flex shrink-0 items-center gap-2.5 transition-transform hover:scale-[1.02]"
          >
            <img src={iconLogo} alt="Logo" className="h-12 w-12 rounded-xl object-cover shadow-card" />
            <div className="text-left leading-tight">
              <div className="font-display text-base font-extrabold text-primary leading-none">Trường Tiếng Việt</div>
              <div className="font-display text-base font-extrabold text-navy leading-none">Của Em</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden flex-1 items-center justify-center gap-1 md:flex">
            {tabs.map(({ to, label, Icon }) => {
              const isActive = pathname === to || pathname.startsWith(`${to}/`);

              if (to === "/hoc-tap") {
                return (
                  <li
                    key={to}
                    onMouseEnter={openHocTapMenu}
                    onMouseLeave={scheduleCloseHocTapMenu}
                  >
                    <DropdownMenu modal={false} open={hocTapMenuOpen} onOpenChange={setHocTapMenuOpen}>
                      <DropdownMenuTrigger
                        className={[
                          "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold outline-none transition-all",
                          isActive
                            ? "bg-primary text-white shadow-sm"
                            : "text-foreground/70 hover:bg-muted hover:text-foreground",
                        ].join(" ")}
                      >
                        <Icon className="h-4 w-4" strokeWidth={2.5} />
                        <span>{label}</span>
                        <ChevronDown className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="center"
                        onMouseEnter={openHocTapMenu}
                        onMouseLeave={scheduleCloseHocTapMenu}
                        className="flex w-64 flex-col gap-1 rounded-2xl border-2 border-primary/15 bg-white p-2 shadow-xl"
                      >
                        {HOC_TAP_SECTIONS.map(({ to: sectionTo, label: sectionLabel, Icon: SectionIcon }) => (
                          <DropdownMenuItem
                            asChild
                            key={sectionTo}
                            className="rounded-xl px-3 py-2.5 text-sm font-bold focus:bg-primary/10 focus:text-primary"
                          >
                            <Link to={sectionTo} className="flex cursor-pointer items-center gap-3">
                              <SectionIcon className="h-4 w-4 text-primary" strokeWidth={2.5} />
                              {sectionLabel}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                );
              }

              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={[
                      "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all",
                      isActive
                        ? "bg-primary text-white shadow-sm"
                        : "text-foreground/70 hover:bg-muted hover:text-foreground",
                    ].join(" ")}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2.5} />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            {isLoading && (
              <div className="h-9 w-9 animate-pulse rounded-full bg-muted sm:w-28" />
            )}

            {!isLoading && !user && (
              <button
                onClick={() => setAuthOpen(true)}
                className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
              >
                <User className="h-4 w-4" strokeWidth={2.5} />
                <span className="hidden sm:inline">Đăng nhập</span>
              </button>
            )}

            {!isLoading && user && (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className="relative h-9 w-9 overflow-hidden rounded-full bg-primary text-sm font-bold text-white shadow-sm ring-2 ring-transparent transition-all hover:ring-primary/40">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    ) : avatarEmoji ? (
                      <span className="grid h-full w-full place-items-center text-lg">{avatarEmoji}</span>
                    ) : (
                      <span className="grid h-full w-full place-items-center">{avatarLetter}</span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel className="font-bold text-navy truncate">
                    {displayName}
                  </DropdownMenuLabel>
                  {myUsername && (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/u/$username"
                        params={{ username: myUsername }}
                        className="flex cursor-pointer items-center"
                      >
                        <UserCircle className="mr-2 h-4 w-4" />
                        Trang cá nhân
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={signOut}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <Link to="/" onClick={closeSidebar} className="flex items-center gap-2.5">
            <img src={iconLogo} alt="Logo" className="h-10 w-10 rounded-xl object-cover shadow-card" />
            <div className="text-left leading-tight">
              <div className="font-display text-sm font-extrabold text-primary leading-none">Trường Tiếng Việt</div>
              <div className="font-display text-sm font-extrabold text-navy leading-none">Của Em</div>
            </div>
          </Link>
          <button
            onClick={closeSidebar}
            className="grid h-8 w-8 place-items-center rounded-full text-foreground/60 hover:bg-muted"
            aria-label="Đóng menu"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-1">
            {tabs.map(({ to, label, Icon }) => {
              const isActive = pathname === to || pathname.startsWith(`${to}/`);

              if (to === "/hoc-tap") {
                return (
                  <li key={to}>
                    <button
                      onClick={() => setMobileHocTapOpen((open) => !open)}
                      className={[
                        "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all",
                        isActive
                          ? "bg-primary text-white shadow-sm"
                          : "text-foreground/70 hover:bg-muted hover:text-foreground",
                      ].join(" ")}
                    >
                      <Icon className="h-5 w-5 shrink-0" strokeWidth={2.5} />
                      <span className="flex-1 text-left">{label}</span>
                      <ChevronDown
                        className={["h-4 w-4 shrink-0 transition-transform", mobileHocTapOpen ? "rotate-180" : ""].join(" ")}
                        strokeWidth={2.5}
                      />
                    </button>
                    {mobileHocTapOpen && (
                      <ul className="mt-1 flex flex-col gap-1 pl-4">
                        {HOC_TAP_SECTIONS.map(({ to: sectionTo, label: sectionLabel, Icon: SectionIcon }) => {
                          const isSectionActive = pathname === sectionTo || pathname.startsWith(`${sectionTo}/`);
                          return (
                            <li key={sectionTo}>
                              <Link
                                to={sectionTo}
                                onClick={closeSidebar}
                                className={[
                                  "flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-bold transition-all",
                                  isSectionActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-foreground/60 hover:bg-muted hover:text-foreground",
                                ].join(" ")}
                              >
                                <ChevronRight className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
                                <SectionIcon className="h-4 w-4 shrink-0" strokeWidth={2.5} />
                                <span>{sectionLabel}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }

              return (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={closeSidebar}
                    className={[
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all",
                      isActive
                        ? "bg-primary text-white shadow-sm"
                        : "text-foreground/70 hover:bg-muted hover:text-foreground",
                    ].join(" ")}
                  >
                    <Icon className="h-5 w-5 shrink-0" strokeWidth={2.5} />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar footer — user actions */}
        <div className="border-t px-3 py-4">
          {isLoading && (
            <div className="h-12 animate-pulse rounded-2xl bg-muted" />
          )}
          {!isLoading && (user ? (
            <div className="flex flex-col gap-1">
              {myUsername && (
                <Link
                  to="/u/$username"
                  params={{ username: myUsername }}
                  onClick={closeSidebar}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-foreground/70 hover:bg-muted hover:text-foreground transition-all"
                >
                  <UserCircle className="h-5 w-5 shrink-0" strokeWidth={2.5} />
                  <span>Trang cá nhân</span>
                </Link>
              )}
              <button
                onClick={() => { signOut(); closeSidebar(); }}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-destructive hover:bg-destructive/10 transition-all"
              >
                <LogOut className="h-5 w-5 shrink-0" strokeWidth={2.5} />
                <span>Đăng xuất</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setAuthOpen(true); closeSidebar(); }}
              className="flex w-full items-center gap-3 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary/90"
            >
              <User className="h-5 w-5 shrink-0" strokeWidth={2.5} />
              <span>Đăng nhập</span>
            </button>
          ))}
        </div>
      </aside>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
