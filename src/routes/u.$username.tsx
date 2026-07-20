import type { User } from "@supabase/supabase-js";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  KeyRound,
  Loader2,
  RotateCcw,
  Globe,
  ImagePlus,
  Pencil,
  Check,
  Home,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { upsertProfile, generateUsername } from "@/lib/profile";
import { useAuth } from "@/hooks/useAuth";
import { useUserProgress } from "@/hooks/useUserProgress";
import { BadgeCollection } from "@/components/learning/BadgeCollection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

export const Route = createFileRoute("/u/$username")({
  component: ProfilePage,
});

// ─── Constants ────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-stage-1 text-white",
  "bg-stage-2 text-white",
  "bg-stage-3 text-white",
  "bg-stage-4 text-white",
  "bg-stage-5 text-white",
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
  "🐯",
  "🐼",
  "🐨",
  "🦊",
  "🐸",
  "🐙",
  "🦋",
  "🐬",
  "🦁",
  "🐺",
  "🐻",
  "🦝",
  "🦄",
  "🐲",
  "🐧",
  "🦜",
  "🐳",
  "🦔",
  "🐮",
  "🐱",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function avatarColor(letter: string) {
  return AVATAR_COLORS[letter.charCodeAt(0) % AVATAR_COLORS.length];
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

function computeStreak(completedAts: string[]): { days: number; studiedToday: boolean } {
  const MS_PER_DAY = 86400_000;
  const toDay = (iso: string) => {
    const d = new Date(iso);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };
  const today = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  })();
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

