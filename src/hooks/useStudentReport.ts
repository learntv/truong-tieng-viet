import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// A student counts as "active" if they have touched anything within this window;
// past it, a student who started but hasn't finished is flagged for follow-up.
const ACTIVE_DAYS = 14;
const WEEK_DAYS = 7;
const DAY_MS = 86_400_000;

export type StudentStatus = "completed" | "active" | "attention" | "new";

export type StudentRow = {
  id: string;
  username: string;
  displayName: string;
  country: string | null;
  avatarEmoji: string | null;
  avatarUrl: string | null;
  startedChang: number; // chặng the student has opened (a user_progress row exists)
  completedChang: number;
  totalChang: number;
  completionPct: number; // completed / total, 0–100
  speakingStars: number; // sum of best_stars across speaking practice
  lastActive: Date | null; // most recent completed_at / speaking updated_at
  registeredAt: Date;
  status: StudentStatus;
};

export type ChangFunnelRow = {
  id: string;
  title: string;
  chudeTitle: string;
  reached: number; // students who opened this chặng
  completed: number; // students who finished it
  dropoff: number; // reached − completed: how many are stuck here
  completionPct: number; // completed / reached, 0–100
};

export type ReportSummary = {
  totalStudents: number;
  activeWeek: number;
  needAttention: number;
  avgCompletion: number; // mean completionPct across students, 0–100
};

export type StudentReport = {
  students: StudentRow[];
  funnel: ChangFunnelRow[];
  summary: ReportSummary;
};

// `text` columns hold a localized payload that is either a string or an array of
// strings; the first entry is the display label (same convention as lib/learning).
function firstText(text: unknown): string {
  if (Array.isArray(text) && typeof text[0] === "string") return text[0];
  if (typeof text === "string") return text;
  return "";
}

function titleCase(s: string): string {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}

// Supabase caps a single response at 1000 rows. The progress tables grow with
// students × chặng, so we page through until a short batch signals the end.
async function fetchAll<T>(
  table: "user_progress" | "speaking_progress",
  columns: string,
): Promise<T[]> {
  const PAGE = 1000;
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .range(from, from + PAGE - 1);
    if (error) throw error;
    const batch = (data ?? []) as T[];
    rows.push(...batch);
    if (batch.length < PAGE) break;
  }
  return rows;
}

type ProgressRow = { user_id: string; chang_id: string; completed_at: string | null };
type SpeakingRow = { user_id: string; best_stars: number; updated_at: string };
type ProfileRow = {
  id: string;
  username: string;
  display_name: string;
  country: string | null;
  avatar_emoji: string | null;
  avatar_url: string | null;
  created_at: string;
};
type ChangRow = { id: string; chude_id: string; position: number; text: unknown };
type ChudeRow = { id: string; position: number; text: unknown };

function classify(
  completed: number,
  started: number,
  total: number,
  lastActive: Date | null,
  now: number,
): StudentStatus {
  if (total > 0 && completed >= total) return "completed";
  if (started === 0) return "new";
  const stale = !lastActive || now - lastActive.getTime() > ACTIVE_DAYS * DAY_MS;
  return stale ? "attention" : "active";
}

/**
 * Per-student progress roster + a "where students get stuck" content funnel.
 * Depends on the staff-read RLS on user_progress / speaking_progress — a
 * non-staff caller simply gets their own rows, so this is only meaningful on
 * the staff-gated dashboard.
 */
