import { useEffect } from "react";
import { Link, useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/Mascot";
import { m } from "@/paraglide/messages";

// Shared error/404 screens for both the router's defaultErrorComponent and the
// root route's errorComponent/notFoundComponent, so every boundary reports to
// Lovable and shows the same UI in the visitor's language.

export function ErrorScreen({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "router_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <Mascot pose="crying" size="md" decorative className="mx-auto mb-4" />
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {m.account_error_title()}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{m.account_error_body()}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button
            variant="bevel" tone="primary"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            {m.account_error_retry()}
          </Button>
          <Button variant="bevel" tone="neutral" asChild>
            <a href="/">{m.account_home()}</a>
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
        <Mascot pose="thinking" size="lg" decorative className="mx-auto mb-2" />
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          {m.account_not_found_title()}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{m.account_not_found_body()}</p>
        <div className="mt-6">
          <Button variant="bevel" tone="primary" asChild>
            <Link to="/">{m.account_home()}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