// ─── Avatar picker ────────────────────────────────────────────────────────────

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ACCEPTED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function AvatarPickerDialog({
  current,
  open,
  onOpenChange,
  onSelect,
}: {
  current: string | undefined;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect: (avatar: { emoji?: string; url?: string }) => void;
}) {
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Emoji and uploaded picture are mutually exclusive — the renderer prefers avatar_url, so
  // picking an emoji has to clear the URL or the choice would appear to do nothing.
  const save = async (avatar: { emoji?: string; url?: string }) => {
    const emoji = avatar.emoji ?? null;
    const url = avatar.url ?? null;

    // Retire any previously uploaded picture. Must happen before the profile row is
    // overwritten below — the server finds the object to delete by reading the row's current
    // avatar_url. Best-effort: a leaked object shouldn't block the user's choice.
    if (!url) {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          await fetch("/api/avatar", {
            method: "DELETE",
            headers: { authorization: `Bearer ${session.access_token}` },
          });
        }
      } catch {
        // Ignore — cleanup failure must not stop the avatar change.
      }
    }

    const { error } = await supabase.auth.updateUser({
      data: { avatar_emoji: emoji, avatar_url: url },
    });
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const name =
          (user.user_metadata?.full_name as string | undefined) ||
          user.email?.split("@")[0] ||
          "Học sinh";
        await upsertProfile({
          userId: user.id,
          displayName: name,
          avatarEmoji: emoji,
          avatarUrl: url,
          country: user.user_metadata?.country as string | undefined,
        });
      }
    }
    if (error) {
      toast.error("Không thể lưu avatar", { description: error.message });
    } else {
      onSelect(avatar);
      onOpenChange(false);
      toast.success("Đã lưu avatar!");
    }
  };

  const handleSelect = async (emoji: string) => {
    setSaving(true);
    await save({ emoji });
    setSaving(false);
  };

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset immediately so re-picking the same file still fires a change event.
    event.target.value = "";
    if (!file) return;

    if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) {
      toast.error("Ảnh phải là JPG, PNG, WebP hoặc GIF");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error("Ảnh phải nhỏ hơn 2MB");
      return;
    }

    setSaving(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Em cần đăng nhập lại");

      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/avatar", {
        method: "POST",
        headers: { authorization: `Bearer ${session.access_token}` },
        body,
      });
      if (!res.ok) throw new Error(await res.text());

      const { url } = (await res.json()) as { url: string };
      await save({ url });
    } catch (err) {
      toast.error("Không thể tải ảnh lên", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl max-w-xs p-5">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold text-ink">
            Chọn avatar của em 🎨
          </DialogTitle>
        </DialogHeader>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_AVATAR_TYPES.join(",")}
          onChange={handleFile}
          className="hidden"
        />
        <Button
          variant="outline"
          disabled={saving}
          onClick={() => fileInputRef.current?.click()}
          className="w-full rounded-xl"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          Tải ảnh của em lên
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          JPG, PNG, WebP hoặc GIF — tối đa 2MB
        </p>
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

// ─── Country picker ───────────────────────────────────────────────────────────

function CountryPickerDialog({
  current,
  displayName,
  avatarEmoji,
  avatarUrl,
  open,
  onOpenChange,
  onSelect,
}: {
  current: string | undefined;
  displayName: string;
  avatarEmoji: string | undefined;
  avatarUrl: string | undefined;
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
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await upsertProfile({
          userId: user.id,
          displayName,
          avatarEmoji,
          avatarUrl,
          country: code,
        });
      }
    }
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
          <DialogTitle className="font-display text-xl font-bold text-ink">
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
              <span className="text-[9px] font-semibold text-ink leading-tight line-clamp-1">
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

// ─── Owner (editable) view ────────────────────────────────────────────────────

function OwnerView({ user, signOut }: { user: User; signOut: () => void }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { progressMap, isProgressLoading } = useUserProgress(user.id);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [countryCode, setCountryCode] = useState<string | undefined>(
    user.user_metadata?.country as string | undefined,
  );
  const [countryPickerOpen, setCountryPickerOpen] = useState(false);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [avatarEmoji, setAvatarEmoji] = useState<string | undefined>(undefined);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Học sinh";
  const avatarLetter = displayName[0]?.toUpperCase() ?? "?";

  // The profiles row is the source of truth for avatar/country — user_metadata gets
  // overwritten by the OAuth provider (e.g. Google's picture) on every login, so it must only
  // seed these fields the first time a profile row is created, never on later logins.
  const { data: ownProfile, isLoading: isOwnProfileLoading } = useQuery({
    queryKey: ["own-profile", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (isOwnProfileLoading) return;
    if (ownProfile) {
      setAvatarEmoji(ownProfile.avatar_emoji ?? undefined);
      setAvatarUrl(ownProfile.avatar_url ?? undefined);
      if (ownProfile.country) setCountryCode(ownProfile.country);
      return;
    }
    // No profile row yet — this is a brand-new user, seed from OAuth metadata once and create it.
    const emoji = user.user_metadata?.avatar_emoji as string | undefined;
    const url = user.user_metadata?.avatar_url as string | undefined;
    setAvatarEmoji(emoji);
    setAvatarUrl(url);
    upsertProfile({ userId: user.id, displayName, avatarEmoji: emoji, avatarUrl: url, country: countryCode });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOwnProfileLoading, ownProfile, user.id]);

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

  const handleSaveName = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed || trimmed === displayName) {
      setEditingName(false);
      return;
    }
    setSavingName(true);
    const { error } = await supabase.auth.updateUser({ data: { full_name: trimmed } });
    if (!error && user) {
      const { username } = await upsertProfile({
        userId: user.id,
        displayName: trimmed,
        avatarEmoji,
        avatarUrl,
        country: countryCode,
      });
      setSavingName(false);
      setEditingName(false);
      toast.success("Đã lưu tên!");
      navigate({ to: "/u/$username", params: { username }, replace: true });
      return;
    }
    setSavingName(false);
    if (error) {
      toast.error("Không thể lưu tên", { description: error.message });
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
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
    const { error } = await supabase.from("user_progress").delete().eq("user_id", user.id);
    if (error) {
      setIsRestarting(false);
      toast.error("Không thể xóa tiến độ", { description: error.message });
      return;
    }
    localStorage.removeItem("vui-hoc-progress");
    try {
      sessionStorage.removeItem("vui-hoc-buffalo-pos");
    } catch {
      /* ignore */
    }
    queryClient.setQueryData(["user-progress", user.id], new Map());
    queryClient.setQueryData(["streak", user.id], { days: 0, studiedToday: false });
    queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    queryClient.invalidateQueries({ queryKey: ["public-profile"] });
    // Deleting the progress rows makes the DB revoke every badge, so the cached collection is
    // now wrong. Without this it keeps rendering badges that no longer exist until staleTime
    // expires — they would appear to vanish later, for no reason the child can see.
    queryClient.invalidateQueries({ queryKey: ["badges", user.id] });
    setIsRestarting(false);
    toast.success("Tiến độ đã được đặt lại! Hãy bắt đầu lại nhé 🌱");
  };

  const memberSince = new Date(user.created_at).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
  });
  const completedCount = [...progressMap.values()].filter((p) => p.isCompleted).length;
  const inProgressCount = [...progressMap.values()].filter(
    (p) => !p.isCompleted && p.noiDungIndex > 0,
  ).length;
  const isEmailUser = user.app_metadata?.provider !== "google";

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
        {/* Hero card */}
        <div className="relative mb-6 overflow-hidden rounded-3xl border border-border bg-card shadow-card ring-1 ring-black/[0.02]">
          {/* Red cover strip, same gradient and squircle motif as PageBanner.
            The avatar below overlaps it, so the card reads as a profile header
            without any of its edit controls needing to work on red. */}
          <div className="relative h-28 overflow-hidden bg-gradient-to-br from-primary via-maroon to-maroon-deep">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute -right-16 -top-20 h-56 w-56 rotate-[20deg] rounded-[30%] bg-primary-glow/40 blur-[2px]" />
              <div className="absolute -bottom-24 -left-16 h-44 w-44 rotate-[20deg] rounded-[30%] bg-gold/20 blur-[2px]" />
            </div>
          </div>

          <div className="relative flex flex-col items-center gap-4 p-8 pt-4 text-center sm:flex-row sm:items-start sm:text-left">
            {/* Avatar — lifted so it straddles the cover strip's bottom edge. */}
            <div className="relative -mt-16 shrink-0">
              <div
                className={[
                  "h-24 w-24 rounded-full shadow-lg ring-4 ring-white overflow-hidden flex items-center justify-center font-bold font-display",
                  avatarUrl || avatarEmoji ? "bg-sky-100" : avatarColor(avatarLetter),
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
              <button
                onClick={() => setAvatarPickerOpen(true)}
                className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-white shadow-bevel-neutral flex items-center justify-center transition-[transform,box-shadow] ease-bounce hover:-translate-y-0.5 hover:scale-110 active:translate-y-[2px] active:shadow-bevel-neutral-active"
                title="Đổi avatar"
              >
                <Pencil className="h-3.5 w-3.5 text-ink" />
              </button>
              <AvatarPickerDialog
                current={avatarEmoji}
                open={avatarPickerOpen}
                onOpenChange={setAvatarPickerOpen}
                onSelect={({ emoji, url }) => {
                  setAvatarEmoji(emoji);
                  setAvatarUrl(url);
                }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-primary/80">Trang cá nhân của em ♥</p>
              <div className="flex items-center gap-2 flex-wrap">
                {editingName ? (
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <input
                      ref={nameInputRef}
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveName();
                        if (e.key === "Escape") setEditingName(false);
                      }}
                      className="font-display text-2xl font-bold text-ink bg-white/70 rounded-lg px-2 py-0.5 border border-sky outline-none min-w-0 w-full"
                      maxLength={40}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={savingName}
                      className="shrink-0 h-8 w-8 rounded-full bg-green shadow-bevel-green flex items-center justify-center text-white transition-[transform,box-shadow] ease-bounce hover:-translate-y-0.5 hover:scale-110 active:translate-y-[2px] active:shadow-bevel-green-active disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {savingName ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                ) : (
                  <h1 className="font-display text-2xl font-bold text-ink leading-tight flex items-center gap-2 flex-wrap">
                    <span className="truncate">{displayName}</span>
                    <button
                      onClick={() => {
                        setNameInput(displayName);
                        setEditingName(true);
                        setTimeout(() => nameInputRef.current?.select(), 0);
                      }}
                      className="shrink-0 h-7 w-7 rounded-full bg-white shadow-bevel-neutral flex items-center justify-center transition-[transform,box-shadow] ease-bounce hover:-translate-y-0.5 hover:scale-110 active:translate-y-[2px] active:shadow-bevel-neutral-active"
                      title="Đổi tên"
                    >
                      <Pencil className="h-3.5 w-3.5 text-ink/60" />
                    </button>
                    <button
                      onClick={() => setCountryPickerOpen(true)}
                      className="shrink-0 rounded-md border border-white/60 bg-white/50 shadow-sm ease-bounce transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:translate-y-0 active:scale-95 overflow-hidden cursor-pointer"
                      title="Chọn quốc gia"
                    >
                      {countryCode ? (
                        <FlagImg code={countryCode} size={32} />
                      ) : (
                        <Globe className="h-5 w-5 text-ink/50 m-1" />
                      )}
                    </button>
                  </h1>
                )}
              </div>
              <CountryPickerDialog
                current={countryCode}
                displayName={displayName}
                avatarEmoji={avatarEmoji}
                avatarUrl={avatarUrl}
                open={countryPickerOpen}
                onOpenChange={setCountryPickerOpen}
                onSelect={setCountryCode}
              />
              <p className="text-sm text-muted-foreground mt-0.5 truncate">{user.email}</p>
              <p className="text-xs text-muted-foreground mt-1">Thành viên từ {memberSince}</p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            {
              emoji: "🎯",
              value: completedCount,
              label: "Bài hoàn thành",
              color: "bg-stage-1-soft text-stage-1-deep",
            },
            {
              emoji: "📖",
              value: inProgressCount,
              label: "Đang học",
              color: "bg-stage-4-soft text-ink",
            },
          ].map(({ emoji, value, label, color }) => (
            <div
              key={label}
              className={["rounded-2xl p-4 text-center ring-1 ring-border shadow-card", color].join(
                " ",
              )}
            >
              <div className="text-2xl mb-1">{emoji}</div>
              <div className="font-display text-2xl font-bold text-ink leading-none">
                {isProgressLoading ? "—" : value}
              </div>
              <div className="text-xs font-semibold mt-1 text-muted-foreground leading-tight">
                {label}
              </div>
            </div>
          ))}
          <div className="rounded-2xl bg-primary/8 p-4 text-center shadow-card ring-1 ring-border">
            <div className="text-2xl mb-1">🔥</div>
            <div className="font-display text-2xl font-bold text-ink leading-none">
              {streak.days}
            </div>
            <div className="text-xs font-semibold mt-1 text-muted-foreground leading-tight">
              Ngày liên tiếp
            </div>
            <div
              className={[
                "mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold",
                streak.studiedToday
                  ? "bg-stage-1-soft text-stage-1-deep"
                  : "bg-muted text-muted-foreground",
              ].join(" ")}
            >
              {streak.studiedToday ? "✓ Hôm nay xong" : "Chưa học hôm nay"}
            </div>
          </div>
        </div>

        {/* Badges */}
        <BadgeCollection
          userId={user.id}
          title="🏅 Huy hiệu của em"
          emptyHint="Em chưa có huy hiệu nào. Học hết một chủ đề để nhận huy hiệu đầu tiên nhé!"
          zoomable
        />

        {/* Account actions */}
        <div className="rounded-3xl bg-white ring-1 ring-border shadow-card p-6 space-y-3">
          <h2 className="font-display text-lg font-bold text-ink mb-4">⚙️ Tài khoản</h2>

          {isEmailUser && (
            <Button
              variant="outline"
              className="w-full justify-start gap-3 rounded-xl h-12 font-bold text-ink border-border hover:bg-muted"
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
                className="h-12 w-full justify-start gap-3 rounded-xl border-stage-4/40 font-bold text-stage-4-deep hover:border-stage-4/60 hover:bg-stage-4-soft"
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
                <AlertDialogTitle className="font-display text-xl font-bold text-ink">
                  Bắt đầu lại từ đầu? 🔄
                </AlertDialogTitle>
                <AlertDialogDescription className="text-base leading-relaxed">
                  Tất cả tiến độ học tập của em sẽ bị xóa và em sẽ bắt đầu lại từ bài đầu tiên. Tài
                  khoản của em vẫn được giữ lại.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl font-bold">
                  Thôi, giữ lại
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRestartProgress}
                  className="rounded-xl bg-stage-4 font-bold hover:brightness-95"
                >
                  Bắt đầu lại
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            variant="outline"
            className="w-full justify-start gap-3 rounded-xl h-12 font-bold text-destructive border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 pb-4">
          Phiên bản 1.0 · Trường Tiếng Việt Của Em 🇻🇳
        </p>
      </main>
    </div>
  );
}

