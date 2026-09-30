import type { User } from "@supabase/supabase-js";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
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
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { deleteOwnAccount } from "@/lib/account.functions";
import { supabase } from "@/integrations/supabase/client";
import { FlagImg } from "@/components/FlagImg";
import { PageBanner } from "@/components/site/PageBanner";
import { upsertProfile, generateUsername } from "@/lib/profile";
import { useAuth } from "@/hooks/useAuth";
import { useUserProgress } from "@/hooks/useUserProgress";
import { messagesFor, useLocale, useT } from "@/i18n";
import { pageTitle } from "@/i18n/head";
import { Rich } from "@/i18n/Rich";
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
  head: ({ params, match }) => {
    const { locale } = match.context;
    const m = messagesFor(locale).meta.profile;
    const title = pageTitle(locale, m.title(params.username));
    const description = m.description(params.username);
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

// Same card language as the Học tập page: pastel box tones, a soft shadow, and
// a hover rim in a deeper shade of the card's own tone.
const CARD_SHADOW = "shadow-[0_6px_20px_rgba(12,58,110,0.14)]";

const ACTION_TONES = {
  lavender: "bg-box-lavender text-sky-ink hover:outline-[#8b74f0]",
  peach: "bg-box-peach text-sky-ink hover:outline-[#e8903a]",
  cream: "bg-box-cream text-sky-ink hover:outline-[#b8962e]",
  danger: "bg-destructive/10 text-destructive hover:outline-destructive/60",
} as const;

function actionClass(tone: keyof typeof ACTION_TONES) {
  return [
    "flex h-14 w-full cursor-pointer items-center gap-3 rounded-2xl px-4 text-left font-display font-bold outline-4 outline-offset-0 outline-transparent transition-[outline-color] duration-150 disabled:pointer-events-none disabled:opacity-60",
    ACTION_TONES[tone],
  ].join(" ");
}

function ActionIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/80">
      {children}
    </span>
  );
}

/** A section title followed by a hairline, as on the Học tập page. */
function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="shrink-0 font-display text-xl font-bold leading-tight text-sky-ink sm:text-2xl">
        {title}
      </h2>
      <div aria-hidden="true" className="h-px flex-1 bg-sky-ink/15" />
    </div>
  );
}

