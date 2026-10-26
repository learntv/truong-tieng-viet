import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import roundArrowBack from "@iconify-icons/ic/round-arrow-back";
import mdiLoading from "@iconify-icons/mdi/loading";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/Logo";
import { m } from "@/paraglide/messages";

type AuthTab = "login" | "register";

export const Route = createFileRoute("/dang-nhap")({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: search.tab === "register" ? ("register" as const) : ("login" as const),
    // Where to land after a successful sign-in. Only same-site paths, so the
    // param can never be used to bounce someone off to another origin.
    redirect:
      typeof search.redirect === "string" &&
      search.redirect.startsWith("/") &&
      !search.redirect.startsWith("//")
        ? search.redirect
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: m.account_login_meta_title() },
      {
        name: "description",
        content: m.account_login_meta_description(),
      },
      { property: "og:title", content: m.account_login_meta_title() },
      {
        property: "og:description",
        content: m.account_login_subtitle(),
      },
      { property: "og:url", content: "/dang-nhap" },
    ],
    links: [{ rel: "canonical", href: "/dang-nhap" }],
  }),
  component: AuthPage,
});

// Built per render so the validation messages follow the current locale.
const makeEmailPasswordSchema = () =>
  z.object({
    email: z.string().email(m.account_invalid_email()),
    password: z.string().min(6, m.account_password_min()),
  });
const makeEmailOnlySchema = () =>
  z.object({
    email: z.string().email(m.account_invalid_email()),
  });

type EmailPasswordValues = z.infer<ReturnType<typeof makeEmailPasswordSchema>>;
type EmailOnlyValues = z.infer<ReturnType<typeof makeEmailOnlySchema>>;

function GoogleButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex w-full items-center justify-center gap-3 rounded-full border border-border bg-white px-4 py-3 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-muted disabled:opacity-60"
    >
      {loading ? (
        <Icon icon={mdiLoading} className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      )}
      {m.account_continue_google()}
    </button>
  );
}

function ForgotPasswordView({ onBack }: { onBack: () => void }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailOnlyValues>({
    resolver: zodResolver(makeEmailOnlySchema()),
  });

  const onSubmit = async ({ email }: EmailOnlyValues) => {
    setLoading(true);
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/reset-password`
        : "/reset-password";
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setLoading(false);
    if (error) {
      toast.error(m.account_reset_email_failed(), { description: error.message });
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-green/20 text-2xl">
          ✉️
        </div>
        <p className="text-sm text-muted-foreground">{m.account_reset_email_sent()}</p>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline mx-auto"
        >
          <Icon icon={roundArrowBack} className="h-3.5 w-3.5" aria-hidden />
          {m.account_back_to_login()}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <Icon icon={roundArrowBack} className="h-3.5 w-3.5" aria-hidden />
          {m.account_back()}
        </button>
        <p className="mt-2 text-sm text-muted-foreground">{m.account_forgot_intro()}</p>
      </div>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="forgot-email">Email</Label>
          <Input
            id="forgot-email"
            type="email"
            placeholder="em@example.com"
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Icon icon={mdiLoading} className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
          {m.account_send_reset_email()}
        </Button>
      </form>
    </div>
  );
}

function EmailForm({
  mode,
  onSuccess,
  onForgotPassword,
}: {
  mode: AuthTab;
  onSuccess: () => void;
  onForgotPassword: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailPasswordValues>({
    resolver: zodResolver(makeEmailPasswordSchema()),
  });

  useEffect(() => {
    reset();
  }, [mode, reset]);

  const onSubmit = async ({ email, password }: EmailPasswordValues) => {
    setLoading(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(m.account_login_failed(), { description: error.message });
      } else {
        toast.success(m.account_login_success());
        onSuccess();
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        toast.error(m.account_register_failed(), { description: error.message });
      } else {
        toast.success(m.account_register_check_email());
      }
    }
    setLoading(false);
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="auth-email">Email</Label>
        <Input id="auth-email" type="email" placeholder="em@example.com" {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="auth-password">{m.account_password_label()}</Label>
          {mode === "login" && (
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs font-medium text-primary hover:underline"
            >
              {m.account_forgot_password()}
            </button>
          )}
        </div>
        <Input id="auth-password" type="password" placeholder="••••••" {...register("password")} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Icon icon={mdiLoading} className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
        {mode === "login" ? m.account_sign_in() : m.account_sign_up()}
      </Button>
    </form>
  );
}

function AuthPage() {
  const { tab, redirect } = Route.useSearch();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  const destination = redirect ?? "/";

  // Someone already signed in has no business on the sign-in page — send them
  // where they were headed.
  useEffect(() => {
    if (!isLoading && user) navigate({ to: destination, replace: true });
  }, [isLoading, user, destination, navigate]);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          typeof window !== "undefined" ? `${window.location.origin}${destination}` : destination,
      },
    });
    if (error) {
      toast.error(m.account_google_failed(), { description: error.message });
      setGoogleLoading(false);
    }
  };

  const handleSuccess = () => navigate({ to: destination, replace: true });

  return (
    // The sign-in card sits straight on the sky (see __root's bare-sky list),
    // centred in the viewport minus the navbar so the page reads as one screen.
    <div className="flex min-h-[calc(100svh-16rem)] items-center justify-center">
      <div className="w-full max-w-md border-[6px] border-white bg-white p-6 shadow-2xl sm:border-[8px] sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <Link to="/" aria-label={m.account_home()}>
            <Logo size="md" variant="wordmark" />
          </Link>
          <h1 className="mt-4 font-display text-2xl font-bold text-navy">
            {tab === "register" ? m.account_create_account() : m.account_welcome_back()}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{m.account_login_subtitle()}</p>
        </div>

        {forgotPassword ? (
          <ForgotPasswordView onBack={() => setForgotPassword(false)} />
        ) : (
          <Tabs
            value={tab}
            onValueChange={(next) =>
              navigate({
                to: "/dang-nhap",
                search: { tab: next as AuthTab, redirect },
                replace: true,
              })
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{m.account_sign_in()}</TabsTrigger>
              <TabsTrigger value="register">{m.account_sign_up()}</TabsTrigger>
            </TabsList>

            {(["login", "register"] as const).map((mode) => (
              <TabsContent key={mode} value={mode} className="space-y-4 pt-4">
                <GoogleButton onClick={handleGoogle} loading={googleLoading} />

                <div className="flex items-center gap-3">
                  <Separator className="flex-1" />
                  <span className="text-xs text-muted-foreground">{m.account_or()}</span>
                  <Separator className="flex-1" />
                </div>

                <EmailForm
                  mode={mode}
                  onSuccess={handleSuccess}
                  onForgotPassword={() => setForgotPassword(true)}
                />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}
