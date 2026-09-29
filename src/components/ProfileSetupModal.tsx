import { useEffect, useState } from "react";
import { Loader2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FlagImg } from "@/components/FlagImg";
import { upsertProfile } from "@/lib/profile";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mascot } from "@/components/Mascot";
import { Button } from "@/components/ui/button";

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

interface ProfileSetupModalProps {
  user: User;
  onComplete: () => void;
}

export function ProfileSetupModal({ user, onComplete }: ProfileSetupModalProps) {
  const queryClient = useQueryClient();
  const defaultName =
    (user.user_metadata?.full_name as string | undefined) || user.email?.split("@")[0] || "";

  // A provider avatar (e.g. Google's profile photo) always wins over an emoji in the avatar
  // display everywhere else in the app, so offering the emoji grid here would be a choice
  // that silently does nothing. Skip it and just show what will actually be used.
  const hasProviderAvatar = Boolean(user.user_metadata?.avatar_url);

  const [name, setName] = useState(defaultName);
  const [selectedEmoji, setSelectedEmoji] = useState<string>(AVATAR_OPTIONS[0]);
  const [countryCode, setCountryCode] = useState<string>("");
  const [countrySearch, setCountrySearch] = useState("");
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [detectingCountry, setDetectingCountry] = useState(true);

  useEffect(() => {
    const detect = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (res.ok) {
          const data = (await res.json()) as { country_code?: string };
          if (data.country_code && COUNTRIES.some((c) => c.code === data.country_code)) {
            setCountryCode(data.country_code);
          }
        }
      } catch {
        // silently ignore — user can pick manually
      } finally {
        setDetectingCountry(false);
      }
    };
    detect();
  }, []);

  const selectedCountry = COUNTRIES.find((c) => c.code === countryCode);

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Hãy nhập tên của em nhé!");
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: trimmedName,
        avatar_emoji: hasProviderAvatar ? null : selectedEmoji,
        country: countryCode || null,
        profile_setup_completed: true,
      },
    });
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await upsertProfile({
          userId: user.id,
          displayName: trimmedName,
          avatarEmoji: hasProviderAvatar ? null : selectedEmoji,
          avatarUrl: user.user_metadata?.avatar_url as string | undefined,
          country: countryCode || null,
        });
        queryClient.invalidateQueries({ queryKey: ["own-profile", user.id] });
      }
    }
    setSaving(false);
    if (error) {
      toast.error("Không thể lưu hồ sơ", { description: error.message });
    } else {
      onComplete();
    }
  };

  return (
    <Dialog open>
      <DialogContent
        className="max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        hideCloseButton
      >
        <DialogHeader>
          <Mascot pose="wave" decorative className="mx-auto h-24" />
          <DialogTitle className="text-center text-h2">Chào mừng em!</DialogTitle>
          <p className="text-center text-ink-600">Hãy tạo hồ sơ của em nhé</p>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          {/* Avatar */}
          {hasProviderAvatar ? (
            <div className="flex items-center gap-3 rounded-2xl bg-brand-50 p-3">
              <img
                src={user.user_metadata?.avatar_url as string}
                alt="Avatar"
                referrerPolicy="no-referrer"
                className="size-12 shrink-0 rounded-full object-cover shadow-sm ring-2 ring-white"
              />
              <p className="text-sm text-brand-800">
                Bọn mình sẽ dùng ảnh đại diện Google của em nhé!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Label>Chọn avatar của em</Label>
              <div className="grid grid-cols-5 gap-2">
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={[
                      "flex h-12 w-full cursor-pointer items-center justify-center rounded-2xl text-2xl transition-[transform,background-color] duration-200 active:scale-90",
                      selectedEmoji === emoji
                        ? "scale-110 bg-brand-50 ring-2 ring-brand-500"
                        : "bg-ink-50 hover:bg-brand-50",
                    ].join(" ")}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Name */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="setup-name">Tên của em</Label>
            <Input
              id="setup-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên..."
              maxLength={40}
            />
          </div>

          {/* Country */}
          <div className="flex flex-col gap-2">
            <Label>Em đang ở đâu?</Label>
            {!showCountryPicker ? (
              <button
                type="button"
                onClick={() => setShowCountryPicker(true)}
                className="flex h-12 w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-ink-200 bg-white px-4 font-medium text-ink-900 shadow-xs transition-colors hover:border-ink-300"
              >
                <span className="flex items-center gap-2">
                  {detectingCountry ? (
                    <Loader2 className="size-4 animate-spin text-ink-400" />
                  ) : selectedCountry ? (
                    <>
                      <FlagImg code={selectedCountry.code} size={20} />
                      {selectedCountry.name}
                    </>
                  ) : (
                    <span className="text-ink-400">Chọn quốc gia...</span>
                  )}
                </span>
                <ChevronRight className="size-4 text-ink-400" />
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="Tìm kiếm..."
                  aria-label="Tìm quốc gia"
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  autoFocus
                />
                <div className="grid max-h-44 grid-cols-4 gap-2 overflow-y-auto pr-1">
                  {filteredCountries.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        setCountryCode(c.code);
                        setShowCountryPicker(false);
                        setCountrySearch("");
                      }}
                      title={c.name}
                      className={[
                        "flex cursor-pointer flex-col items-center gap-1 rounded-2xl p-2 text-center transition-[background-color,transform] duration-150 hover:bg-ink-50 active:scale-95",
                        countryCode === c.code ? "bg-brand-50 ring-2 ring-brand-500" : "",
                      ].join(" ")}
                    >
                      <FlagImg code={c.code} size={24} />
                      <span className="line-clamp-1 text-[0.6875rem] leading-tight font-semibold text-ink-700">
                        {c.name}
                      </span>
                    </button>
                  ))}
                  {filteredCountries.length === 0 && (
                    <p className="col-span-4 py-4 text-center text-sm text-ink-500">
                      Không tìm thấy
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <Button size="lg" className="w-full" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="animate-spin" /> : "Bắt đầu học!"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