function ProfileAvatar({
  url,
  emoji,
  letter,
}: {
  url: string | undefined | null;
  emoji: string | undefined | null;
  letter: string;
}) {
  const t = useT();
  return (
    <div
      className={[
        "flex h-24 w-24 items-center justify-center overflow-hidden rounded-full font-display font-semibold ring-4 ring-white sm:h-28 sm:w-28",
        url || emoji ? "bg-white" : avatarColor(letter),
      ].join(" ")}
    >
      {url ? (
        <img
          src={url}
          alt={t.nav.avatarAlt}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : emoji ? (
        <span className="text-5xl sm:text-6xl">{emoji}</span>
      ) : (
        <span className="text-4xl">{letter}</span>
      )}
    </div>
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
  const t = useT();
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
        // Stored as the profile's display_name (and slugged into its username), so this
        // fallback is data and stays the same in every interface language.
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
      toast.error(t.profile.avatarSaveFailed, { description: error.message });
    } else {
      onSelect(avatar);
      onOpenChange(false);
      toast.success(t.profile.avatarSaved);
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
      toast.error(t.profile.avatarBadType);
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error(t.profile.avatarTooBig);
      return;
    }

    setSaving(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error(t.profile.signInAgain);

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
      toast.error(t.profile.uploadFailed, {
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
          <DialogTitle className="font-display text-xl font-bold text-navy">
            {t.profile.pickAvatar}
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
          {t.profile.uploadPhoto}
        </Button>
        <p className="text-center text-xs text-muted-foreground">{t.profile.uploadHint}</p>
        <div className="grid grid-cols-5 gap-2">
          {AVATAR_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleSelect(emoji)}
              disabled={saving}
              className={[
                "h-12 w-full cursor-pointer rounded-xl text-2xl flex items-center justify-center transition-all active:scale-90 disabled:opacity-50",
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
  const t = useT();
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
      toast.error(t.profile.countrySaveFailed, { description: error.message });
    } else {
      onSelect(code);
      onOpenChange(false);
      toast.success(t.profile.countrySaved);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl max-w-sm p-5">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold text-navy">
            {t.profile.pickCountry}
          </DialogTitle>
        </DialogHeader>
        <Input
          placeholder={t.profile.search}
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
                "flex cursor-pointer flex-col items-center gap-0.5 rounded-xl p-2 transition-all text-center hover:bg-sky/30 active:scale-95",
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
              {t.profile.noCountry}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Owner (editable) view ────────────────────────────────────────────────────

function OwnerView({ user, signOut }: { user: User; signOut: () => void }) {
  const t = useT();
  const { fmtDate } = useLocale();
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
      toast.success(t.profile.accountDeleted);
      navigate({ to: "/", replace: true });
    } catch (err) {
      setIsDeleting(false);
      toast.error(t.profile.deleteFailed, {
        description: err instanceof Error ? err.message : t.profile.tryAgain,
      });
    }
  };

  // Written back to the profile row below, so the fallback is data: same in every language.
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
      toast.success(t.profile.nameSaved);
      navigate({ to: "/u/$username", params: { username }, replace: true });
      return;
    }
    setSavingName(false);
    if (error) {
      toast.error(t.profile.nameSaveFailed, { description: error.message });
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
      toast.error(t.profile.resetEmailFailed, { description: error.message });
    } else {
      toast.success(t.profile.resetEmailSent);
    }
  };

  const handleRestartProgress = async () => {
    if (!user) return;
    setIsRestarting(true);
    const { error } = await supabase.from("user_progress").delete().eq("user_id", user.id);
    if (error) {
      setIsRestarting(false);
      toast.error(t.profile.progressResetFailed, { description: error.message });
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
    toast.success(t.profile.progressReset);
  };

  const memberSince = fmtDate(user.created_at, { year: "numeric", month: "long" });
  const completedCount = [...progressMap.values()].filter((p) => p.isCompleted).length;
  const inProgressCount = [...progressMap.values()].filter(
    (p) => !p.isCompleted && p.noiDungIndex > 0,
  ).length;
  const isEmailUser = user.app_metadata?.provider !== "google";

  return (
    <main className="pb-10 sm:pb-12">
      <PageBanner title={t.profile.title} />

      <section className="mx-auto mt-8 max-w-3xl px-4 sm:mt-10 sm:px-8">
        <div
          className={[
            "flex flex-col items-center gap-5 rounded-[1.5rem] bg-box-ice p-5 text-center sm:flex-row sm:gap-6 sm:p-6 sm:text-left",
            CARD_SHADOW,
          ].join(" ")}
        >
            <div className="relative shrink-0">
              <ProfileAvatar url={avatarUrl} emoji={avatarEmoji} letter={avatarLetter} />
              <button
                onClick={() => setAvatarPickerOpen(true)}
                className="absolute bottom-0 right-0 grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-white text-sky-ink shadow-sm transition-transform hover:scale-110"
                title={t.profile.changeAvatar}
              >
                <Pencil className="h-4 w-4" />
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
              <div className="flex items-center justify-center gap-2 flex-wrap sm:justify-start">
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
                      className="font-display text-2xl font-bold text-sky-ink bg-white rounded-lg px-2 py-0.5 border-2 border-sky-ink/30 outline-none focus:border-sky-ink/60 min-w-0 w-full sm:text-3xl"
                      maxLength={40}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={savingName}
                      className="shrink-0 h-8 w-8 cursor-pointer rounded-full bg-green shadow-bevel-stage-1 flex items-center justify-center text-white transition-[transform,box-shadow] ease-bounce hover:-translate-y-0.5 hover:scale-110 active:translate-y-[2px] active:shadow-bevel-stage-1-active disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {savingName ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                ) : (
                  <h2 className="font-display text-2xl font-bold text-sky-ink leading-tight flex items-center justify-center gap-2 flex-wrap sm:justify-start sm:text-3xl">
                    <span className="truncate">{displayName}</span>
                    <button
                      onClick={() => {
                        setNameInput(displayName);
                        setEditingName(true);
                        setTimeout(() => nameInputRef.current?.select(), 0);
                      }}
                      className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full bg-white/80 text-sky-ink transition-colors hover:bg-white"
                      title={t.profile.changeName}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setCountryPickerOpen(true)}
                      className="shrink-0 cursor-pointer overflow-hidden rounded-md bg-white/80 transition-transform hover:scale-105"
                      title={t.profile.pickCountryTitle}
                    >
                      {countryCode ? (
                        <FlagImg code={countryCode} size={32} />
                      ) : (
                        <Globe className="m-1 h-5 w-5 text-sky-ink" />
                      )}
                    </button>
                  </h2>
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
              <p className="mt-1 truncate text-sm text-sky-ink-soft">{user.email}</p>
              <p className="mt-0.5 text-sm text-sky-ink-soft">
                {t.profile.memberSince(memberSince)}
              </p>
            </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
          {[
            {
              emoji: "🎯",
              value: isProgressLoading ? "…" : completedCount,
              label: t.profile.lessonsCompleted,
              tone: "bg-box-mint",
              note: null,
            },
            {
              emoji: "📖",
              value: isProgressLoading ? "…" : inProgressCount,
              label: t.profile.inProgress,
              tone: "bg-box-peach",
              note: null,
            },
            {
              emoji: "🔥",
              value: streak.days,
              label: t.profile.streak,
              tone: "bg-box-pink",
              note: streak.studiedToday ? t.profile.doneToday : t.profile.notToday,
            },
          ].map(({ emoji, value, label, tone, note }) => (
            <div
              key={label}
              className={["rounded-[1.25rem] p-3 text-center sm:p-5", tone, CARD_SHADOW].join(" ")}
            >
              <div className="text-2xl sm:text-3xl">{emoji}</div>
              <div className="mt-2 font-display text-3xl font-bold leading-none text-sky-ink sm:text-4xl">
                {value}
              </div>
              <div className="mt-1.5 text-xs font-semibold leading-tight text-sky-ink-soft sm:text-sm">
                {label}
              </div>
              {note && (
                <div className="mt-1 text-[11px] leading-tight text-sky-ink-soft/80 sm:text-xs">
                  {note}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-3xl px-4 sm:mt-12 sm:px-8">
        <SectionHeading title={t.profile.account} />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4">

          {isEmailUser && (
            <button
              className={actionClass("lavender")}
              onClick={handleResetPassword}
              disabled={isSendingReset}
            >
              <ActionIcon>
                {isSendingReset ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <KeyRound className="h-4 w-4" />
                )}
              </ActionIcon>
              {t.profile.changePassword}
            </button>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className={actionClass("peach")} disabled={isRestarting}>
                <ActionIcon>
                  {isRestarting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RotateCcw className="h-4 w-4" />
                  )}
                </ActionIcon>
                {t.profile.restart}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-display text-xl font-bold text-navy">
                  {t.profile.restartTitle}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-base leading-relaxed">
                  {t.profile.restartBody}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl font-medium">
                  {t.profile.keep}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRestartProgress}
                  className="rounded-xl bg-stage-4 font-medium hover:brightness-95"
                >
                  {t.profile.restartConfirm}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <button className={actionClass("cream")} onClick={signOut}>
            <ActionIcon>
              <LogOut className="h-4 w-4" />
            </ActionIcon>
            {t.nav.signOut}
          </button>

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
                <button className={actionClass("danger")}>
                  <ActionIcon>
                    <Trash2 className="h-4 w-4" />
                  </ActionIcon>
                  {t.profile.deleteAccount}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-3xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display text-xl font-bold text-destructive">
                    {t.profile.deleteTitle}
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-base leading-relaxed">
                    <Rich
                      text={t.profile.deleteBody(t.profile.deleteWord)}
                      as="span"
                      className="font-semibold text-destructive"
                    />
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Input
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder={t.profile.deletePlaceholder(t.profile.deleteWord)}
                  className="rounded-xl"
                  disabled={isDeleting}
                />
                <AlertDialogFooter>
                  <AlertDialogCancel
                    disabled={isDeleting}
                    className="rounded-xl font-medium"
                  >
                    {t.profile.cancel}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteAccount();
                    }}
                    disabled={
                      isDeleting || deleteConfirm.trim().toUpperCase() !== t.profile.deleteWord
                    }
                    className="rounded-xl bg-destructive font-medium text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      t.profile.deleteForever
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
      </section>

      <p className="mt-10 text-center text-xs text-muted-foreground">
        {t.profile.version(t.site.name)}
      </p>
    </main>
  );
}

// ─── Public (read-only) view ──────────────────────────────────────────────────

function PublicView({ username }: { username: string }) {
  const t = useT();
  const { fmtDate } = useLocale();
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
          <h1 className="font-display text-2xl font-bold text-navy mb-2">
            {t.profile.userNotFound}
          </h1>
          <p className="text-muted-foreground mb-6">
            <Rich
              text={t.profile.userNotFoundBody(username)}
              as="span"
              className="font-semibold text-navy"
            />
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-display text-sm font-extrabold text-white shadow-bevel-primary transition-[transform,box-shadow,filter] ease-bounce hover:-translate-y-0.5 hover:scale-[1.03] hover:brightness-105 active:translate-y-[3px] active:scale-100 active:shadow-bevel-primary-active"
          >
            <Home className="h-4 w-4" />
            {t.errors.backHome}
          </Link>
        </main>
      </div>
    );
  }

  const avatarLetter = profile.display_name[0]?.toUpperCase() ?? "?";
  const memberSince = fmtDate(profile.created_at, { year: "numeric", month: "long" });

  return (
    <main className="pb-10 sm:pb-12">
      <PageBanner title={t.profile.title} />

      <section className="mx-auto mt-8 max-w-3xl px-4 sm:mt-10 sm:px-8">
        <div
          className={[
            "flex flex-col items-center gap-5 rounded-[1.5rem] bg-box-ice p-5 text-center sm:flex-row sm:gap-6 sm:p-6 sm:text-left",
            CARD_SHADOW,
          ].join(" ")}
        >
          <div className="shrink-0">
            <ProfileAvatar
              url={profile.avatar_url}
              emoji={profile.avatar_emoji}
              letter={avatarLetter}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h2 className="font-display text-2xl font-bold leading-tight text-sky-ink sm:text-3xl">
                {profile.display_name}
              </h2>
              {profile.country && (
                <span className="overflow-hidden rounded-md bg-white/80">
                  <FlagImg code={profile.country} size={32} />
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-sky-ink-soft">@{profile.username}</p>
            <p className="mt-0.5 text-sm text-sky-ink-soft">
              {t.profile.memberSince(memberSince)}
            </p>
          </div>

          <div className="shrink-0 rounded-[1.25rem] bg-box-mint px-6 py-4 text-center">
            <div className="font-display text-3xl font-bold leading-none text-sky-ink sm:text-4xl">
              {profile.completed_count}
            </div>
            <div className="mt-1.5 text-xs font-semibold text-sky-ink-soft sm:text-sm">
              {t.profile.lessonsCompleted}
            </div>
          </div>
        </div>
      </section>

      <p className="mt-10 text-center text-xs text-muted-foreground">{t.site.name} 🇻🇳</p>
    </main>
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

  // Untranslated on purpose: it's slugged into the username, which is part of the URL.
  const myDisplayName =
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "Học sinh";
  const myUsername = user ? generateUsername(myDisplayName, user.id) : null;
  const isOwner = myUsername === username;

  if (isOwner && user) return <OwnerView user={user} signOut={signOut} />;
  return <PublicView username={username} />;
}
