import { useState } from "react";
import { Icon, type IconifyIcon } from "@iconify/react";
import roundHome from "@iconify-icons/ic/round-home";
import roundAutoStories from "@iconify-icons/ic/round-auto-stories";
import roundSchool from "@iconify-icons/ic/round-school";
import roundEmojiEvents from "@iconify-icons/ic/round-emoji-events";
import roundLogin from "@iconify-icons/ic/round-login";
import roundBarChart from "@iconify-icons/ic/round-bar-chart";
import roundExpandMore from "@iconify-icons/ic/round-expand-more";
import roundLogout from "@iconify-icons/ic/round-logout";
import roundMenu from "@iconify-icons/ic/round-menu";
import roundAccountCircle from "@iconify-icons/ic/round-account-circle";
import roundClose from "@iconify-icons/ic/round-close";
import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useHasRole } from "@/hooks/useHasRole";
import { generateUsername } from "@/lib/profile";
import { Logo } from "@/components/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const tabs: {
  to: "/" | "/hoc-tap" | "/giao-vien" | "/bang-xep-hang";
  label: string;
  icon: IconifyIcon;
}[] = [
  { to: "/", label: "Trang chủ", icon: roundHome },
  { to: "/hoc-tap", label: "Học tập", icon: roundAutoStories },
  { to: "/giao-vien", label: "Giáo viên", icon: roundSchool },
  { to: "/bang-xep-hang", label: "Xếp hạng", icon: roundEmojiEvents },
];

/* Shared pill states. Hover and "you are here" both shade the green rather
   than washing it white, which would drop the white type's contrast; the
   active label is gold-soft, since full gold fails AA on this green. */
const PILL_HOVER = "hover:bg-black/[0.14]";
const PILL_ACTIVE = "text-gold-soft bg-black/[0.22]";

/** A drawer row: the same pill treatment as the desktop tabs, one per line. */
const DRAWER_ROW =
  "flex w-full items-center gap-3 rounded-xl min-h-[52px] px-3 text-left font-display text-[1.0625rem] font-bold transition-colors";

