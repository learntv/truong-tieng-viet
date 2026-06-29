import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/reset-password")({
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

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
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
    <div className="flex h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="font-display text-2xl font-extrabold text-navy">Đặt lại mật khẩu</h1>
            <p className="mt-1 text-sm text-muted-foreground">Nhập mật khẩu mới cho tài khoản của bạn.</p>
          </div>

          {ready && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="new-password">Mật khẩu mới</Label>
                <Input id="new-password" type="password" placeholder="••••••" {...register("password")} />
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                <Input id="confirm-password" type="password" placeholder="••••••" {...register("confirm")} />
                {errors.confirm && <p className="text-xs text-destructive">{errors.confirm.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Cập nhật mật khẩu
              </Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
