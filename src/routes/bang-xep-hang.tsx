import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/bang-xep-hang")({
  head: () => ({
    meta: [
      { title: "Bảng xếp hạng — Trường Tiếng Việt Của Em" },
      { name: "description", content: "Xem danh sách học sinh xuất sắc nhất trường." },
    ],
  }),
  component: BangXepHang,
});

const AVATAR_COLORS = [
  "bg-green text-white",
  "bg-sky text-navy",
  "bg-purple text-white",
  "bg-yellow text-navy",
  "bg-pink text-white",
];

function avatarColor(letter: string) {
  return AVATAR_COLORS[letter.charCodeAt(0) % AVATAR_COLORS.length];
}

const RANK_STYLES: Record<number, { bg: string; label: string; emoji: string }> = {
  1: { bg: "bg-yellow/30 border-yellow", label: "text-yellow-700", emoji: "🥇" },
  2: { bg: "bg-slate-100 border-slate-300", label: "text-slate-600", emoji: "🥈" },
  3: { bg: "bg-orange-100 border-orange-300", label: "text-orange-700", emoji: "🥉" },
};

function BangXepHang() {
  const { data: profiles, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, display_name, avatar_emoji, avatar_url, country, completed_count")
        .order("completed_count", { ascending: false })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    staleTime: 60_000,
  });

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">

        <div className="mb-8 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow/30 text-4xl mb-3 shadow-sm">
            <Trophy className="h-8 w-8 text-yellow-600" strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-3xl font-extrabold text-navy leading-tight">Bảng xếp hạng</h1>
          <p className="text-sm text-muted-foreground mt-1">Những học sinh chăm chỉ nhất trường</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !profiles || profiles.length === 0 ? (
          <div className="rounded-3xl bg-white shadow-card p-12 text-center">
            <div className="text-5xl mb-3">🌱</div>
            <p className="font-display text-lg font-bold text-navy">Chưa có học sinh nào!</p>
            <p className="text-sm text-muted-foreground mt-1">Hãy là người đầu tiên bắt đầu học nhé.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {profiles.map((profile, index) => {
              const rank = index + 1;
              const rankStyle = RANK_STYLES[rank];
              const avatarLetter = profile.display_name[0]?.toUpperCase() ?? "?";

              return (
                <Link
                  key={profile.username}
                  to="/u/$username"
                  params={{ username: profile.username }}
                  className={[
                    "flex items-center gap-4 rounded-2xl border px-4 py-3 transition-all hover:shadow-md active:scale-[0.99]",
                    rankStyle ? `${rankStyle.bg} shadow-sm` : "bg-white border-border hover:border-primary/30",
                  ].join(" ")}
                >
                  {/* Rank */}
                  <div className="w-8 shrink-0 text-center">
                    {rankStyle ? (
                      <span className="text-2xl leading-none">{rankStyle.emoji}</span>
                    ) : (
                      <span className="font-display text-sm font-bold text-muted-foreground">{rank}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className={[
                    "h-10 w-10 shrink-0 rounded-full overflow-hidden flex items-center justify-center font-extrabold font-display shadow-sm",
                    profile.avatar_url || profile.avatar_emoji ? "bg-sky/30" : avatarColor(avatarLetter),
                  ].join(" ")}>
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    ) : profile.avatar_emoji ? (
                      <span className="text-xl">{profile.avatar_emoji}</span>
                    ) : (
                      <span className="text-base">{avatarLetter}</span>
                    )}
                  </div>

                  {/* Name + username */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-display font-bold text-navy truncate">{profile.display_name}</span>
                      {profile.country && (
                        <img
                          src={`https://flagcdn.com/w40/${profile.country.toLowerCase()}.png`}
                          width={20}
                          height={15}
                          alt={profile.country}
                          className="block shrink-0 object-cover rounded-sm"
                        />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">@{profile.username}</p>
                  </div>

                  {/* Score */}
                  <div className="shrink-0 text-right">
                    <div className="font-display text-lg font-extrabold text-navy leading-none">{profile.completed_count}</div>
                    <div className="text-[10px] font-semibold text-muted-foreground leading-tight">bài xong</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-8 pb-4">Trường Tiếng Việt Của Em 🇻🇳</p>
      </main>
    </div>
  );
}
