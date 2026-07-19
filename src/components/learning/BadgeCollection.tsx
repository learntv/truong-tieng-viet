import { BADGES } from "@/data/badges";
import { useBadges } from "@/hooks/useBadges";
import { BadgeMedal } from "./BadgeMedal";

/**
 * A user's badge collection. Every badge in the catalogue gets a slot — uncollected ones stay
 * visible but locked, so the shelf reads as a set to complete. Each says how it is earned, so
 * badges won by different means sit together without needing to be explained as a group.
 *
 * Reads from the publicly-visible `user_badges` table, so this renders for any user, which is
 * what makes another child's profile show their collection too.
 */
export function BadgeCollection({
  userId,
  title,
  emptyHint,
}: {
  userId: string | null;
  title: string;
  emptyHint: string;
}) {
  const { earnedSlugs } = useBadges(userId);
  const earnedCount = BADGES.filter((b) => earnedSlugs.has(b.slug)).length;

  return (
    <div className="rounded-3xl bg-white ring-1 ring-border shadow-card p-6 mb-6">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-lg font-extrabold text-navy">{title}</h2>
        <span className="text-sm font-bold text-muted-foreground">
          {earnedCount}/{BADGES.length}
        </span>
      </div>

      {earnedCount === 0 && <p className="mb-4 text-sm text-muted-foreground">{emptyHint}</p>}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {BADGES.map((badge) => {
          const earned = earnedSlugs.has(badge.slug);
          return (
            <div key={badge.slug} className="flex flex-col items-center text-center">
              <BadgeMedal badge={badge} earned={earned} size="md" />
              <div className="mt-2 font-display text-sm font-bold leading-tight text-navy">
                {badge.name}
              </div>
              <div className="mt-0.5 text-xs leading-tight text-muted-foreground">
                {badge.upcoming ? "Sắp có" : earned ? "Đã sưu tầm" : badge.howToEarn}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
