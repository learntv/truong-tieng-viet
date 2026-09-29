import { useEffect } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import { Button } from "@/components/ui/button";
import { Mascot, type MascotPose } from "@/components/Mascot";

// Shared error/404 screens for both the router's defaultErrorComponent and the
// root route's errorComponent/notFoundComponent, so every boundary reports to
// Lovable and shows the same Vietnamese-language UI.

function Frame({
  pose,
  code,
  title,
  body,
  children,
}: {
  pose: MascotPose;
  code?: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-[70vh] flex-1 items-center justify-center overflow-hidden bg-wash px-4 py-16">
      <div
        aria-hidden
        className="bg-dots absolute inset-0 opacity-60 [mask-image:radial-gradient(closest-side,black,transparent)]"
      />
      <div className="relative flex max-w-md flex-col items-center text-center">
        <div className="relative">
          <span
            aria-hidden
            className="absolute inset-x-2 bottom-0 h-6 rounded-[50%] bg-ink-900/8 blur-sm"
          />
          <Mascot pose={pose} size="lg" decorative className="relative animate-bob" />
        </div>
        {code && (
          <p className="mt-6 text-[4.5rem] leading-none font-extrabold tracking-[-0.04em] text-brand-600">
            {code}
          </p>
        )}
        <h1 className="mt-4 text-h2 text-ink-900">{title}</h1>
        <p className="mt-3 text-lede text-ink-600">{body}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>
      </div>
    </div>
  );
}

export function ErrorScreen({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "router_error_component" });
  }, [error]);

  return (
    <Frame
      pose="crying"
      title="Trang này chưa tải được"
      body="Có lỗi xảy ra từ phía chúng tôi. Em hãy thử tải lại, hoặc quay về trang chủ nhé."
    >
      <Button
        size="lg"
        onClick={() => {
          router.invalidate();
          reset();
        }}
      >
        <RotateCcw aria-hidden />
        Thử lại
      </Button>
      <Button size="lg" variant="outline" asChild>
        <a href="/">Về trang chủ</a>
      </Button>
    </Frame>
  );
}

export function NotFoundScreen() {
  return (
    <Frame
      pose="thinking"
      code="404"
      title="Không tìm thấy trang"
      body="Trang em tìm không tồn tại hoặc đã được chuyển đi nơi khác."
    >
      <Button size="lg" asChild>
        <Link to="/">
          <ArrowLeft aria-hidden />
          Về trang chủ
        </Link>
      </Button>
    </Frame>
  );
}
