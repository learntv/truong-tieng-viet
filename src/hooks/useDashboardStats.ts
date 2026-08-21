import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { learningStructureQueryOptions } from "@/lib/learning";

export type CountryCount = { code: string; count: number };
export type GrowthPoint = { period: string; students: number };

function bucketByMonth(dates: Date[]): GrowthPoint[] {
  const counts = new Map<string, number>();
  for (const d of dates) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const sortedKeys = [...counts.keys()].sort();
  let cumulative = 0;
  return sortedKeys.map((key) => {
    cumulative += counts.get(key)!;
    const [y, m] = key.split("-");
    return { period: `T${Number(m)}/${y}`, students: cumulative };
  });
}

function bucketByWeek(dates: Date[]): GrowthPoint[] {
  const counts = new Map<string, number>();
  for (const d of dates) {
    const onejan = new Date(d.getFullYear(), 0, 1);
    const week = Math.ceil(((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7);
    const key = `${d.getFullYear()}-W${String(week).padStart(2, "0")}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const sortedKeys = [...counts.keys()].sort();
  let cumulative = 0;
  return sortedKeys.slice(-12).map((key) => {
    cumulative += counts.get(key)!;
    return { period: key.split("-W")[1], students: cumulative };
  });
}

export function useDashboardStats() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      // "Finished the course" means every chặng, so the denominator has to come from wherever
      // the lessons live — that is the CMS now, not public.chang. `ensureQueryData` shares the
      // roadmap's cached copy instead of fetching the tree a second time.
      const [profilesRes, lessons, badgesRes] = await Promise.all([
        supabase.from("profiles").select("country, completed_count, created_at"),
        queryClient.ensureQueryData(learningStructureQueryOptions),
        supabase.from("user_badges").select("badge_slug", { count: "exact", head: true }),
      ]);
      if (profilesRes.error) throw profilesRes.error;
      if (badgesRes.error) throw badgesRes.error;

      const profiles = profilesRes.data ?? [];
      const totalChang = lessons.reduce((n, cd) => n + cd.changs.length, 0);
      const certificatesIssued = badgesRes.count ?? 0;

      const totalRegistered = profiles.length;

      const countryCounts = new Map<string, number>();
      for (const p of profiles) {
        if (!p.country) continue;
        const code = p.country.toUpperCase();
        countryCounts.set(code, (countryCounts.get(code) ?? 0) + 1);
      }
      const countryData: CountryCount[] = [...countryCounts.entries()]
        .map(([code, count]) => ({ code, count }))
        .sort((a, b) => b.count - a.count);

      const dates = profiles.map((p) => new Date(p.created_at));
      const monthlyGrowth = bucketByMonth(dates);
      const weeklyGrowth = bucketByWeek(dates);

      let completed = 0;
      let inProgress = 0;
      let notStarted = 0;
      for (const p of profiles) {
        if (totalChang > 0 && p.completed_count >= totalChang) completed += 1;
        else if (p.completed_count > 0) inProgress += 1;
        else notStarted += 1;
      }
      const completionRate = totalRegistered > 0 ? (completed / totalRegistered) * 100 : 0;

      return {
        totalRegistered,
        totalChang,
        certificatesIssued,
        countryData,
        monthlyGrowth,
        weeklyGrowth,
        completion: { completed, inProgress, notStarted },
        completionRate,
      };
    },
    staleTime: 5 * 60 * 1000,
  });

  return { stats: data, isStatsLoading: isLoading };
}
