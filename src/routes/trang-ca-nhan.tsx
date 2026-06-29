import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { KeyRound, Lock, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/trang-ca-nhan")({
  component: TrangCaNhan,
});

const AVATAR_COLORS = [
  "bg-green text-white",
  "bg-sky text-navy",
  "bg-purple text-white",
  "bg-yellow text-navy",
  "bg-pink text-white",
];

const BADGES = [
  { emoji: "🌱", label: "Người mới", sublabel: "Bắt đầu hành trình", threshold: 0 },
  { emoji: "⭐", label: "Ngôi sao", sublabel: "Hoàn thành 1 bài", threshold: 1 },
  { emoji: "🏆", label: "Siêu sao", sublabel: "Hoàn thành 5 bài", threshold: 5 },
  { emoji: "🦸", label: "Anh hùng", sublabel: "Hoàn thành 10 bài", threshold: 10 },
];

function TrangCaNhan() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isLoading } = useAuth();
  const { progressMap, isProgressLoading } = useUserProgress(user?.id ?? null);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: "/" });
    }
  }, [isLoading, user, navigate]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Học sinh";

  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
  const avatarLetter = displayName[0]?.toUpperCase() ?? "?";
  const avatarColorClass =
    AVATAR_COLORS[avatarLetter.charCodeAt(0) % AVATAR_COLORS.length];

  const memberSince = new Date(user.created_at).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
  });

  const completedCount = [...progressMap.values()].filter(
    (p) => p.isCompleted,
  ).length;
  const inProgressCount = [...progressMap.values()].filter(
    (p) => !p.isCompleted && p.noiDungIndex > 0,
  ).length;
  const totalStarted = progressMap.size;

  const isEmailUser = user.app_metadata?.provider !== "google";

  const handleResetPassword = async () => {
    if (!user.email) return;
    setIsSendingReset(true);
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setIsSendingReset(false);
    if (error) {
      toast.error("Không thể gửi email", { description: error.message });
    } else {
      toast.success("Email đặt lại mật khẩu đã được gửi! 📬");
    }
  };

  const handleRestartProgress = async () => {
    if (!user) return;
    setIsRestarting(true);
    const { error } = await supabase
      .from("user_progress")
      .delete()
      .eq("user_id", user.id);
    if (error) {
      setIsRestarting(false);
      toast.error("Không thể xóa tiến độ", { description: error.message });
      return;
    }
    localStorage.removeItem("vui-hoc-progress");
    try { sessionStorage.removeItem("vui-hoc-buffalo-pos"); } catch { /* ignore */ }
    queryClient.setQueryData(["user-progress", user.id], new Map());
    setIsRestarting(false);
    toast.success("Tiến độ đã được đặt lại! Hãy bắt đầu lại nhé 🌱");
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {/* Hero card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cream via-sky/40 to-purple/20 p-8 shadow-card mb-6">
          <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-yellow/20 blur-2xl" />
          <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-pink/20 blur-2xl" />

          <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className={[
                  "h-24 w-24 rounded-full shadow-lg ring-4 ring-white overflow-hidden flex items-center justify-center text-3xl font-extrabold font-display",
                  avatarUrl ? "" : avatarColorClass,
                ].join(" ")}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  avatarLetter
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 text-2xl animate-bob inline-block">
                🐃
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-2xl font-extrabold text-navy leading-tight truncate">
                {displayName}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5 truncate">
                {user.email}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Thành viên từ {memberSince}
              </p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { emoji: "🎯", value: completedCount, label: "Bài hoàn thành", color: "bg-green/10 border-green/30 text-green" },
            { emoji: "📖", value: inProgressCount, label: "Đang học", color: "bg-yellow/20 border-yellow/40 text-navy" },
            { emoji: "🗂️", value: totalStarted, label: "Đã mở", color: "bg-purple/10 border-purple/30 text-purple" },
          ].map(({ emoji, value, label, color }) => (
            <div
              key={label}
              className={[
                "rounded-2xl border p-4 text-center shadow-sm",
                color,
              ].join(" ")}
            >
              <div className="text-2xl mb-1">{emoji}</div>
              <div className="font-display text-2xl font-extrabold text-navy leading-none">
                {isProgressLoading ? "—" : value}
              </div>
              <div className="text-xs font-semibold mt-1 text-muted-foreground leading-tight">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div className="rounded-3xl bg-white shadow-card p-6 mb-6">
          <h2 className="font-display text-lg font-extrabold text-navy mb-4 flex items-center gap-2">
            🏅 Huy hiệu của em
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {BADGES.map(({ emoji, label, sublabel, threshold }) => {
              const earned = completedCount >= threshold;
              return (
                <div
                  key={label}
                  className={[
                    "relative rounded-2xl border p-4 text-center transition-all",
                    earned
                      ? "bg-gradient-to-b from-yellow/20 to-cream border-yellow/40 shadow-sm"
                      : "bg-muted/40 border-border opacity-50 grayscale",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "text-3xl mb-2",
                      earned ? "animate-stamp-in" : "",
                    ].join(" ")}
                  >
                    {emoji}
                  </div>
                  <div className="font-display text-sm font-bold text-navy leading-tight">
                    {label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 leading-tight">
                    {sublabel}
                  </div>
                  {!earned && (
                    <Lock className="absolute top-2 right-2 h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Account actions */}
        <div className="rounded-3xl bg-white shadow-card p-6 space-y-3">
          <h2 className="font-display text-lg font-extrabold text-navy mb-4 flex items-center gap-2">
            ⚙️ Tài khoản
          </h2>

          {isEmailUser && (
            <Button
              variant="outline"
              className="w-full justify-start gap-3 rounded-xl h-12 font-bold text-navy border-border hover:bg-muted"
              onClick={handleResetPassword}
              disabled={isSendingReset}
            >
              {isSendingReset ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <KeyRound className="h-4 w-4 text-primary" />
              )}
              Đổi mật khẩu
            </Button>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 rounded-xl h-12 font-bold text-orange-500 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
                disabled={isRestarting}
              >
                {isRestarting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RotateCcw className="h-4 w-4" />
                )}
                Bắt đầu lại từ đầu
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-display text-xl font-extrabold text-navy">
                  Bắt đầu lại từ đầu? 🔄
                </AlertDialogTitle>
                <AlertDialogDescription className="text-base leading-relaxed">
                  Tất cả tiến độ học tập của em sẽ bị xóa và em sẽ bắt đầu lại
                  từ bài đầu tiên. Tài khoản của em vẫn được giữ lại.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl font-bold">
                  Thôi, giữ lại
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRestartProgress}
                  className="rounded-xl font-bold bg-orange-500 hover:bg-orange-600"
                >
                  Bắt đầu lại
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 pb-4">
          Phiên bản 1.0 · Trường Tiếng Việt Của Em 🇻🇳
        </p>
      </main>
    </div>
  );
}
