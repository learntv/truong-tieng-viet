import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { KeyRound, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Container } from "@/components/layout/Container";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Đặt lại mật khẩu — Trường Tiếng Việt Của Em" },
      {
        name: "description",
        content:
          "Đặt lại mật khẩu tài khoản Trường Tiếng Việt Của Em sau khi nhận liên kết khôi phục qua email.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Đặt lại mật khẩu — Trường Tiếng Việt Của Em" },
      {
        property: "og:description",
        content: "Đặt mật khẩu mới cho tài khoản của bạn.",
      },
      { property: "og:url", content: "/reset-password" },
    ],
    links: [{ rel: "canonical", href: "/reset-password" }],
  }),
  component: ResetPassword,
});

const schema = z
  .object({
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Mật khẩu không khớp",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof schema>;

function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  // Supabase puts the recovery token in the URL hash; calling getSession()
  // after the redirect automatically exchanges it for a session.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setReady(true);
      } else {
        toast.error("Liên kết không hợp lệ hoặc đã hết hạn.");
        navigate({ to: "/" });
      }
    });
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ password }: FormValues) => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error("Không thể đặt lại mật khẩu", { description: error.message });
    } else {
      toast.success("Mật khẩu đã được cập nhật!");
      navigate({ to: "/" });
    }
  };

  return (
    <section className="flex flex-1 items-center bg-wash py-12 sm:py-20">
      <Container width="form">
        <div className="rounded-[2rem] border border-ink-100 bg-white p-6 shadow-lg sm:p-10">
          <span className="grid size-12 place-items-center rounded-2xl bg-brand-600 text-white shadow-sm">
            <KeyRound className="size-6" aria-hidden />
          </span>
          <h1 className="mt-5 text-h2 text-ink-900">Đặt lại mật khẩu</h1>
          <p className="mt-2 text-ink-600">Nhập mật khẩu mới cho tài khoản của bạn.</p>

          {ready ? (
            <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
              <Field
                id="new-password"
                label="Mật khẩu mới"
                error={errors.password?.message}
                hint="Tối thiểu 6 ký tự."
              >
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
              </Field>
              <Field
                id="confirm-password"
                label="Xác nhận mật khẩu"
                error={errors.confirm?.message}
              >
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••"
                  aria-invalid={!!errors.confirm}
                  {...register("confirm")}
                />
              </Field>
              <Button type="submit" size="lg" className="mt-1 w-full" disabled={loading}>
                {loading && <Loader2 className="animate-spin" aria-hidden />}
                Cập nhật mật khẩu
              </Button>
            </form>
          ) : (
            <div className="mt-8 flex items-center gap-3 text-sm text-ink-500" role="status">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Đang kiểm tra liên kết…
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
