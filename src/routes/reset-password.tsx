import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { messagesFor, useT, type Messages } from "@/i18n";
import { pageTitle } from "@/i18n/head";

export const Route = createFileRoute("/reset-password")({
  head: ({ match }) => {
    const { locale } = match.context;
    const m = messagesFor(locale).meta.resetPassword;
    const title = pageTitle(locale, m.title);
    return {
      meta: [
        { title },
        { name: "description", content: m.description },
        { name: "robots", content: "noindex" },
        { property: "og:title", content: title },
        { property: "og:description", content: m.ogDescription },
        { property: "og:url", content: "/reset-password" },
      ],
      links: [{ rel: "canonical", href: "/reset-password" }],
    };
  },
  component: ResetPassword,
});

const makeSchema = (t: Messages) =>
  z
    .object({
      password: z.string().min(6, t.auth.passwordTooShort),
      confirm: z.string(),
    })
    .refine((d) => d.password === d.confirm, {
      message: t.resetPassword.mismatch,
      path: ["confirm"],
    });

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

function ResetPassword() {
  const t = useT();
  const schema = useMemo(() => makeSchema(t), [t]);
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
        toast.error(t.resetPassword.invalidLink);
        navigate({ to: "/" });
      }
    });
    // Runs once on arrival; a language switch must not re-check the recovery session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ password }: FormValues) => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(t.resetPassword.failed, { description: error.message });
    } else {
      toast.success(t.resetPassword.success);
      navigate({ to: "/" });
    }
  };

  return (
    <div className="flex min-h-[70vh] flex-col">
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-navy">{t.resetPassword.heading}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t.resetPassword.intro}</p>
          </div>

          {ready && (
            <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="new-password">{t.resetPassword.newPassword}</Label>
                <Input id="new-password" type="password" placeholder="••••••" {...register("password")} />
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password">{t.resetPassword.confirmPassword}</Label>
                <Input id="confirm-password" type="password" placeholder="••••••" {...register("confirm")} />
                {errors.confirm && <p className="text-xs text-destructive">{errors.confirm.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t.resetPassword.submit}
              </Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
