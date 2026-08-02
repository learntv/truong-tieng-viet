import { useState } from "react";
import { BarChart3, BookOpen, ChevronDown, Flame, Home, LogOut, Menu, Star, Trophy, User, UserCircle, X } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useHasRole } from "@/hooks/useHasRole";
import { generateUsername } from "@/lib/profile";
import { AuthModal } from "@/components/AuthModal";
import { Logo } from "@/components/Logo";
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

export function Navbar() {
  const { location } = useRouterState();
  const pathname = location.pathname;
  const { user, isLoading, signOut } = useAuth();
  const isStaff = useHasRole("staff");
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openAuth = (tab: "login" | "register") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "Học sinh";
  const avatarLetter = displayName[0]?.toUpperCase() ?? "?";
  // The profiles row is the source of truth — user_metadata gets overwritten by the OAuth
  // provider (e.g. Google's picture) on every login, so it can't be trusted for a saved avatar.
  const { data: ownProfile } = useQuery({
    queryKey: ["own-profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url, avatar_emoji")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
  const avatarUrl = ownProfile
    ? ownProfile.avatar_url
    : (user?.user_metadata?.avatar_url as string | undefined);
  const avatarEmoji = ownProfile
    ? ownProfile.avatar_emoji
    : (user?.user_metadata?.avatar_emoji as string | undefined);
  const myUsername = user ? generateUsername(displayName, user.id) : null;
  // Any profile page lights the avatar, not just your own — the ring marks
  // "you are in the profile section", the same way the tab pills do.
  const onProfile = pathname.startsWith("/u/");

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background">
        {/* Row 1 — logo, centered regardless of what sits in the side columns */}
        <div className="mx-auto grid h-20 max-w-6xl grid-cols-3 items-center px-4 sm:px-6">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-foreground/70 transition hover:bg-muted min-[900px]:hidden"
              aria-label="Mở menu"
            >
              <Menu className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </div>

          <Link
            to="/"
            className="col-start-2 flex justify-self-center transition-transform hover:scale-[1.02]"
          >
            <Logo size="sm" variant="wordmark" />
          </Link>

          <div className="col-start-3 flex items-center justify-end gap-2">
            {isLoading && <div className="h-9 w-9 animate-pulse rounded-full bg-muted sm:w-28" />}

            {!isLoading && !user && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuth("login")}
                  className="rounded-md px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => openAuth("register")}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Đăng ký
                </button>
              </div>
            )}

            {!isLoading && user && (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button
                    aria-current={onProfile ? "page" : undefined}
                    className={[
                      "flex items-center gap-2.5 rounded-sm border py-2 pl-2 pr-3 transition-all",
                      onProfile
                        ? "border-primary bg-primary/5"
                        : "border-border/60 hover:bg-muted",
                    ].join(" ")}
                  >
                    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-primary text-base font-medium text-white">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Avatar"
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : avatarEmoji ? (
                        <span className="grid h-full w-full place-items-center text-xl">
                          {avatarEmoji}
                        </span>
                      ) : (
                        <span className="grid h-full w-full place-items-center">
                          {avatarLetter}
                        </span>
                      )}
                    </span>

                    <span className="hidden flex-col items-start gap-1 sm:flex">
                      <span className="hidden items-center gap-1.5 min-[900px]:flex">
                        <span className="flex items-center gap-1 rounded-sm border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" strokeWidth={2} />
                          240
                        </span>
                        <span className="flex items-center gap-1 rounded-sm border border-orange-200 bg-orange-50 px-2 py-0.5 text-xs font-bold text-orange-700">
                          <Flame className="h-3.5 w-3.5 fill-orange-400 text-orange-500" strokeWidth={2} />
                          12
                        </span>
                      </span>

                      <span className="max-w-[16rem] truncate text-sm text-foreground">
                        Xin chào, <span className="font-bold">{displayName}</span>!
                      </span>
                    </span>

                    <ChevronDown className="hidden h-3.5 w-3.5 shrink-0 text-foreground/50 sm:block" strokeWidth={2.5} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel className="font-medium text-navy truncate">
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
                  {isStaff && (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/dashboard"
                        className="flex cursor-pointer items-center"
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Báo cáo
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
        </div>

        {/* Row 2 — nav links, desktop only (mobile uses the sidebar drawer) */}
        <div className="hidden border-t border-border/60 min-[900px]:block">
          <nav aria-label="Global" className="mx-auto max-w-6xl px-4 sm:px-6">
            <ul className="flex items-center justify-center py-3 text-sm">
              {tabs.map(({ to, label }, index) => {
                const isActive = pathname === to || pathname.startsWith(`${to}/`);

                return (
                  <li key={to} className="flex items-center">
                    <span className="mx-8 h-4 w-px bg-border" aria-hidden="true" />
                    <Link
                      to={to}
                      className={[
                        "font-medium transition-colors",
                        isActive
                          ? "text-primary"
                          : "text-foreground/60 hover:text-foreground",
                      ].join(" ")}
                    >
                      {label}
                    </Link>
                    {index === tabs.length - 1 && (
                      <span className="mx-8 h-4 w-px bg-border" aria-hidden="true" />
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm min-[900px]:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out min-[900px]:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <Link to="/" onClick={closeSidebar}>
            <Logo size="sm" variant="wordmark" />
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

              return (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={closeSidebar}
                    className={[
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
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
          {isLoading && <div className="h-12 animate-pulse rounded-2xl bg-muted" />}
          {!isLoading &&
            (user ? (
              <div className="flex flex-col gap-1">
                {myUsername && (
                  <Link
                    to="/u/$username"
                    params={{ username: myUsername }}
                    onClick={closeSidebar}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground transition-all"
                  >
                    <UserCircle className="h-5 w-5 shrink-0" strokeWidth={2.5} />
                    <span>Trang cá nhân</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    signOut();
                    closeSidebar();
                  }}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
                >
                  <LogOut className="h-5 w-5 shrink-0" strokeWidth={2.5} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    openAuth("register");
                    closeSidebar();
                  }}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary/90"
                >
                  <User className="h-5 w-5 shrink-0" strokeWidth={2.5} />
                  <span>Đăng ký</span>
                </button>
                <button
                  onClick={() => {
                    openAuth("login");
                    closeSidebar();
                  }}
                  className="flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-medium text-foreground/70 transition-all hover:bg-muted hover:text-foreground"
                >
                  <span>Đăng nhập</span>
                </button>
              </div>
            ))}
        </div>
      </aside>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
    </>
  );
}
