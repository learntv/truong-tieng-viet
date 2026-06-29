import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { KeyRound, Lock, Loader2, RotateCcw, Globe, Pencil, Check } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

const COUNTRIES = [
  { code: "VN", name: "Việt Nam" },
  { code: "US", name: "United States" },
  { code: "AU", name: "Australia" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "CN", name: "China" },
  { code: "TW", name: "Taiwan" },
  { code: "TH", name: "Thailand" },
  { code: "SG", name: "Singapore" },
  { code: "MY", name: "Malaysia" },
  { code: "PH", name: "Philippines" },
  { code: "ID", name: "Indonesia" },
  { code: "KH", name: "Cambodia" },
  { code: "LA", name: "Laos" },
  { code: "NZ", name: "New Zealand" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "PL", name: "Poland" },
  { code: "CZ", name: "Czech Republic" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "PT", name: "Portugal" },
  { code: "RU", name: "Russia" },
  { code: "UA", name: "Ukraine" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "AR", name: "Argentina" },
  { code: "ZA", name: "South Africa" },
  { code: "IN", name: "India" },
  { code: "AE", name: "UAE" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "IL", name: "Israel" },
  { code: "TR", name: "Turkey" },
  { code: "EG", name: "Egypt" },
  { code: "HK", name: "Hong Kong" },
  { code: "MO", name: "Macau" },
];

const AVATAR_OPTIONS = [
  "🐯", "🐼", "🐨", "🦊", "🐸",
  "🐙", "🦋", "🐬", "🦁", "🐺",
  "🐻", "🦝", "🦄", "🐲", "🐧",
  "🦜", "🐳", "🦔", "🐮", "🐱",
];