// ─── Public (read-only) view ──────────────────────────────────────────────────

function PublicView({ username }: { username: string }) {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["public-profile", username],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    staleTime: 60_000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen">
        <main className="mx-auto max-w-lg px-4 py-20 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="font-display text-2xl font-bold text-ink mb-2">
            Không tìm thấy người dùng
          </h1>
          <p className="text-muted-foreground mb-6">
            Hồ sơ <span className="font-semibold text-ink">@{username}</span> không tồn tại.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-display text-sm font-bold text-white shadow-bevel-primary transition-[transform,box-shadow,filter] ease-bounce hover:-translate-y-0.5 hover:scale-[1.03] hover:brightness-105 active:translate-y-[3px] active:scale-100 active:shadow-bevel-primary-active"
          >
            <Home className="h-4 w-4" />
            Về trang chủ
          </Link>
        </main>
      </div>
    );
  }

  const avatarLetter = profile.display_name[0]?.toUpperCase() ?? "?";
  const memberSince = new Date(profile.created_at).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
        {/* Hero card */}
        <div className="relative mb-6 overflow-hidden rounded-3xl border border-border bg-card shadow-card ring-1 ring-black/[0.02]">
          {/* Red cover strip — matches the owner's own profile header. */}
          <div className="relative h-28 overflow-hidden bg-gradient-to-br from-primary via-maroon to-maroon-deep">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute -right-16 -top-20 h-56 w-56 rotate-[20deg] rounded-[30%] bg-primary-glow/40 blur-[2px]" />
              <div className="absolute -bottom-24 -left-16 h-44 w-44 rotate-[20deg] rounded-[30%] bg-gold/20 blur-[2px]" />
            </div>
          </div>

          <div className="relative flex flex-col items-center gap-4 p-8 pt-4 text-center sm:flex-row sm:items-start sm:text-left">
            {/* Lifted so it straddles the cover strip's bottom edge. */}
            <div className="-mt-16 shrink-0">
              <div
                className={[
                  "h-24 w-24 rounded-full shadow-lg ring-4 ring-white overflow-hidden flex items-center justify-center font-bold font-display",
                  profile.avatar_url || profile.avatar_emoji
                    ? "bg-sky-100"
                    : avatarColor(avatarLetter),
                ].join(" ")}
              >
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : profile.avatar_emoji ? (
                  <span className="text-5xl">{profile.avatar_emoji}</span>
                ) : (
                  <span className="text-3xl">{avatarLetter}</span>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="font-display text-2xl font-bold text-ink">{profile.display_name}</h1>
                {profile.country && (
                  <span className="rounded-md border border-white/60 bg-white/50 shadow-sm overflow-hidden">
                    <FlagImg code={profile.country} size={28} />
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">@{profile.username}</p>
              <p className="text-xs text-muted-foreground mt-1">Thành viên từ {memberSince}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <div className="rounded-2xl p-4 text-center ring-1 ring-border shadow-card bg-stage-1-soft">
            <div className="text-2xl mb-1">🎯</div>
            <div className="font-display text-2xl font-bold text-ink leading-none">
              {profile.completed_count}
            </div>
            <div className="text-xs font-semibold mt-1 text-muted-foreground">Bài hoàn thành</div>
          </div>
        </div>

        {/* Badges */}
        <BadgeCollection
          userId={profile.id}
          title="🏅 Huy hiệu"
          emptyHint="Bạn này chưa sưu tầm được huy hiệu nào."
          showLocked={false}
        />

        <p className="text-center text-xs text-muted-foreground pb-4">
          Trường Tiếng Việt Của Em 🇻🇳
        </p>
      </main>
    </div>
  );
}

// ─── Route component ──────────────────────────────────────────────────────────

function ProfilePage() {
  const { username } = Route.useParams();
  const { user, isLoading, signOut } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const myDisplayName =
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "Học sinh";
  const myUsername = user ? generateUsername(myDisplayName, user.id) : null;
  const isOwner = myUsername === username;

  if (isOwner && user) return <OwnerView user={user} signOut={signOut} />;
  return <PublicView username={username} />;
}
