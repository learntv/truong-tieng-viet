import { useState } from "react";
import { BADGES, type Badge } from "@/data/badges";
import { useBadges } from "@/hooks/useBadges";
import { BadgeMedal } from "./BadgeMedal";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

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
  showLocked = true,
  zoomable = false,
}: {
  userId: string | null;
  title: string;
  emptyHint: string;
  /**
   * Whether badges the user hasn't got yet still take up a slot. On your own page they do — the
   * locked ones are the point, they show what's left to collect. On someone else's page they are
   * noise about a stranger's homework, so their shelf shows only what they actually earned.
   */
  showLocked?: boolean;
  /** Whether tapping a badge opens it larger. */
  zoomable?: boolean;
}) {
  const { earnedSlugs } = useBadges(userId);
  const earnedCount = BADGES.filter((b) => earnedSlugs.has(b.slug)).length;
  const visible = showLocked ? BADGES : BADGES.filter((b) => earnedSlugs.has(b.slug));
  const [zoomed, setZoomed] = useState<Badge | null>(null);
  const zoomedEarned = zoomed != null && earnedSlugs.has(zoomed.slug);

  return (
    <div className="rounded-3xl bg-white ring-1 ring-border shadow-card p-6 mb-6">
      <h2 className="mb-4 font-display text-lg font-bold text-navy">{title}</h2>

      {earnedCount === 0 && <p className="text-sm text-muted-foreground">{emptyHint}</p>}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {visible.map((badge) => {
          const earned = earnedSlugs.has(badge.slug);
          const caption = (
            <>
              <div className="mt-2 font-display text-sm font-bold leading-tight text-navy">
                {badge.name}
              </div>
              <div className="mt-0.5 text-xs leading-tight text-muted-foreground">
                {badge.upcoming ? "Sắp có" : earned ? "Đã sưu tầm" : badge.howToEarn}
              </div>
            </>
          );

          if (!zoomable) {
            return (
              <div key={badge.slug} className="flex flex-col items-center text-center">
                <BadgeMedal badge={badge} earned={earned} size="md" />
                {caption}
              </div>
            );
          }

          return (
            <button
              key={badge.slug}
              type="button"
              onClick={() => setZoomed(badge)}
              aria-label={`Xem huy hiệu ${badge.name}`}
              className="flex flex-col items-center rounded-2xl p-1 text-center transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95"
            >
              <BadgeMedal badge={badge} earned={earned} size="md" />
              {caption}
            </button>
          );
        })}
      </div>

      <Dialog open={zoomed != null} onOpenChange={(open) => !open && setZoomed(null)}>
        <DialogContent className="max-w-xs rounded-3xl">
          {zoomed && (
            <div className="flex flex-col items-center text-center">
              <BadgeMedal badge={zoomed} earned={zoomedEarned} size="xl" />
              <DialogTitle className="mt-4 font-display text-xl font-bold text-navy">
                {zoomed.name}
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm">
                {zoomed.upcoming
                  ? "Huy hiệu này sắp có nhé!"
                  : zoomedEarned
                    ? "Em đã sưu tầm được huy hiệu này rồi. Giỏi lắm! 🎉"
                    : zoomed.howToEarn}
              </DialogDescription>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
