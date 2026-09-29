import type { User } from "@supabase/supabase-js";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import * as React from "react";
import {
  BookOpen,
  Check,
  ChevronRight,
  Flame,
  Globe,
  Home,
  ImagePlus,
  KeyRound,
  Loader2,
  LogOut,
  Pencil,
  RotateCcw,
  SearchX,
  Settings,
  Target,
  Trash2,
  TriangleAlert,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { deleteOwnAccount } from "@/lib/account.functions";
import { supabase } from "@/integrations/supabase/client";
import { FlagImg } from "@/components/FlagImg";
import { upsertProfile, generateUsername } from "@/lib/profile";
import { useAuth } from "@/hooks/useAuth";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoader } from "@/components/ui/page-loader";
import { Container } from "@/components/layout/Container";
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
  head: ({ params }) => {
    const title = `Hồ sơ của ${params.username} — Trường Tiếng Việt Của Em`;
    const description = `Xem hồ sơ và tiến trình học tiếng Việt của ${params.username} trên Trường Tiếng Việt Của Em.`;
    const url = `/u/${params.username}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "noindex" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
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
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Chọn avatar của em</DialogTitle>
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
          className="w-full"
        >
          {saving ? <Loader2 className="animate-spin" /> : <ImagePlus className="text-brand-600" />}
          Tải ảnh của em lên
        </Button>
        <p className="-mt-2 text-center text-caption text-ink-500">
          JPG, PNG, WebP hoặc GIF — tối đa 2MB
        </p>
        <div className="grid grid-cols-5 gap-2">
          {AVATAR_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleSelect(emoji)}
              disabled={saving}
              className={[
                "flex h-12 w-full cursor-pointer items-center justify-center rounded-2xl text-2xl transition-[transform,background-color] duration-200 active:scale-90 disabled:opacity-50",
                current === emoji
                  ? "scale-110 bg-brand-50 ring-2 ring-brand-500"
                  : "bg-ink-50 hover:bg-brand-50",
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chọn quốc gia của em</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Tìm quốc gia"
          autoFocus
        />
        <div className="grid max-h-72 grid-cols-4 gap-2 overflow-y-auto pr-1">
          {filtered.map((c) => (
            <button
              key={c.code}
              onClick={() => handleSelect(c.code)}
              disabled={saving}
              title={c.name}
              className={[
                "flex cursor-pointer flex-col items-center gap-1 rounded-2xl p-2 text-center transition-[background-color,transform] duration-150 hover:bg-ink-50 active:scale-95",
                current === c.code ? "bg-brand-50 ring-2 ring-brand-500" : "",
              ].join(" ")}
            >
              <FlagImg code={c.code} size={28} />
              <span className="line-clamp-1 text-[0.6875rem] leading-tight font-semibold text-ink-700">
                {c.name}
              </span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-4 py-6 text-center text-sm text-ink-500">
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
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteAccountFn = useServerFn(deleteOwnAccount);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccountFn();
      await queryClient.cancelQueries();
      queryClient.clear();
      await supabase.auth.signOut();
      try {
        localStorage.removeItem("vui-hoc-progress");
        sessionStorage.removeItem("vui-hoc-buffalo-pos");
      } catch {
        /* ignore */
      }
      toast.success("Tài khoản đã được xóa. Tạm biệt em! 👋");
      navigate({ to: "/", replace: true });
    } catch (err) {
      setIsDeleting(false);
      toast.error("Không thể xóa tài khoản", {
        description: err instanceof Error ? err.message : "Vui lòng thử lại.",
      });
    }
  };

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
    upsertProfile({
      userId: user.id,
      displayName,
      avatarEmoji: emoji,
      avatarUrl: url,
      country: countryCode,
    });
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
    <Container width="narrow" className="py-8 sm:py-12">
      <ProfileHero
        avatar={
          <>
            <ProfileAvatarFace url={avatarUrl} emoji={avatarEmoji} letter={avatarLetter} />
            <button
              onClick={() => setAvatarPickerOpen(true)}
              className="absolute right-0 bottom-0 grid size-9 cursor-pointer place-items-center rounded-full border border-ink-100 bg-white text-ink-700 shadow-md transition-transform duration-200 hover:scale-110"
              aria-label="Đổi avatar"
              title="Đổi avatar"
            >
              <Pencil className="size-4" aria-hidden />
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
          </>
        }
      >
        {editingName ? (
          <div className="flex items-center gap-2">
            <Input
              ref={nameInputRef}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveName();
                if (e.key === "Escape") setEditingName(false);
              }}
              aria-label="Tên hiển thị"
              className="h-11 text-lg font-bold"
              maxLength={40}
              autoFocus
            />
            <Button
              size="icon"
              tone="stage-1"
              onClick={handleSaveName}
              disabled={savingName}
              aria-label="Lưu tên"
            >
              {savingName ? <Loader2 className="animate-spin" /> : <Check strokeWidth={3} />}
            </Button>
          </div>
        ) : (
          <h1 className="flex flex-wrap items-center justify-center gap-2 text-h2 text-ink-900 sm:justify-start">
            <span className="truncate">{displayName}</span>
            <button
              onClick={() => {
                setNameInput(displayName);
                setEditingName(true);
                setTimeout(() => nameInputRef.current?.select(), 0);
              }}
              className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full bg-ink-50 text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
              aria-label="Đổi tên"
              title="Đổi tên"
            >
              <Pencil className="size-4" aria-hidden />
            </button>
            <button
              onClick={() => setCountryPickerOpen(true)}
              className="shrink-0 cursor-pointer overflow-hidden rounded-md shadow-xs ring-1 ring-ink-100 transition-transform hover:-translate-y-0.5"
              aria-label="Chọn quốc gia"
              title="Chọn quốc gia"
            >
              {countryCode ? (
                <FlagImg code={countryCode} size={32} />
              ) : (
                <Globe className="m-1 size-5 text-ink-400" />
              )}
            </button>
          </h1>
        )}
        <CountryPickerDialog
          current={countryCode}
          displayName={displayName}
          avatarEmoji={avatarEmoji}
          avatarUrl={avatarUrl}
          open={countryPickerOpen}
          onOpenChange={setCountryPickerOpen}
          onSelect={setCountryCode}
        />
        <p className="mt-1 truncate text-ink-600">{user.email}</p>
        <p className="mt-1 text-sm text-ink-500">Thành viên từ {memberSince}</p>
      </ProfileHero>

      <ul className="mt-6 grid grid-cols-3 gap-3">
        <StatTile
          icon={Target}
          hue="bg-leaf-50 text-leaf-700"
          value={isProgressLoading ? "—" : completedCount}
          label="Bài hoàn thành"
        />
        <StatTile
          icon={BookOpen}
          hue="bg-brand-50 text-brand-700"
          value={isProgressLoading ? "—" : inProgressCount}
          label="Đang học"
        />
        <StatTile
          icon={Flame}
          hue="bg-coral-50 text-coral-700"
          value={streak.days}
          label="Ngày liên tiếp"
          note={streak.studiedToday ? "Hôm nay xong" : "Chưa học hôm nay"}
          noteDone={streak.studiedToday}
        />
      </ul>

      <section className="mt-6 rounded-3xl border border-ink-100 bg-white p-2 shadow-xs">
        <h2 className="flex items-center gap-2 px-4 pt-4 pb-2 text-h3 text-ink-900">
          <Settings className="size-5 text-ink-400" aria-hidden />
          Tài khoản
        </h2>
        <ul className="flex flex-col">
          {isEmailUser && (
            <li>
              <SettingsRow
                icon={isSendingReset ? Loader2 : KeyRound}
                spin={isSendingReset}
                iconHue="bg-brand-50 text-brand-600"
                label="Đổi mật khẩu"
                hint="Gửi liên kết đặt lại mật khẩu tới email của em"
                onClick={handleResetPassword}
                disabled={isSendingReset}
              />
            </li>
          )}
          <li>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <SettingsRow
                  icon={isRestarting ? Loader2 : RotateCcw}
                  spin={isRestarting}
                  iconHue="bg-sun-50 text-sun-700"
                  label="Bắt đầu lại từ đầu"
                  hint="Xóa tiến độ học, giữ lại tài khoản"
                  disabled={isRestarting}
                />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Bắt đầu lại từ đầu?</AlertDialogTitle>
                  <AlertDialogDescription className="text-base">
                    Tất cả tiến độ học tập của em sẽ bị xóa và em sẽ bắt đầu lại từ bài đầu tiên.
                    Tài khoản của em vẫn được giữ lại.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Thôi, giữ lại</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRestartProgress}
                    className={buttonVariants({ tone: "stage-4" })}
                  >
                    Bắt đầu lại
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </li>
          <li>
            <SettingsRow
              icon={LogOut}
              iconHue="bg-ink-50 text-ink-600"
              label="Đăng xuất"
              onClick={signOut}
            />
          </li>
        </ul>
      </section>

      <section className="mt-6 flex flex-col gap-4 rounded-3xl bg-danger-50 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-h3 text-danger-700">Xóa tài khoản</h2>
          <p className="mt-1 text-sm text-danger-700/80">
            Xóa vĩnh viễn hồ sơ và toàn bộ tiến độ học tập.
          </p>
        </div>
        <AlertDialog
          open={deleteOpen}
          onOpenChange={(open) => {
            if (!isDeleting) {
              setDeleteOpen(open);
              if (!open) setDeleteConfirm("");
            }
          }}
        >
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="shrink-0">
              <Trash2 aria-hidden />
              Xóa tài khoản
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-danger-50 text-danger-600 sm:mx-0">
                <TriangleAlert className="size-6" aria-hidden />
              </span>
              <AlertDialogTitle className="text-danger-700">
                Xóa tài khoản vĩnh viễn?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                Toàn bộ hồ sơ và tiến độ học tập của em sẽ bị xóa vĩnh viễn và không thể khôi phục.
                Hãy gõ <span className="font-bold text-danger-700">XÓA</span> vào ô bên dưới để xác
                nhận.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Input
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="Gõ XÓA để xác nhận"
              aria-label="Xác nhận xóa tài khoản"
              disabled={isDeleting}
            />
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteAccount();
                }}
                disabled={isDeleting || deleteConfirm.trim().toUpperCase() !== "XÓA"}
                className={buttonVariants({ variant: "destructive" })}
              >
                {isDeleting ? <Loader2 className="animate-spin" /> : "Xóa vĩnh viễn"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

      <p className="mt-8 text-center text-caption text-ink-400">
        Phiên bản 1.0 · Trường Tiếng Việt Của Em
      </p>
    </Container>
  );
}

// ─── Shared pieces ────────────────────────────────────────────────────────────

function ProfileAvatarFace({
  url,
  emoji,
  letter,
}: {
  url?: string | null;
  emoji?: string | null;
  letter: string;
}) {
  return (
    <span
      className={[
        "grid size-28 place-items-center overflow-hidden rounded-full font-bold shadow-lg ring-[6px] ring-white",
        url || emoji ? "bg-sky-50" : avatarColor(letter),
      ].join(" ")}
    >
      {url ? (
        <img src={url} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
      ) : emoji ? (
        <span className="text-6xl">{emoji}</span>
      ) : (
        <span className="text-4xl">{letter}</span>
      )}
    </span>
  );
}

/** The profile's header card: a brand-blue cover band, the avatar straddling
 *  its lower edge, and the name block beside it. */
function ProfileHero({ avatar, children }: { avatar: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-ink-100 bg-white shadow-md">
      <div aria-hidden className="relative h-32 overflow-hidden bg-brand-600">
        <div className="absolute -top-20 -right-10 size-64 rounded-full bg-brand-500" />
        <div className="absolute -bottom-24 left-1/4 size-48 rounded-full bg-sun-500/30" />
        <div className="bg-dots absolute inset-0 opacity-20 invert" />
      </div>
      <div className="flex flex-col items-center gap-4 px-6 pb-8 text-center sm:flex-row sm:items-end sm:gap-6 sm:px-8 sm:text-left">
        <div className="relative -mt-14 shrink-0">{avatar}</div>
        <div className="min-w-0 flex-1 sm:pb-1">{children}</div>
      </div>
    </div>
  );
}

function StatTile({
  icon: Icon,
  hue,
  value,
  label,
  note,
  noteDone,
}: {
  icon: LucideIcon;
  hue: string;
  value: React.ReactNode;
  label: string;
  note?: string;
  noteDone?: boolean;
}) {
  return (
    <li className="flex flex-col items-center gap-2 rounded-3xl border border-ink-100 bg-white p-4 text-center shadow-xs sm:items-start sm:p-5 sm:text-left">
      <span className={`grid size-10 place-items-center rounded-xl ${hue}`}>
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="text-h2 leading-none text-ink-900 tabular-nums">{value}</span>
      <span className="text-sm leading-tight font-medium text-ink-500">{label}</span>
      {note && (
        <span
          className={[
            "rounded-full px-2 py-0.5 text-caption font-semibold",
            noteDone ? "bg-leaf-50 text-leaf-700" : "bg-ink-50 text-ink-500",
          ].join(" ")}
        >
          {note}
        </span>
      )}
    </li>
  );
}

const SettingsRow = React.forwardRef<
  HTMLButtonElement,
  {
    icon: LucideIcon;
    spin?: boolean;
    iconHue: string;
    label: string;
    hint?: string;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ icon: Icon, spin, iconHue, label, hint, className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={[
      "group flex w-full cursor-pointer items-center gap-4 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-ink-25 disabled:cursor-not-allowed disabled:opacity-60",
      className ?? "",
    ].join(" ")}
    {...props}
  >
    <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${iconHue}`}>
      <Icon className={["size-5", spin ? "animate-spin" : ""].join(" ")} aria-hidden />
    </span>
    <span className="min-w-0 flex-1">
      <span className="block font-semibold text-ink-900">{label}</span>
      {hint && <span className="block truncate text-sm text-ink-500">{hint}</span>}
    </span>
    <ChevronRight
      className="size-5 text-ink-300 transition-transform group-hover:translate-x-0.5"
      aria-hidden
    />
  </button>
));
SettingsRow.displayName = "SettingsRow";

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
    return <PageLoader label="Đang tải hồ sơ" />;
  }

  if (!profile) {
    return (
      <Container width="narrow" className="py-16">
        <EmptyState
          icon={SearchX}
          title="Không tìm thấy người dùng"
          description={
            <>
              Hồ sơ <span className="font-semibold text-ink-800">@{username}</span> không tồn tại.
            </>
          }
          action={
            <Button asChild>
              <Link to="/">
                <Home aria-hidden />
                Về trang chủ
              </Link>
            </Button>
          }
        />
      </Container>
    );
  }

  const avatarLetter = profile.display_name[0]?.toUpperCase() ?? "?";
  const memberSince = new Date(profile.created_at).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
  });

  return (
    <Container width="narrow" className="py-8 sm:py-12">
      <ProfileHero
        avatar={
          <ProfileAvatarFace
            url={profile.avatar_url}
            emoji={profile.avatar_emoji}
            letter={avatarLetter}
          />
        }
      >
        <h1 className="flex flex-wrap items-center justify-center gap-2 text-h2 text-ink-900 sm:justify-start">
          {profile.display_name}
          {profile.country && (
            <span className="overflow-hidden rounded-md shadow-xs ring-1 ring-ink-100">
              <FlagImg code={profile.country} size={28} />
            </span>
          )}
        </h1>
        <p className="mt-1 text-ink-600">@{profile.username}</p>
        <p className="mt-1 text-sm text-ink-500">Thành viên từ {memberSince}</p>
      </ProfileHero>

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatTile
          icon={Target}
          hue="bg-leaf-50 text-leaf-700"
          value={profile.completed_count}
          label="Bài hoàn thành"
        />
      </ul>

      <div className="mt-8 flex justify-center">
        <Button asChild variant="secondary">
          <Link to="/bang-xep-hang">
            <Trophy aria-hidden />
            Xem bảng xếp hạng
          </Link>
        </Button>
      </div>
    </Container>
  );
}

// ─── Route component ──────────────────────────────────────────────────────────

function ProfilePage() {
  const { username } = Route.useParams();
  const { user, isLoading, signOut } = useAuth();

  if (isLoading) {
    return <PageLoader label="Đang tải hồ sơ" />;
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