export function Navbar() {
  const { location } = useRouterState();
  const pathname = location.pathname;
  const { user, isLoading, signOut } = useAuth();
  const isStaff = useHasRole("staff");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  // Any profile page lights the avatar, not just your own — the ring marks
  // "you are in the profile section", the same way the tab pills do.
  const onProfile = pathname.startsWith("/u/");

  const isTabActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      {/* One flat green bar — a shaded step of the same meadow the footer sits
        on, so the page opens and closes on one colour. No border: the bar meets
        the sky directly, the way the grass does at the other end. */}
      <header className="sticky top-0 z-40 w-full bg-nav-green">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:h-[4.5rem] sm:px-6">
          <Link to="/" className="shrink-0 transition-transform hover:scale-[1.03]">
            <Logo size="sm" variant="wordmark" className="art-outline-white h-11 sm:h-14" />
          </Link>

          <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
            {/* Desktop tabs — a row of pills, each led by its icon. */}
            <nav
              aria-label="Điều hướng chính"
              className="hidden items-center gap-1 min-[900px]:flex"
            >
              {tabs.map(({ to, label, icon }) => {
                const isActive = isTabActive(to);

                return (
                  <Link
                    key={to}
                    to={to}
                    aria-current={isActive ? "page" : undefined}
                    className={[
                      "inline-flex min-h-12 items-center gap-2 rounded-full px-4 font-display text-[1rem] font-bold transition-colors",
                      isActive ? PILL_ACTIVE : ["text-white", PILL_HOVER].join(" "),
                    ].join(" ")}
                  >
                    <Icon icon={icon} className="h-5 w-5" aria-hidden />
                    {label}
                  </Link>
                );
              })}
            </nav>

            {isLoading && (
              <div className="h-12 w-12 animate-pulse rounded-full bg-white/30 sm:w-[7.5rem]" />
            )}

            {!isLoading && !user && (
              <Link
                to="/dang-nhap"
                search={authSearch}
                className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-white px-4 font-display text-[1rem] font-bold text-indigo-deep shadow-btn transition-[colors,transform,box-shadow] hover:bg-box-white-deep active:translate-y-[1px] active:shadow-btn-active sm:px-6"
              >
                {/* Hidden on phones so logo, sign-in and Menu fit at 375px. */}
                <Icon icon={roundLogin} className="hidden h-5 w-5 sm:block" aria-hidden />
                Đăng nhập
              </Link>
            )}

            {!isLoading && user && (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button
                    aria-current={onProfile ? "page" : undefined}
                    aria-label={`Tài khoản: ${displayName}`}
                    className={[
                      "flex min-h-12 items-center gap-2 rounded-full border-[3px] py-0.5 pl-0.5 pr-0.5 text-white transition-colors sm:pr-3",
                      onProfile
                        ? "border-gold bg-black/[0.22]"
                        : ["border-white/70", PILL_HOVER].join(" "),
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

                    <span className="hidden max-w-[10rem] truncate font-display text-[0.9375rem] font-bold sm:block">
                      {displayName}
                    </span>

                    <Icon
                      icon={roundExpandMore}
                      className="hidden h-5 w-5 shrink-0 sm:block"
                      aria-hidden
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
                        className="flex min-h-12 cursor-pointer items-center gap-3 [&>svg]:size-5"
                      >
                        <Icon icon={roundAccountCircle} className="h-5 w-5" aria-hidden />
                        Trang cá nhân
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isStaff && (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/dashboard"
                        className="flex min-h-12 cursor-pointer items-center gap-3 [&>svg]:size-5"
                      >
                        <Icon icon={roundBarChart} className="h-5 w-5" aria-hidden />
                        Báo cáo
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={signOut}
                    className="min-h-12 cursor-pointer gap-3 text-destructive focus:text-destructive [&>svg]:size-5"
                  >
                    <Icon icon={roundLogout} className="h-5 w-5" aria-hidden />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Below 900px the tabs fold into the drawer. The button always says
              "Menu" next to the icon, so it never reads as a bare glyph. */}
            <SheetTrigger asChild>
              <button className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full px-2 font-display text-[1rem] font-bold text-white transition-colors hover:bg-black/[0.14] sm:px-3 min-[900px]:hidden">
                <Icon icon={roundMenu} className="h-6 w-6" aria-hidden />
                Menu
              </button>
            </SheetTrigger>
          </div>
        </div>
      </header>

      {/* Drawer — the same flat green as the bar it drops out of, so the menu
        reads as the header unfolding rather than a second surface. The Sheet
        brings the focus trap, Esc and scroll lock. */}
      <SheetContent
        side="left"
        hideCloseButton
        className="flex w-72 flex-col gap-0 border-0 bg-nav-green p-0 text-white"
      >
        <SheetTitle className="sr-only">Menu</SheetTitle>

        <div className="flex min-h-16 items-center justify-between px-5 sm:min-h-[4.5rem]">
          <SheetClose asChild>
            <Link to="/">
              <Logo size="sm" variant="wordmark" className="art-outline-white h-11 sm:h-14" />
            </Link>
          </SheetClose>
          <SheetClose
            className={[
              "grid h-12 w-12 place-items-center rounded-full text-white transition-colors",
              PILL_HOVER,
            ].join(" ")}
            aria-label="Đóng menu"
          >
            <Icon icon={roundClose} className="h-6 w-6" aria-hidden />
          </SheetClose>
        </div>

        <nav aria-label="Điều hướng chính" className="flex-1 overflow-y-auto px-3 py-2">
          <ul className="flex flex-col">
            {tabs.map(({ to, label, icon }) => {
              const isActive = isTabActive(to);

              return (
                <li key={to}>
                  <SheetClose asChild>
                    <Link
                      to={to}
                      aria-current={isActive ? "page" : undefined}
                      className={[
                        DRAWER_ROW,
                        isActive ? PILL_ACTIVE : ["text-white", PILL_HOVER].join(" "),
                      ].join(" ")}
                    >
                      <Icon icon={icon} className="h-6 w-6 shrink-0" aria-hidden />
                      {label}
                    </Link>
                  </SheetClose>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Account actions, in the same row style below a hairline. */}
        <div className="border-t border-white/20 px-3 py-2">
          {isLoading && <div className="my-1 h-12 animate-pulse rounded-xl bg-white/25" />}
          {!isLoading &&
            (user ? (
              <div className="flex flex-col">
                {myUsername && (
                  <SheetClose asChild>
                    <Link
                      to="/u/$username"
                      params={{ username: myUsername }}
                      className={[DRAWER_ROW, "text-white", PILL_HOVER].join(" ")}
                    >
                      <Icon icon={roundAccountCircle} className="h-6 w-6 shrink-0" aria-hidden />
                      Trang cá nhân
                    </Link>
                  </SheetClose>
                )}
                <button
                  onClick={() => {
                    signOut();
                    setSidebarOpen(false);
                  }}
                  className={[DRAWER_ROW, "cursor-pointer text-white", PILL_HOVER].join(" ")}
                >
                  <Icon icon={roundLogout} className="h-6 w-6 shrink-0" aria-hidden />
                  Đăng xuất
                </button>
              </div>
            ) : (
              <SheetClose asChild>
                <Link
                  to="/dang-nhap"
                  search={authSearch}
                  className={[DRAWER_ROW, "text-white", PILL_HOVER].join(" ")}
                >
                  <Icon icon={roundLogin} className="h-6 w-6 shrink-0" aria-hidden />
                  Đăng nhập
                </Link>
              </SheetClose>
            ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
