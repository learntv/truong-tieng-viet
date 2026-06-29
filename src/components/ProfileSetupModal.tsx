import { useEffect, useState } from "react";
import { Loader2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { upsertProfile } from "@/lib/profile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const AVATAR_OPTIONS = [
  "🐯", "🐼", "🐨", "🦊", "🐸",
  "🐙", "🦋", "🐬", "🦁", "🐺",
  "🐻", "🦝", "🦄", "🐲", "🐧",
  "🦜", "🐳", "🦔", "🐮", "🐱",
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

interface ProfileSetupModalProps {
  user: User;
  onComplete: () => void;
}

export function ProfileSetupModal({ user, onComplete }: ProfileSetupModalProps) {
  const defaultName =
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "";

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
          const data = await res.json() as { country_code?: string };
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
        avatar_emoji: selectedEmoji,
        country: countryCode || null,
        profile_setup_completed: true,
      },
    });
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await upsertProfile({
          userId: user.id,
          displayName: trimmedName,
          avatarEmoji: selectedEmoji,
          avatarUrl: user.user_metadata?.avatar_url as string | undefined,
          country: countryCode || null,
        });
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
        className="rounded-3xl max-w-sm p-6"
        onInteractOutside={(e) => e.preventDefault()}
        hideCloseButton
      >
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-extrabold text-navy text-center">
            Chào mừng! 🎉
          </DialogTitle>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Hãy tạo hồ sơ của em nhé
          </p>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Avatar picker */}
          <div className="space-y-2">
            <Label className="font-bold text-navy">Chọn avatar của em</Label>
            <div className="grid grid-cols-5 gap-1.5">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  className={[
                    "h-12 w-full rounded-xl text-2xl flex items-center justify-center transition-all active:scale-90",
                    selectedEmoji === emoji
                      ? "bg-sky/50 ring-2 ring-sky scale-110 shadow-sm"
                      : "bg-muted/40 hover:bg-sky/20",
                  ].join(" ")}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="setup-name" className="font-bold text-navy">
              Tên của em
            </Label>
            <Input
              id="setup-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên..."
              className="rounded-xl"
              maxLength={40}
            />
          </div>

          {/* Country */}
          <div className="space-y-1.5">
            <Label className="font-bold text-navy">Em đang ở đâu?</Label>
            {!showCountryPicker ? (
              <button
                type="button"
                onClick={() => setShowCountryPicker(true)}
                className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-semibold text-navy hover:bg-muted transition-colors"
              >
                <span className="flex items-center gap-2">
                  {detectingCountry ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : selectedCountry ? (
                    <>
                      <FlagImg code={selectedCountry.code} size={20} />
                      {selectedCountry.name}
                    </>
                  ) : (
                    <span className="text-muted-foreground">Chọn quốc gia...</span>
                  )}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ) : (
              <div className="space-y-2">
                <Input
                  placeholder="Tìm kiếm..."
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  className="rounded-xl"
                  autoFocus
                />
                <div className="grid grid-cols-4 gap-1.5 max-h-40 overflow-y-auto pr-1">
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
                        "flex flex-col items-center gap-0.5 rounded-xl p-2 text-center transition-all hover:bg-sky/30 active:scale-95",
                        countryCode === c.code ? "bg-sky/40 ring-2 ring-sky" : "",
                      ].join(" ")}
                    >
                      <FlagImg code={c.code} size={24} />
                      <span className="text-[9px] font-semibold text-navy leading-tight line-clamp-1">
                        {c.name}
                      </span>
                    </button>
                  ))}
                  {filteredCountries.length === 0 && (
                    <p className="col-span-4 text-center text-xs text-muted-foreground py-3">
                      Không tìm thấy
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <Button
            className="w-full rounded-xl h-12 font-extrabold text-base"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Bắt đầu học! 🚀"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
