import { useState } from "react";
import { BarChart3, BookOpen, Home, LogOut, Menu, Star, Trophy, User, UserCircle, X } from "lucide-react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <header className="sticky top-4 z-40 w-full px-4">
        <nav className="mx-auto flex w-full max-w-6xl items-center gap-4 rounded-full border border-border/60 bg-white/90 px-4 py-2.5 shadow-card backdrop-blur-md sm:px-6">
          <div className="relative flex w-full items-center gap-4">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-foreground/70 transition-all hover:bg-muted min-[900px]:hidden"
              aria-label="Mở menu"
            >
              <Menu className="h-5 w-5" strokeWidth={2.5} />
            </button>

            <Link to="/" className="transition-transform hover:scale-[1.02]">
              <Logo size="sm" />
            </Link>

            {/* Desktop nav — centered on the whole bar via absolute positioning, so it stays
            put regardless of how wide the logo or the auth control on the right are. */}
            <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 min-[900px]:flex">
              {tabs.map(({ to, label }) => {
                const isActive = pathname === to || pathname.startsWith(`${to}/`);

                return (
                  <li key={to}>
                    <Link
                      to={to}
                      className={[
                        "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-bold transition-colors",
                        isActive
                          ? "bg-primary text-white"
                          : "text-foreground/70 hover:bg-muted hover:text-foreground",
                      ].join(" ")}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="ml-auto flex shrink-0 items-center gap-2">
              {isLoading && <div className="h-9 w-9 animate-pulse rounded-full bg-muted sm:w-28" />}

              {!isLoading && !user && (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90"
                >
                  <User className="h-4 w-4" strokeWidth={2.5} />
                  <span className="hidden sm:inline">Đăng nhập</span>
                </button>
              )}

              {!isLoading && user && (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <button
                      aria-current={onProfile ? "page" : undefined}
                      className={[
                        "relative h-9 w-9 overflow-hidden rounded-full bg-primary text-sm font-bold text-white shadow-sm transition-all",
                        "ring-2 ring-offset-2 ring-offset-white",
                        onProfile
                          ? "ring-primary"
                          : "ring-transparent hover:ring-primary/40",
                      ].join(" ")}
                    >
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Avatar"
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : avatarEmoji ? (
                        <span className="grid h-full w-full place-items-center text-lg">
                          {avatarEmoji}
                        </span>
                      ) : (
                        <span className="grid h-full w-full place-items-center">
                          {avatarLetter}
                        </span>
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
        </nav>
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
            <Logo size="sm" />
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
          {isLoading && <div className="h-12 animate-pulse rounded-2xl bg-muted" />}
          {!isLoading &&
            (user ? (
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
                  onClick={() => {
                    signOut();
                    closeSidebar();
                  }}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-destructive hover:bg-destructive/10 transition-all"
                >
                  <LogOut className="h-5 w-5 shrink-0" strokeWidth={2.5} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthOpen(true);
                  closeSidebar();
                }}
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