export function useStudentReport() {
  const { data, isLoading, error } = useQuery<StudentReport>({
    queryKey: ["student-report"],
    queryFn: async () => {
      const [profilesRes, changRes, chudeRes, progress, speaking] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, username, display_name, country, avatar_emoji, avatar_url, created_at"),
        supabase.from("chang").select("id, chude_id, position, text"),
        supabase.from("chude").select("id, position, text"),
        fetchAll<ProgressRow>("user_progress", "user_id, chang_id, completed_at"),
        fetchAll<SpeakingRow>("speaking_progress", "user_id, best_stars, updated_at"),
      ]);
      if (profilesRes.error) throw profilesRes.error;
      if (changRes.error) throw changRes.error;
      if (chudeRes.error) throw chudeRes.error;

      const profiles = (profilesRes.data ?? []) as ProfileRow[];
      const changs = (changRes.data ?? []) as ChangRow[];
      const chudes = (chudeRes.data ?? []) as ChudeRow[];
      const totalChang = changs.length;
      const now = Date.now();

      // --- Per-student aggregation -------------------------------------------------
      type Acc = { started: number; completed: number; stars: number; last: number };
      const acc = new Map<string, Acc>();
      const get = (id: string): Acc => {
        let a = acc.get(id);
        if (!a) {
          a = { started: 0, completed: 0, stars: 0, last: 0 };
          acc.set(id, a);
        }
        return a;
      };

      // --- Per-chặng funnel counters ----------------------------------------------
      const reached = new Map<string, number>();
      const completedByChang = new Map<string, number>();

      for (const r of progress) {
        const a = get(r.user_id);
        a.started += 1;
        reached.set(r.chang_id, (reached.get(r.chang_id) ?? 0) + 1);
        if (r.completed_at) {
          a.completed += 1;
          completedByChang.set(r.chang_id, (completedByChang.get(r.chang_id) ?? 0) + 1);
          a.last = Math.max(a.last, new Date(r.completed_at).getTime());
        }
      }
      for (const s of speaking) {
        const a = get(s.user_id);
        a.stars += s.best_stars;
        a.last = Math.max(a.last, new Date(s.updated_at).getTime());
      }

      const students: StudentRow[] = profiles.map((p) => {
        const a = acc.get(p.id) ?? { started: 0, completed: 0, stars: 0, last: 0 };
        const lastActive = a.last ? new Date(a.last) : null;
        return {
          id: p.id,
          username: p.username,
          displayName: p.display_name || p.username,
          country: p.country,
          avatarEmoji: p.avatar_emoji,
          avatarUrl: p.avatar_url,
          startedChang: a.started,
          completedChang: a.completed,
          totalChang,
          completionPct: totalChang > 0 ? (a.completed / totalChang) * 100 : 0,
          speakingStars: a.stars,
          lastActive,
          registeredAt: new Date(p.created_at),
          status: classify(a.completed, a.started, totalChang, lastActive, now),
        };
      });

      // Most-recently-active students first — that's what staff scan for.
      students.sort((x, y) => (y.lastActive?.getTime() ?? 0) - (x.lastActive?.getTime() ?? 0));

      // --- Funnel, ordered by curriculum sequence ----------------------------------
      const chudeById = new Map(chudes.map((c) => [c.id, c]));
      const funnel: ChangFunnelRow[] = changs
        .map((ch) => {
          const r = reached.get(ch.id) ?? 0;
          const c = completedByChang.get(ch.id) ?? 0;
          const cd = chudeById.get(ch.chude_id);
          return {
            id: ch.id,
            title: titleCase(firstText(ch.text)) || ch.id,
            chudeTitle: cd ? titleCase(firstText(cd.text)) : "",
            reached: r,
            completed: c,
            dropoff: r - c,
            completionPct: r > 0 ? (c / r) * 100 : 0,
            _chudePos: cd?.position ?? 0,
            _pos: ch.position,
          };
        })
        .sort((a, b) => a._chudePos - b._chudePos || a._pos - b._pos)
        .map(({ _chudePos, _pos, ...row }) => row);

      const withProgress = students.filter((s) => s.startedChang > 0);
      const summary: ReportSummary = {
        totalStudents: students.length,
        activeWeek: students.filter(
          (s) => s.lastActive && now - s.lastActive.getTime() <= WEEK_DAYS * DAY_MS,
        ).length,
        needAttention: students.filter((s) => s.status === "attention").length,
        avgCompletion:
          withProgress.length > 0
            ? withProgress.reduce((sum, s) => sum + s.completionPct, 0) / withProgress.length
            : 0,
      };

      return { students, funnel, summary };
    },
    staleTime: 5 * 60 * 1000,
  });

  return { report: data, isReportLoading: isLoading, reportError: error };
}
