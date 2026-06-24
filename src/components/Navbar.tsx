import { BookOpen, Home, Star, User } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import iconLogo from "@/assets/icon.png";

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

  return (
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
          <button className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow-md">
            <User className="h-4 w-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">Đăng nhập</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
