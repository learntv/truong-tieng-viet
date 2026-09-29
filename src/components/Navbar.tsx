import { useEffect, useState } from "react";
import {
  BarChart3,
  BookOpen,
  ChevronDown,
  Flame,
  House,
  LogOut,
  Palette,
  Star,
  Trophy,
  UserCircle,
  type LucideIcon,
} from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useHasRole } from "@/hooks/useHasRole";
import { generateUsername } from "@/lib/profile";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TabTo = "/" | "/hoc-tap" | "/san-pham-cua-em" | "/bang-xep-hang";

/**
 * The four destinations. Each owns a hue, spent only when it is the page you
 * are on — the pill fills with it on desktop, the icon capsule on mobile — so
 * the bar stays white and calm until it tells you where you are.
 */
const TABS: {
  to: TabTo;
  label: string;
  short: string;
  Icon: LucideIcon;
  active: string;
  capsule: string;
}[] = [
  {
    to: "/",
    label: "Trang chủ",
    short: "Trang chủ",
    Icon: House,
    active: "bg-coral-50 text-coral-700",
    capsule: "bg-coral-600",
  },
  {
    to: "/hoc-tap",
    label: "Học tập",
    short: "Học tập",
    Icon: BookOpen,
    active: "bg-brand-50 text-brand-700",
    capsule: "bg-brand-600",
  },
  {
    to: "/san-pham-cua-em",
    label: "Sản phẩm của em",
    short: "Sản phẩm",
    Icon: Palette,
    active: "bg-grape-50 text-grape-700",
    capsule: "bg-grape-600",
  },
  {
    to: "/bang-xep-hang",
    label: "Xếp hạng",
    short: "Xếp hạng",
    Icon: Trophy,
    active: "bg-sun-50 text-sun-700",
    capsule: "bg-sun-500 text-ink-900",
  },
];

const isTabActive = (to: TabTo, pathname: string) =>
  to === "/" ? pathname === "/" : pathname.startsWith(to);

