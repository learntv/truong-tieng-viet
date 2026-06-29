import { useState } from "react";
import { BookOpen, Home, LogOut, Star, User, UserCircle } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import iconLogo from "@/assets/icon.png";
import { useAuth } from "@/hooks/useAuth";
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
  to: "/" | "/hoc-tieng-viet" | "/san-pham-cua-em";
  label: string;
  Icon: typeof Home;
}[] = [
  { to: "/", label: "Trang chủ", Icon: Home },
  { to: "/hoc-tieng-viet", label: "Học Tiếng Việt", Icon: BookOpen },
  { to: "/san-pham-cua-em", label: "Sản phẩm của em", Icon: Star },
];

export function Navbar() {
  const { location } = useRouterState();
  const pathname = location.pathname;
  const { user, isLoading, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  const avatarLetter = user?.email?.[0]?.toUpperCase() ?? "?";
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white shadow-[0_2px_8px_-2px_oklch(0.22_0.05_30/0.12)]">
        <nav className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2.5 transition-transform hover:scale-[1.02]"
          >
            <img src={iconLogo} alt="Logo" className="h-16 w-16 rounded-xl object-cover shadow-card" />
            <div className="text-left leading-tight">
              <div className="font-display text-base font-extrabold text-primary leading-none">Trường Tiếng Việt</div>
              <div className="font-display text-base font-extrabold text-navy leading-none">Của Em</div>
            </div>
          </Link>

          <ul className="hidden flex-1 items-center justify-center gap-1 md:flex">
            {tabs.map(({ to, label, Icon }) => {
              const isActive = pathname === to;
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

          <ul className="flex items-center gap-1 md:hidden">
            {tabs.map(({ to, Icon }) => {
              const isActive = pathname === to;
              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={[
                      "grid h-9 w-9 place-items-center rounded-full transition-all",
                      isActive ? "bg-primary text-white" : "text-foreground/60 hover:bg-muted",
                    ].join(" ")}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2.5} />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="ml-auto flex shrink-0 items-center gap-2">
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
                    ) : (
                      <span className="grid h-full w-full place-items-center">{avatarLetter}</span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel className="truncate text-xs font-normal text-muted-foreground">
                    {user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/trang-ca-nhan"
                      className="flex cursor-pointer items-center"
                    >
                      <UserCircle className="mr-2 h-4 w-4" />
                      Trang cá nhân
                    </Link>
                  </DropdownMenuItem>
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

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
