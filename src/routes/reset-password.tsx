import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import mdiLoading from "@iconify-icons/mdi/loading";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: m.account_reset_meta_title() },
      {
        name: "description",
        content: m.account_reset_meta_description(),
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: m.account_reset_meta_title() },
      {
        property: "og:description",
        content: m.account_reset_og_description(),
      },
      { property: "og:url", content: "/reset-password" },
    ],
    links: [{ rel: "canonical", href: "/reset-password" }],
  }),
  component: ResetPassword,
});

// Built per render so the validation messages follow the current locale.
const makeSchema = () =>
  z
    .object({
      password: z.string().min(6, m.account_password_min()),
      confirm: z.string(),
    })
    .refine((d) => d.password === d.confirm, {
      message: m.account_passwords_mismatch(),
      path: ["confirm"],
    });

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

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
        toast.error(m.account_reset_link_invalid());
        navigate({ to: "/" });
      }
    });
  }, [navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(makeSchema()),
  });

  const onSubmit = async ({ password }: FormValues) => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(m.account_reset_failed(), { description: error.message });
    } else {
      toast.success(m.account_password_updated());
      navigate({ to: "/" });
    }
  };

  return (
    <div className="flex min-h-[70vh] flex-col">
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-navy">{m.account_reset_title()}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{m.account_reset_intro()}</p>
          </div>

          {ready && (
            <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="new-password">{m.account_new_password()}</Label>
                <Input id="new-password" type="password" placeholder="••••••" {...register("password")} />
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password">{m.account_confirm_password()}</Label>
                <Input id="confirm-password" type="password" placeholder="••••••" {...register("confirm")} />
                {errors.confirm && <p className="text-xs text-destructive">{errors.confirm.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && (
                  <Icon icon={mdiLoading} className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                )}
                {m.account_update_password()}
              </Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