export function Navbar() {
  const { location } = useRouterState();
  const pathname = location.pathname;
  const { user, isLoading, signOut } = useAuth();
  const isStaff = useHasRole("staff");
  const [scrolled, setScrolled] = useState(false);

  // The hairline under the bar only appears once content scrolls beneath it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sign-in is its own page; send people back to where they were when done.
  const authSearch = {
    tab: "login" as const,
    redirect: pathname === "/dang-nhap" ? undefined : pathname,
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
  const onProfile = pathname.startsWith("/u/");

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur-md transition-[border-color,box-shadow] duration-200 supports-[backdrop-filter]:bg-white/80",
          scrolled
            ? "border-ink-100 shadow-[0_6px_20px_-12px_rgb(20_28_49/0.18)]"
            : "border-transparent",
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6 md:h-[4.5rem] lg:px-8">
          <Link
            to="/"
            aria-label="Trường Tiếng Việt Của Em — Trang chủ"
            className="shrink-0 rounded-xl transition-transform duration-200 hover:scale-[1.02]"
          >
            <Logo variant="wordmark" size="sm" />
          </Link>

          <nav aria-label="Chính" className="mx-auto hidden md:block">
            <ul className="flex items-center gap-1">
              {TABS.map(({ to, label, Icon, active }) => {
                const isActive = isTabActive(to, pathname);
                return (
                  <li key={to}>
                    <Link
                      to={to}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex h-10 items-center gap-2 rounded-full px-3.5 text-[0.9375rem] font-semibold transition-colors duration-200 lg:px-4",
                        isActive ? active : "text-ink-600 hover:bg-ink-50 hover:text-ink-900",
                      )}
                    >
                      <Icon className="size-[1.1rem]" strokeWidth={2.25} aria-hidden />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            {isLoading && (
              <div className="h-10 w-10 animate-pulse rounded-full bg-ink-100 sm:w-32" />
            )}

            {!isLoading && !user && (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Link to="/dang-nhap" search={authSearch}>
                    Đăng nhập
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/dang-nhap" search={{ ...authSearch, tab: "register" as const }}>
                    <span className="sm:hidden">Đăng nhập</span>
                    <span className="hidden sm:inline">Học miễn phí</span>
                  </Link>
                </Button>
              </>
            )}

            {!isLoading && user && (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button
                    aria-current={onProfile ? "page" : undefined}
                    className={cn(
                      "flex h-11 cursor-pointer items-center gap-2 rounded-full border bg-white py-1 pr-1 pl-1 transition-[border-color,box-shadow] duration-200 hover:shadow-sm sm:pr-3",
                      onProfile
                        ? "border-brand-300 ring-4 ring-brand-50"
                        : "border-ink-100 hover:border-ink-200",
                    )}
                  >
                    <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-600 text-sm font-bold text-white">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt=""
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : avatarEmoji ? (
                        <span className="text-lg">{avatarEmoji}</span>
                      ) : (
                        avatarLetter
                      )}
                    </span>

                    <span className="hidden items-center gap-1 lg:flex" aria-hidden>
                      <span className="flex h-7 items-center gap-1 rounded-full bg-sun-50 px-2 text-caption font-bold text-sun-700">
                        <Star className="size-3.5 fill-sun-500 text-sun-600" strokeWidth={2} />
                        240
                      </span>
                      <span className="flex h-7 items-center gap-1 rounded-full bg-coral-50 px-2 text-caption font-bold text-coral-700">
                        <Flame className="size-3.5 fill-coral-500 text-coral-600" strokeWidth={2} />
                        12
                      </span>
                    </span>

                    <span className="hidden max-w-[9rem] truncate text-sm font-semibold text-ink-800 sm:block">
                      {displayName}
                    </span>
                    <ChevronDown
                      className="hidden size-4 shrink-0 text-ink-400 sm:block"
                      strokeWidth={2.5}
                    />
                    <span className="sr-only">Mở menu tài khoản</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  <DropdownMenuLabel className="truncate">{displayName}</DropdownMenuLabel>
                  {myUsername && (
                    <DropdownMenuItem asChild>
                      <Link to="/u/$username" params={{ username: myUsername }}>
                        <UserCircle className="text-brand-600" />
                        Trang cá nhân
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isStaff && (
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">
                        <BarChart3 className="text-grape-600" />
                        Báo cáo
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={signOut}
                    className="text-danger-600 focus:bg-danger-50 focus:text-danger-700"
                  >
                    <LogOut />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      <MobileTabBar pathname={pathname} />
    </>
  );
}

/**
 * Phones get the four destinations as an app-style tab bar pinned to the
 * bottom, where a thumb already is — no drawer to open first. The page you
 * are on fills its icon capsule with its own hue.
 */
function MobileTabBar({ pathname }: { pathname: string }) {
  return (
    <nav
      aria-label="Chính"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-100 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-16px_rgb(20_28_49/0.2)] backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto grid h-[4.25rem] max-w-md grid-cols-4">
        {TABS.map(({ to, short, Icon, capsule }) => {
          const isActive = isTabActive(to, pathname);
          return (
            <li key={to}>
              <Link
                to={to}
                aria-current={isActive ? "page" : undefined}
                className="group flex h-full flex-col items-center justify-center gap-1 rounded-xl"
              >
                <span
                  className={cn(
                    "grid h-8 w-14 place-items-center rounded-full transition-[background-color,transform] duration-200 ease-out",
                    isActive ? cn("text-white", capsule) : "text-ink-500 group-active:scale-95",
                  )}
                >
                  <Icon className="size-5" strokeWidth={2.25} aria-hidden />
                </span>
                <span
                  className={cn(
                    "text-[0.6875rem] leading-none font-semibold",
                    isActive ? "text-ink-900" : "text-ink-500",
                  )}
                >
                  {short}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
