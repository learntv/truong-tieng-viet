import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Mascot } from "@/components/Mascot";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/layout/Container";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

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
      {
        name: "description",
        content:
          "Xem bảng xếp hạng học sinh chăm chỉ nhất Trường Tiếng Việt Của Em và theo dõi tiến độ học tập.",
      },
      { property: "og:title", content: "Bảng xếp hạng — Trường Tiếng Việt Của Em" },
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

type LeaderProfile = NonNullable<ReturnType<typeof useLeaderboard>["data"]>[number];

const useLeaderboard = () => useQuery(leaderboardQueryOptions);

function ProfileAvatar({ profile, size }: { profile: LeaderProfile; size: string }) {
  const letter = profile.display_name[0]?.toUpperCase() ?? "?";
  return (
    <span
      className={[
        "grid shrink-0 place-items-center overflow-hidden rounded-full font-bold ring-4 ring-white",
        size,
        profile.avatar_url || profile.avatar_emoji ? "bg-sky-50" : avatarColor(letter),
      ].join(" ")}
    >
      {profile.avatar_url ? (
        <img
          src={profile.avatar_url}
          alt=""
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : profile.avatar_emoji ? (
        <span className="text-[1.4em]">{profile.avatar_emoji}</span>
      ) : (
        letter
      )}
    </span>
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
      className="block shrink-0 rounded-[3px] object-cover"
    />
  );
}

/* Gold, silver, bronze — drawn as filled medals rather than emoji. */
const PODIUM = {
  1: { medal: "bg-sun-500 text-ink-900", step: "h-36 bg-sun-100", avatar: "size-20 text-2xl" },
  2: { medal: "bg-ink-300 text-ink-900", step: "h-28 bg-ink-100", avatar: "size-16 text-xl" },
  3: { medal: "bg-coral-500 text-white", step: "h-20 bg-coral-100", avatar: "size-16 text-xl" },
} as const;

function PodiumPlace({ profile, rank }: { profile: LeaderProfile; rank: 1 | 2 | 3 }) {
  const look = PODIUM[rank];
  return (
    <Link
      to="/u/$username"
      params={{ username: profile.username }}
      className="group flex min-w-0 flex-1 flex-col items-center"
    >
      <div className="relative">
        <ProfileAvatar profile={profile} size={look.avatar} />
        <span
          className={`absolute -right-1 -bottom-1 grid size-8 place-items-center rounded-full text-sm font-extrabold ring-4 ring-white ${look.medal}`}
        >
          {rank}
        </span>
      </div>
      <span className="mt-3 flex max-w-full items-center gap-1.5">
        <span className="truncate font-bold text-ink-900 group-hover:text-brand-700">
          {profile.display_name}
        </span>
        <Flag country={profile.country} />
      </span>
      <span className="text-sm text-ink-500 tabular-nums">{profile.completed_count} bài xong</span>
      <span
        aria-hidden
        className={`mt-3 w-full rounded-t-3xl transition-transform duration-300 ease-out group-hover:-translate-y-1 ${look.step}`}
      />
    </Link>
  );
}

function BangXepHang() {
  const { data: profiles, isLoading } = useLeaderboard();
  const podium = profiles && profiles.length >= 3 ? profiles.slice(0, 3) : [];
  const rest = profiles ? profiles.slice(podium.length) : [];

  return (
    <>
      <PageHeader
        icon={Trophy}
        hue="sun"
        title="Bảng xếp hạng"
        lede="Những học sinh chăm chỉ nhất trường."
        width="narrow"
        aside={
          <Mascot
            pose="cheer"
            size="lg"
            decorative
            className="hidden h-36 animate-float md:block"
          />
        }
      />

      <Container width="narrow" className="pb-20">
        {isLoading ? (
          <ul className="flex flex-col gap-2" aria-busy="true" aria-label="Đang tải bảng xếp hạng">
            {Array.from({ length: 6 }, (_, i) => (
              <li key={i} className="h-[4.5rem] animate-pulse rounded-2xl bg-ink-50" />
            ))}
          </ul>
        ) : !profiles || profiles.length === 0 ? (
          <EmptyState
            icon={Trophy}
            illustration={<Mascot pose="wave" decorative className="h-24" />}
            title="Chưa có học sinh nào!"
            description="Hãy là người đầu tiên bắt đầu học nhé."
            action={
              <Button asChild>
                <Link to="/hoc-tap">Bắt đầu học</Link>
              </Button>
            }
          />
        ) : (
          <>
            {podium.length === 3 && (
              <div className="mb-8 flex items-end gap-3 border-b border-ink-100 sm:gap-5">
                <PodiumPlace profile={podium[1]} rank={2} />
                <PodiumPlace profile={podium[0]} rank={1} />
                <PodiumPlace profile={podium[2]} rank={3} />
              </div>
            )}

            <ol className="flex flex-col gap-2" start={podium.length + 1}>
              {rest.map((profile, index) => {
                const rank = index + 1 + podium.length;
                return (
                  <li key={profile.username}>
                    <Link
                      to="/u/$username"
                      params={{ username: profile.username }}
                      className="flex items-center gap-4 rounded-2xl border border-ink-100 bg-white px-4 py-3 shadow-xs transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-ink-200 hover:shadow-md"
                    >
                      <span className="w-7 shrink-0 text-center font-bold text-ink-400 tabular-nums">
                        {rank}
                      </span>
                      <ProfileAvatar profile={profile} size="size-11 text-base" />
                      <span className="min-w-0 flex-1">
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="truncate font-semibold text-ink-900">
                            {profile.display_name}
                          </span>
                          <Flag country={profile.country} />
                        </span>
                        <span className="block truncate text-sm text-ink-500">
                          @{profile.username}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block text-lg leading-none font-extrabold text-ink-900 tabular-nums">
                          {profile.completed_count}
                        </span>
                        <span className="text-caption text-ink-500">bài xong</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </>
        )}
      </Container>
    </>
  );
}
