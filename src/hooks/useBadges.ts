import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * The slugs of the badges a user has collected, matching `Badge.slug` in `@/data/badges`.
 *
 * The database decides what has been earned and by what rule, so this hook stays correct as new
 * kinds of badge are added — it never needs to know why any of them were awarded.
 *
 * Works for any user id, not just the signed-in one: `user_badges` is publicly readable, which
 * is what lets children see each other's collections.
 */
export function useBadges(userId: string | null) {
  const { data, isLoading } = useQuery({
    queryKey: ["badges", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_badges")
        .select("badge_slug")
        .eq("user_id", userId!);
      if (error) throw error;
      return new Set((data ?? []).map((r) => r.badge_slug));
    },
    enabled: userId != null,
    staleTime: 5 * 60 * 1000,
  });

  return {
    earnedSlugs: data ?? new Set<string>(),
    isBadgesLoading: isLoading && userId != null,
  };
}
