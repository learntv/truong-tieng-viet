import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Mascot } from "@/components/Mascot";
import { PageBanner } from "@/components/site/PageBanner";

const leaderboardQueryOptions = {
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
};

export const Route = createFileRoute("/bang-xep-hang")({
  head: () => ({
    meta: [
      { title: "Bảng xếp hạng — Trường Tiếng Việt Của Em" },
      { name: "description", content: "Xem danh sách học sinh xuất sắc nhất trường." },
      { property: "og:title", content: "Bảng xếp hạng — Trường Tiếng Việt Của Em" },
      { property: "og:description", content: "Những học sinh chăm chỉ nhất Trường Tiếng Việt Của Em." },
      { property: "og:url", content: "/bang-xep-hang" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(leaderboardQueryOptions),
  component: BangXepHang,
});

const AVATAR_COLORS = [
  "bg-stage-1 text-white",
  "bg-stage-2 text-white",
  "bg-stage-3 text-white",
  "bg-stage-4 text-white",
  "bg-stage-5 text-white",
];

function avatarColor(letter: string) {
  return AVATAR_COLORS[letter.charCodeAt(0) % AVATAR_COLORS.length];
}

const RANK_STYLES: Record<number, { emoji: string }> = {
  1: { emoji: "🥇" },
  2: { emoji: "🥈" },
  3: { emoji: "🥉" },
};

function BangXepHang() {
  const { data: profiles, isLoading } = useQuery(leaderboardQueryOptions);

  return (
    <main>
      <PageBanner title="Bảng xếp hạng" subtitle="Những học sinh chăm chỉ nhất trường." />

      <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
        {/* Card */}
        <div className="relative">
          {/* Trâu con cheers the board on from the side. Hidden on narrow screens,
          where there is no room beside the card for him to sit. */}
          <Mascot
            pose="cheer"
            decorative
            bob
            className="pointer-events-none absolute left-full top-16 ml-6 hidden h-32 lg:block"
          />
          <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-card">
            {/* Trophy badge, straddling the card's top edge now that the title
            itself lives up in the PageBanner. */}
            <div className="flex justify-center pt-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Trophy className="h-8 w-8 text-primary" strokeWidth={2.5} />
              </div>
            </div>

            {/* List */}
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !profiles || profiles.length === 0 ? (
              <div className="p-12 text-center">
                <Mascot pose="wave" decorative className="mx-auto mb-3 h-24" />
                <p className="font-display text-lg font-bold text-navy">Chưa có học sinh nào!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Hãy là người đầu tiên bắt đầu học nhé.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/60 px-2 py-2 sm:px-3">
                {profiles.map((profile, index) => {
                  const rank = index + 1;
                  const rankStyle = RANK_STYLES[rank];
                  const avatarLetter = profile.display_name[0]?.toUpperCase() ?? "?";

                  return (
                    <Link
                      key={profile.username}
                      to="/u/$username"
                      params={{ username: profile.username }}
                      className="flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-muted/40 active:scale-[0.99]"
                    >
                      {/* Rank */}
                      <div className="w-8 shrink-0 text-center">
                        {rankStyle ? (
                          <span className="text-2xl leading-none">{rankStyle.emoji}</span>
                        ) : (
                          <span className="font-display text-sm font-bold text-muted-foreground">
                            {rank}
                          </span>
                        )}
                      </div>

                      {/* Avatar */}
                      <div
                        className={[
                          "h-10 w-10 shrink-0 rounded-full overflow-hidden flex items-center justify-center font-extrabold font-display shadow-sm ring-2 ring-white",
                          profile.avatar_url || profile.avatar_emoji
                            ? "bg-sky/30"
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
                          <span className="text-xl">{profile.avatar_emoji}</span>
                        ) : (
                          <span className="text-base">{avatarLetter}</span>
                        )}
                      </div>

                      {/* Name + username */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-display font-bold text-navy truncate">
                            {profile.display_name}
                          </span>
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
                        <p className="text-xs text-muted-foreground truncate">
                          @{profile.username}
                        </p>
                      </div>

                      {/* Score */}
                      <div className="shrink-0 text-right">
                        <div className="font-display text-lg font-extrabold text-navy leading-none">
                          {profile.completed_count}
                        </div>
                        <div className="text-[10px] font-semibold text-muted-foreground leading-tight">
                          bài xong
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