function AvatarPickerDialog({
  current,
  open,
  onOpenChange,
  onSelect,
}: {
  current: string | undefined;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect: (emoji: string) => void;
}) {
  const [saving, setSaving] = useState(false);

  const handleSelect = async (emoji: string) => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ data: { avatar_emoji: emoji } });
    setSaving(false);
    if (error) {
      toast.error("Không thể lưu avatar", { description: error.message });
    } else {
      onSelect(emoji);
      onOpenChange(false);
      toast.success("Đã lưu avatar!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl max-w-xs p-5">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-extrabold text-navy">
            Chọn avatar của em 🎨
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-5 gap-2">
          {AVATAR_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleSelect(emoji)}
              disabled={saving}
              className={[
                "h-12 w-full rounded-xl text-2xl flex items-center justify-center transition-all active:scale-90 disabled:opacity-50",
                current === emoji
                  ? "bg-sky/50 ring-2 ring-sky scale-110 shadow-sm"
                  : "bg-muted/40 hover:bg-sky/20",
              ].join(" ")}
            >
              {emoji}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FlagImg({ code, size = 24 }: { code: string; size?: number }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      width={size}
      height={size * 0.75}
      alt={code}
      className="block object-cover"
    />
  );
}

function CountryPickerDialog({
  current,
  open,
  onOpenChange,
  onSelect,
}: {
  current: string | undefined;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect: (code: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = async (code: string) => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ data: { country: code } });
    setSaving(false);
    if (error) {
      toast.error("Không thể lưu quốc gia", { description: error.message });
    } else {
      onSelect(code);
      onOpenChange(false);
      toast.success("Đã lưu quốc gia!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl max-w-sm p-5">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-extrabold text-navy">
            Chọn quốc gia của em 🌍
          </DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl"
          autoFocus
        />
        <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1">
          {filtered.map((c) => (
            <button
              key={c.code}
              onClick={() => handleSelect(c.code)}
              disabled={saving}
              title={c.name}
              className={[
                "flex flex-col items-center gap-0.5 rounded-xl p-2 transition-all text-center hover:bg-sky/30 active:scale-95",
                current === c.code ? "bg-sky/40 ring-2 ring-sky" : "",
              ].join(" ")}
            >
              <FlagImg code={c.code} size={28} />
              <span className="text-[9px] font-semibold text-navy leading-tight line-clamp-1">
                {c.name}
              </span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-4 text-center text-sm text-muted-foreground py-4">
              Không tìm thấy quốc gia
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function computeStreak(completedAts: string[]): { days: number; studiedToday: boolean } {
  const MS_PER_DAY = 86400_000;
  const toDay = (iso: string) => {
    const d = new Date(iso);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };
  const today = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); })();
  if (completedAts.length === 0) return { days: 0, studiedToday: false };
  const days = [...new Set(completedAts.map(toDay))].sort((a, b) => b - a);
  const studiedToday = days[0] === today;
  if (days[0] < today - MS_PER_DAY) return { days: 0, studiedToday: false };
  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    if (days[i] === days[i - 1] - MS_PER_DAY) streak++;
    else break;
  }
  return { days: streak, studiedToday };
}

function TrangCaNhan() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isLoading } = useAuth();
  const { progressMap, isProgressLoading } = useUserProgress(user?.id ?? null);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [countryCode, setCountryCode] = useState<string | undefined>(undefined);
  const [countryPickerOpen, setCountryPickerOpen] = useState(false);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [avatarEmoji, setAvatarEmoji] = useState<string | undefined>(undefined);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setCountryCode(user.user_metadata?.country as string | undefined);
      setAvatarEmoji(user.user_metadata?.avatar_emoji as string | undefined);
    }
  }, [user]);

  const { data: streak = { days: 0, studiedToday: false } } = useQuery({
    queryKey: ["streak", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_progress")
        .select("completed_at")
        .not("completed_at", "is", null);
      if (error) throw error;
      return computeStreak(data.map((r) => r.completed_at as string));
    },
    enabled: !!user,
    staleTime: 60_000,
  });

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

  const handleSaveName = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed || trimmed === displayName) { setEditingName(false); return; }
    setSavingName(true);
    const { error } = await supabase.auth.updateUser({ data: { full_name: trimmed } });
    setSavingName(false);
    if (error) {
      toast.error("Không thể lưu tên", { description: error.message });
    } else {
      setEditingName(false);
      toast.success("Đã lưu tên!");
    }
  };

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
    queryClient.setQueryData(["streak", user.id], { days: 0, studiedToday: false });
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
                  "h-24 w-24 rounded-full shadow-lg ring-4 ring-white overflow-hidden flex items-center justify-center font-extrabold font-display",
                  avatarUrl || avatarEmoji ? "bg-sky/30" : avatarColorClass,
                ].join(" ")}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : avatarEmoji ? (
                  <span className="text-5xl">{avatarEmoji}</span>
                ) : (
                  <span className="text-3xl">{avatarLetter}</span>
                )}
              </div>
              {!avatarUrl && (
                <button
                  onClick={() => setAvatarPickerOpen(true)}
                  className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-white shadow-md border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  title="Đổi avatar"
                >
                  <Pencil className="h-3.5 w-3.5 text-navy" />
                </button>
              )}
              <AvatarPickerDialog
                current={avatarEmoji}
                open={avatarPickerOpen}
                onOpenChange={setAvatarPickerOpen}
                onSelect={setAvatarEmoji}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {editingName ? (
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <input
                      ref={nameInputRef}
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleSaveName(); if (e.key === "Escape") setEditingName(false); }}
                      className="font-display text-2xl font-extrabold text-navy bg-white/70 rounded-lg px-2 py-0.5 border border-sky outline-none min-w-0 w-full"
                      maxLength={40}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={savingName}
                      className="shrink-0 h-8 w-8 rounded-full bg-green/20 hover:bg-green/30 flex items-center justify-center transition-colors"
                    >
                      {savingName ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 text-green-700" />}
                    </button>
                  </div>
                ) : (
                  <h1 className="font-display text-2xl font-extrabold text-navy leading-tight flex items-center gap-2 flex-wrap">
                    <span className="truncate">{displayName}</span>
                    <button
                      onClick={() => { setNameInput(displayName); setEditingName(true); setTimeout(() => nameInputRef.current?.select(), 0); }}
                      className="shrink-0 h-7 w-7 rounded-full bg-white/60 hover:bg-white flex items-center justify-center shadow-sm transition-colors"
                      title="Đổi tên"
                    >
                      <Pencil className="h-3.5 w-3.5 text-navy/60" />
                    </button>
                    <button
                      onClick={() => setCountryPickerOpen(true)}
                      className="shrink-0 rounded-md border border-white/60 bg-white/50 shadow-sm hover:bg-white hover:shadow-md active:scale-95 transition-all overflow-hidden cursor-pointer"
                      title="Chọn quốc gia"
                    >
                      {countryCode
                        ? <FlagImg code={countryCode} size={32} />
                        : <Globe className="h-5 w-5 text-navy/50 m-1" />
                      }
                    </button>
                  </h1>
                )}
              </div>
              <CountryPickerDialog
                current={countryCode}
                open={countryPickerOpen}
                onOpenChange={setCountryPickerOpen}
                onSelect={setCountryCode}
              />
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
          ].map(({ emoji, value, label, color }) => (
            <div
              key={label}
              className={["rounded-2xl border p-4 text-center shadow-sm", color].join(" ")}
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

          {/* Streak card */}
          <div className="rounded-2xl border p-4 text-center shadow-sm bg-orange-50 border-orange-200 text-orange-600">
            <div className="text-2xl mb-1">🔥</div>
            <div className="font-display text-2xl font-extrabold text-navy leading-none">
              {streak.days}
            </div>
            <div className="text-xs font-semibold mt-1 text-muted-foreground leading-tight">
              Ngày liên tiếp
            </div>
            <div className={["mt-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold inline-block", streak.studiedToday ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-600"].join(" ")}>
              {streak.studiedToday ? "✓ Hôm nay xong" : "Chưa học hôm nay"}
            </div>
          </div>
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
