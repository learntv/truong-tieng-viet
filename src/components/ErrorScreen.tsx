import { useEffect } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { reportLovableError } from "@/lib/lovable-error-reporting";

// Shared error/404 screens for both the router's defaultErrorComponent and the
// root route's errorComponent/notFoundComponent, so every boundary reports to
// Lovable and shows the same Vietnamese-language UI.

export function ErrorScreen({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "router_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Trang này chưa tải được
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Có lỗi xảy ra từ phía chúng tôi. Em hãy thử tải lại, hoặc quay về trang chủ nhé.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 font-display text-sm font-extrabold text-primary-foreground shadow-bevel-primary transition-[transform,box-shadow,filter] ease-bounce hover:-translate-y-0.5 hover:scale-[1.03] hover:brightness-105 active:translate-y-[3px] active:scale-100 active:shadow-bevel-primary-active"
          >
            Thử lại
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border-2 border-input bg-background px-4 py-2 font-display text-sm font-extrabold text-foreground shadow-bevel-neutral transition-[transform,box-shadow,background-color] ease-bounce hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-accent active:translate-y-[3px] active:scale-100 active:shadow-bevel-neutral-active"
          >
            Về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}

export function NotFoundScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Không tìm thấy trang</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Trang em tìm không tồn tại hoặc đã được chuyển đi nơi khác.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 font-display text-sm font-extrabold text-primary-foreground shadow-bevel-primary transition-[transform,box-shadow,filter] ease-bounce hover:-translate-y-0.5 hover:scale-[1.03] hover:brightness-105 active:translate-y-[3px] active:scale-100 active:shadow-bevel-primary-active"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
