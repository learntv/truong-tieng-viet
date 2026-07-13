import { useEffect } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import { Button } from "@/components/ui/button";

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
          <Button
            variant="bevel-primary"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Thử lại
          </Button>
          <Button variant="bevel-neutral" asChild>
            <a href="/">Về trang chủ</a>
          </Button>
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
          <Button variant="bevel-primary" asChild>
            <Link to="/">Về trang chủ</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
