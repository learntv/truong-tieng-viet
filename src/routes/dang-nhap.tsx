import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  BookmarkCheck,
  Gift,
  Loader2,
  MailCheck,
  Star,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Field } from "@/components/ui/field";
import { Mascot } from "@/components/Mascot";
import { Container } from "@/components/layout/Container";

type AuthTab = "login" | "register";

const PERKS: { Icon: LucideIcon; label: string }[] = [
  { Icon: BookmarkCheck, label: "Lưu tiến độ từng chặng học" },
  { Icon: Star, label: "Giữ lại sao luyện nói của em" },
  { Icon: Gift, label: "Miễn phí trọn đời" },
];

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
      { title: "Đăng nhập — Trường Tiếng Việt Của Em" },
      {
        name: "description",
        content:
          "Đăng nhập hoặc tạo tài khoản Trường Tiếng Việt Của Em để lưu tiến độ học tập của em.",
      },
      { property: "og:title", content: "Đăng nhập — Trường Tiếng Việt Của Em" },
      {
        property: "og:description",
        content: "Đăng nhập để lưu tiến độ học tập của em.",
      },
      { property: "og:url", content: "/dang-nhap" },
    ],
    links: [{ rel: "canonical", href: "/dang-nhap" }],
  }),
  component: AuthPage,
});

const emailPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});
const emailOnlySchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

type EmailPasswordValues = z.infer<typeof emailPasswordSchema>;
type EmailOnlyValues = z.infer<typeof emailOnlySchema>;

function GoogleButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-ink-200 bg-white px-4 text-[0.9375rem] font-semibold text-ink-800 shadow-xs transition-[background-color,border-color,box-shadow] duration-200 hover:border-ink-300 hover:bg-ink-25 hover:shadow-sm disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="size-5 animate-spin" />
      ) : (
        <svg className="size-5" viewBox="0 0 24 24" aria-hidden>
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
      Tiếp tục với Google
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
    resolver: zodResolver(emailOnlySchema),
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
      toast.error("Không gửi được email", { description: error.message });
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <span className="grid size-16 place-items-center rounded-2xl bg-leaf-50 text-leaf-600">
          <MailCheck className="size-8" aria-hidden />
        </span>
        <h2 className="text-h3 text-ink-900">Đã gửi email!</h2>
        <p className="text-sm text-ink-600">
          Email đặt lại mật khẩu đã được gửi. Kiểm tra hộp thư của bạn.
        </p>
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft aria-hidden />
          Quay lại đăng nhập
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Button variant="ghost" size="sm" onClick={onBack} className="-ml-3">
          <ArrowLeft aria-hidden />
          Quay lại
        </Button>
        <h2 className="mt-3 text-h3 text-ink-900">Quên mật khẩu?</h2>
        <p className="mt-1 text-sm text-ink-600">
          Nhập email của bạn và chúng tôi sẽ gửi liên kết đặt lại mật khẩu.
        </p>
      </div>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Field id="forgot-email" label="Email" error={errors.email?.message}>
          <Input
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder="em@example.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </Field>
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" aria-hidden />}
          Gửi email đặt lại mật khẩu
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
    resolver: zodResolver(emailPasswordSchema),
  });

  useEffect(() => {
    reset();
  }, [mode, reset]);

  const onSubmit = async ({ email, password }: EmailPasswordValues) => {
    setLoading(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error("Đăng nhập thất bại", { description: error.message });
      } else {
        toast.success("Đăng nhập thành công!");
        onSuccess();
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        toast.error("Đăng ký thất bại", { description: error.message });
      } else {
        toast.success("Kiểm tra email để xác nhận tài khoản!");
      }
    }
    setLoading(false);
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field id={`auth-email-${mode}`} label="Email" error={errors.email?.message}>
        <Input
          id={`auth-email-${mode}`}
          type="email"
          autoComplete="email"
          placeholder="em@example.com"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
      </Field>
      <Field
        id={`auth-password-${mode}`}
        label="Mật khẩu"
        error={errors.password?.message}
        hint={mode === "register" ? "Tối thiểu 6 ký tự." : undefined}
        aside={
          mode === "login" && (
            <button
              type="button"
              onClick={onForgotPassword}
              className="cursor-pointer text-sm font-semibold text-brand-600 hover:underline"
            >
              Quên mật khẩu?
            </button>
          )
        }
      >
        <Input
          id={`auth-password-${mode}`}
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          placeholder="••••••"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
      </Field>
      <Button type="submit" size="lg" className="mt-1 w-full" disabled={loading}>
        {loading && <Loader2 className="animate-spin" aria-hidden />}
        {mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
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
      toast.error("Không thể kết nối Google", { description: error.message });
      setGoogleLoading(false);
    }
  };

  const handleSuccess = () => navigate({ to: destination, replace: true });

  return (
    <section className="relative flex flex-1 items-center overflow-hidden bg-wash py-10 sm:py-16">
      <Container className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-0">
        {/* Welcome panel — desktop only; on a phone the form is the whole job. */}
        <div className="relative hidden flex-col justify-between overflow-hidden rounded-[2rem] bg-brand-600 p-10 text-white lg:flex lg:rounded-r-none">
          <div
            aria-hidden
            className="absolute -top-24 -right-24 size-80 rounded-full bg-brand-500"
          />
          <div
            aria-hidden
            className="absolute -bottom-28 -left-20 size-72 rounded-full bg-sun-500/25"
          />
          <div className="relative">
            <h2 className="text-h1 text-white">Chào mừng em đến lớp!</h2>
            <p className="mt-4 max-w-sm text-lede text-brand-50">
              Có tài khoản, Trâu con sẽ nhớ em đã học tới đâu.
            </p>
            <ul className="mt-8 flex flex-col gap-4">
              {PERKS.map(({ Icon, label }) => (
                <li key={label} className="flex items-center gap-3 font-semibold">
                  <span className="grid size-10 place-items-center rounded-xl bg-white/15">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
          <Mascot pose="wave" decorative className="relative mt-10 h-44 self-end animate-float" />
        </div>

        <div className="mx-auto flex w-full max-w-md flex-col justify-center rounded-[2rem] border border-ink-100 bg-white p-6 shadow-lg sm:p-10 lg:max-w-none lg:rounded-l-none lg:border-l-0 lg:px-14">
          <div className="mb-8 flex flex-col items-center text-center lg:items-start lg:text-left">
            <Mascot pose="wave" decorative className="mb-4 h-20 lg:hidden" />
            <h1 className="text-h2 text-ink-900">
              {tab === "register" ? "Tạo tài khoản" : "Chào em trở lại!"}
            </h1>
            <p className="mt-2 text-ink-600">Đăng nhập để lưu tiến độ học tập của em.</p>
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
                <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                <TabsTrigger value="register">Đăng ký</TabsTrigger>
              </TabsList>

              {(["login", "register"] as const).map((mode) => (
                <TabsContent key={mode} value={mode} className="mt-6 flex flex-col gap-5">
                  <GoogleButton onClick={handleGoogle} loading={googleLoading} />

                  <div className="flex items-center gap-3">
                    <Separator className="flex-1" />
                    <span className="text-caption font-medium text-ink-500">hoặc dùng email</span>
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
      </Container>
    </section>
  );
}
