import { useState } from "react";
import { BarChart3, ChevronDown, Flame, LogOut, Menu, Star, UserCircle, X } from "lucide-react";
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
}[] = [
  { to: "/", label: "Trang chủ" },
  { to: "/hoc-tap", label: "Học tập" },
  { to: "/san-pham-cua-em", label: "Sản phẩm của em" },
  { to: "/bang-xep-hang", label: "Xếp hạng" },
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
      {/* One flat green bar — a shaded step of the same meadow the footer sits
        on, so the page opens and closes on one colour. No border: the bar meets
        the sky directly, the way the grass does at the other end. */}
      <header className="sticky top-0 z-40 w-full bg-nav-green">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:h-[4.5rem] sm:px-6">
          <Link to="/" className="shrink-0 transition-transform hover:scale-[1.03]">
            <Logo size="sm" variant="wordmark" className="art-outline-white" />
          </Link>

          <div className="flex flex-1 items-center justify-end gap-1">
            {/* Desktop links — hairline white rules between them, as in the
              reference. Each rule belongs to the item that follows it, and the
              last item adds a trailing one so the row is bracketed. */}
            <nav aria-label="Global" className="hidden items-center min-[900px]:flex">
              {tabs.map(({ to, label }, index) => {
                const isActive = to === "/" ? pathname === "/" : pathname.startsWith(to);

                return (
                  <span key={to} className="flex items-center">
                    <span className="mx-4 h-5 w-px bg-white/40" aria-hidden="true" />
                    <Link
                      to={to}
                      className={[
                        "font-display text-sm font-bold transition-colors",
                        isActive ? "text-gold" : "text-white hover:text-gold-soft",
                      ].join(" ")}
                    >
                      {label}
                    </Link>
                    {index === tabs.length - 1 && (
                      <span className="mx-4 h-5 w-px bg-white/40" aria-hidden="true" />
                    )}
                  </span>
                );
              })}
            </nav>

            {isLoading && (
              <div className="h-9 w-9 animate-pulse rounded-full bg-white/30 sm:w-28" />
            )}

            {!isLoading && !user && (
              <button
                onClick={() => openAuth("login")}
                className="shrink-0 px-1 font-display text-sm font-bold text-white transition-colors hover:text-gold-soft"
              >
                Đăng nhập
              </button>
            )}

            {!isLoading && user && (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button
                    aria-current={onProfile ? "page" : undefined}
                    className={[
                      "flex items-center gap-2.5 rounded-full border-[3px] py-1 pl-1 pr-3 transition-all",
                      onProfile ? "border-gold bg-white/25" : "border-white/70 hover:bg-white/20",
                    ].join(" ")}
                  >
                    <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-primary text-sm font-medium text-white">
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
                    </span>

                    <span className="hidden items-center gap-1.5 sm:flex">
                      <span className="hidden items-center gap-1 rounded-full bg-white px-2 py-0.5 text-xs font-bold text-amber-700 min-[900px]:flex">
                        <Star
                          className="h-3.5 w-3.5 fill-amber-400 text-amber-500"
                          strokeWidth={2}
                        />
                        240
                      </span>
                      <span className="hidden items-center gap-1 rounded-full bg-white px-2 py-0.5 text-xs font-bold text-orange-700 min-[900px]:flex">
                        <Flame
                          className="h-3.5 w-3.5 fill-orange-400 text-orange-500"
                          strokeWidth={2}
                        />
                        12
                      </span>
                      <span className="max-w-[10rem] truncate font-display text-sm font-bold text-white">
                        {displayName}
                      </span>
                    </span>

                    <ChevronDown
                      className="hidden h-3.5 w-3.5 shrink-0 text-white sm:block"
                      strokeWidth={3}
                    />
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
                      <Link to="/dashboard" className="flex cursor-pointer items-center">
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

            {/* The burger stays at every width, as in the reference: on desktop
              it opens the same drawer as a shortcut to the full link set. */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="ml-1 grid h-10 w-10 shrink-0 place-items-center rounded-lg text-white transition hover:bg-white/20"
              aria-label="Mở menu"
            >
              <Menu className="h-5 w-5" strokeWidth={3} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-sky-ink/40 backdrop-blur-sm" onClick={closeSidebar} />
      )}

      {/* Sidebar drawer — the same flat green as the bar it drops out of, so the
        menu reads as the header unfolding rather than a second surface. Text
        only: white labels, gold for the page you are on. */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-nav-green shadow-2xl transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between px-5 sm:h-[4.5rem]">
          <Link to="/" onClick={closeSidebar}>
            <Logo size="sm" variant="wordmark" className="art-outline-white" />
          </Link>
          <button
            onClick={closeSidebar}
            className="grid h-9 w-9 place-items-center rounded-lg text-white transition hover:bg-white/20"
            aria-label="Đóng menu"
          >
            <X className="h-5 w-5" strokeWidth={3} />
          </button>
        </div>

        {/* Nav links — a plain list of labels on the green, nothing between them. */}
        <nav className="flex-1 overflow-y-auto px-5 py-2">
          <ul className="flex flex-col">
            {tabs.map(({ to, label }) => {
              const isActive = to === "/" ? pathname === "/" : pathname.startsWith(to);

              return (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={closeSidebar}
                    className={[
                      "block py-3.5 font-display text-base font-bold transition-colors",
                      isActive ? "text-gold" : "text-white hover:text-gold-soft",
                    ].join(" ")}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar footer — user actions, same text-only treatment */}
        <div className="px-5 py-2">
          {isLoading && <div className="my-2 h-6 animate-pulse rounded bg-white/25" />}
          {!isLoading &&
            (user ? (
              <div className="flex flex-col">
                {myUsername && (
                  <Link
                    to="/u/$username"
                    params={{ username: myUsername }}
                    onClick={closeSidebar}
                    className="block py-3.5 font-display text-base font-bold text-white transition-colors hover:text-gold-soft"
                  >
                    Trang cá nhân
                  </Link>
                )}
                <button
                  onClick={() => {
                    signOut();
                    closeSidebar();
                  }}
                  className="py-3.5 text-left font-display text-base font-bold text-white transition-colors hover:text-gold-soft"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  openAuth("login");
                  closeSidebar();
                }}
                className="py-3.5 text-left font-display text-base font-bold text-white transition-colors hover:text-gold-soft"
              >
                Đăng nhập
              </button>
            ))}
        </div>
      </aside>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
    </>
  );
}
