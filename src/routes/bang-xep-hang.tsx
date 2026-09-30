import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
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
      { title: "Bảng xếp hạng | Trường Tiếng Việt Của Em" },
      {
        name: "description",
        content:
          "Xem bảng xếp hạng học sinh chăm chỉ nhất Trường Tiếng Việt Của Em và theo dõi tiến độ học tập.",
      },
      { property: "og:title", content: "Bảng xếp hạng | Trường Tiếng Việt Của Em" },
      {
        property: "og:description",
        content:
          "Xem bảng xếp hạng học sinh chăm chỉ nhất Trường Tiếng Việt Của Em và theo dõi tiến độ học tập.",
      },
      { property: "og:url", content: "/bang-xep-hang" },
    ],
    links: [{ rel: "canonical", href: "/bang-xep-hang" }],
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

type Profile = Awaited<ReturnType<typeof leaderboardQueryOptions.queryFn>>[number];

/**
 * The three podium steps. The winner stands in the middle on the tallest step,
 * second on the left, third on the right; each place has its own medal colour
 * for the rank badge and a pale version of it for the step.
 */
const PODIUM: Record<1 | 2 | 3, { step: string; height: string; badge: string }> = {
  1: {
    step: "bg-amber-100",
    height: "h-28 sm:h-36",
    badge: "bg-amber-400 text-sky-ink",
  },
  2: {
    step: "bg-slate-100",
    height: "h-20 sm:h-28",
    badge: "bg-slate-300 text-sky-ink",
  },
  3: {
    step: "bg-orange-100",
    height: "h-14 sm:h-20",
    badge: "bg-orange-500 text-white",
  },
};

/** Left-to-right order of the podium: 2nd, 1st, 3rd. */
const PODIUM_ORDER = [2, 1, 3] as const;

function BangXepHang() {
  const { data: profiles, isLoading } = useQuery(leaderboardQueryOptions);

  return (
    <main>
      <PageBanner title="Bảng xếp hạng" />

      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
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
          <>
            <div className="grid grid-cols-3 items-end gap-2 sm:gap-3">
              {PODIUM_ORDER.map((rank) => {
                const profile = profiles[rank - 1];
                // With fewer than three students the empty places keep their column,
                // so the winner still stands in the middle.
                return profile ? (
                  <PodiumPlace key={rank} profile={profile} rank={rank} />
                ) : (
                  <div key={rank} />
                );
              })}
            </div>

            {profiles.length > 3 && (
              <ol className="mt-6 space-y-3" start={4}>
                {profiles.slice(3).map((profile, i) => (
                  <li key={profile.username}>
                    <RankRow profile={profile} rank={i + 4} />
                  </li>
                ))}
              </ol>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function PodiumPlace({ profile, rank }: { profile: Profile; rank: 1 | 2 | 3 }) {
  const look = PODIUM[rank];
  return (
    <Link
      to="/u/$username"
      params={{ username: profile.username }}
      className="group flex min-w-0 flex-col items-center"
    >
      <div className="relative">
        <Avatar
          profile={profile}
          className={rank === 1 ? "h-20 w-20 text-4xl" : "h-16 w-16 text-3xl"}
        />
        <span
          className={[
            "absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full font-display text-sm font-bold ring-2 ring-white",
            look.badge,
          ].join(" ")}
        >
          {rank}
        </span>
      </div>

      <div className="mt-3 flex w-full min-w-0 items-center justify-center gap-1.5 px-1">
        <span className="truncate font-display font-bold text-navy group-hover:underline">
          {profile.display_name}
        </span>
        <Flag country={profile.country} />
      </div>
      <p className="text-xs text-muted-foreground">{profile.completed_count} bài xong</p>

      <div className={["mt-3 w-full rounded-t-3xl", look.step, look.height].join(" ")} />
    </Link>
  );
}

function RankRow({ profile, rank }: { profile: Profile; rank: number }) {
  return (
    <Link
      to="/u/$username"
      params={{ username: profile.username }}
      className="flex items-center gap-4 rounded-2xl border border-border/60 bg-white px-4 py-3 shadow-sm transition-colors hover:bg-muted/40"
    >
      <span className="w-6 shrink-0 text-center font-display text-sm font-semibold text-muted-foreground">
        {rank}
      </span>

      <Avatar profile={profile} className="h-10 w-10 text-xl" />

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate font-display font-semibold text-navy">
            {profile.display_name}
          </span>
          <Flag country={profile.country} />
        </div>
        <p className="truncate text-xs text-muted-foreground">@{profile.username}</p>
      </div>

      <div className="shrink-0 text-right">
        <div className="font-display text-lg font-bold leading-none text-navy">
          {profile.completed_count}
        </div>
        <div className="text-[10px] font-semibold leading-tight text-muted-foreground">
          bài xong
        </div>
      </div>
    </Link>
  );
}

/** Photo, then emoji, then a coloured initial. `className` sets size and emoji size. */
function Avatar({ profile, className }: { profile: Profile; className: string }) {
  const letter = profile.display_name[0]?.toUpperCase() ?? "?";
  const hasPicture = profile.avatar_url || profile.avatar_emoji;
  return (
    <div
      className={[
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full font-display font-semibold",
        hasPicture ? "bg-sky-tint" : avatarColor(letter),
        className,
      ].join(" ")}
    >
      {profile.avatar_url ? (
        <img
          src={profile.avatar_url}
          alt={`Ảnh đại diện của ${profile.display_name}`}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : profile.avatar_emoji ? (
        <span>{profile.avatar_emoji}</span>
      ) : (
        <span className="text-[0.5em]">{letter}</span>
      )}
    </div>
  );
}

function Flag({ country }: { country: string | null }) {
  if (!country) return null;
  return (
    <img
      src={`https://flagcdn.com/w40/${country.toLowerCase()}.png`}
      width={20}
      height={15}
      alt={country}
      className="block shrink-0 rounded-sm object-cover"
    />
  );
}
