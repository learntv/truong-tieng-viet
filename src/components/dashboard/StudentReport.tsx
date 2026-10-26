import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import roundArrowDownward from "@iconify-icons/ic/round-arrow-downward";
import roundArrowUpward from "@iconify-icons/ic/round-arrow-upward";
import roundSearch from "@iconify-icons/ic/round-search";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FlagImg } from "@/components/FlagImg";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type ChangFunnelRow,
  type StudentRow,
  type StudentStatus,
  useStudentReport,
} from "@/hooks/useStudentReport";
import { m } from "@/paraglide/messages";
import { getLocale } from "@/paraglide/runtime";

const REGION_NAMES = new Map<string, Intl.DisplayNames>();

/** Country name in the current UI language; one DisplayNames per locale. */
function countryLabel(code: string | null): string {
  if (!code) return "—";
  const locale = getLocale();
  let names = REGION_NAMES.get(locale);
  if (!names) {
    names = new Intl.DisplayNames([locale], { type: "region" });
    REGION_NAMES.set(locale, names);
  }
  try {
    return names.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

function relativeTime(d: Date | null): string {
  if (!d) return m.account_never_active();
  const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (days <= 0) return m.account_today();
  if (days === 1) return m.account_yesterday();
  if (days < 30) return m.account_days_ago({ count: days });
  if (days < 365) return m.account_months_ago({ count: Math.floor(days / 30) });
  return m.account_years_ago({ count: Math.floor(days / 365) });
}

const STATUS_META: Record<
  StudentStatus,
  { label: () => string; className: string }
> = {
  completed: {
    label: m.account_status_completed,
    className: "bg-[var(--stage-1)]/15 text-[var(--stage-1)]",
  },
  active: { label: m.account_in_progress, className: "bg-primary/10 text-primary" },
  attention: {
    label: m.account_status_attention,
    className: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  },
  new: { label: m.account_status_new, className: "bg-muted text-muted-foreground" },
};

type SortKey = "name" | "completion" | "stars" | "active";
type StatusFilter = "all" | StudentStatus;

const FILTERS: { key: StatusFilter; label: () => string }[] = [
  { key: "all", label: m.account_filter_all },
  { key: "active", label: m.account_in_progress },
  { key: "attention", label: m.account_status_attention },
  { key: "completed", label: m.account_status_completed },
  { key: "new", label: m.account_status_new },
];

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
      <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">
        {pct.toFixed(0)}%
      </span>
    </div>
  );
}

function SummaryStat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="min-w-0 px-4 py-3">
      <div className="truncate text-xs text-muted-foreground">{label}</div>
      <div
        className={`mt-1 font-display text-2xl font-bold leading-none tabular-nums ${tone ?? "text-foreground"}`}
      >
        {value}
      </div>
    </div>
  );
}

function StudentTable({ students }: { students: StudentRow[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "active",
    dir: "desc",
  });

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = students;
    if (filter !== "all") list = list.filter((s) => s.status === filter);
    if (q)
      list = list.filter(
        (s) =>
          s.displayName.toLowerCase().includes(q) ||
          s.username.toLowerCase().includes(q) ||
          countryLabel(s.country).toLowerCase().includes(q),
      );
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      switch (sort.key) {
        case "name":
          return dir * a.displayName.localeCompare(b.displayName, "vi");
        case "completion":
          return dir * (a.completionPct - b.completionPct);
        case "stars":
          return dir * (a.speakingStars - b.speakingStars);
        case "active":
          return dir * ((a.lastActive?.getTime() ?? 0) - (b.lastActive?.getTime() ?? 0));
      }
    });
  }, [students, query, filter, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" },
    );

  const SortHead = ({ label, k, className }: { label: string; k: SortKey; className?: string }) => (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => toggleSort(k)}
        className="inline-flex items-center gap-1 hover:text-foreground"
      >
        {label}
        {sort.key === k &&
          (sort.dir === "asc" ? (
            <Icon icon={roundArrowUpward} className="h-3 w-3" aria-hidden />
          ) : (
            <Icon icon={roundArrowDownward} className="h-3 w-3" aria-hidden />
          ))}
      </button>
    </TableHead>
  );

  return (
    <Card className="rounded-lg shadow-sm">
      <CardHeader className="gap-3 px-4 pb-3 pt-4">
        <div className="flex flex-col gap-0.5">
          <CardTitle className="font-display text-sm">{m.account_students_title()}</CardTitle>
          <CardDescription className="text-xs">{m.account_students_description()}</CardDescription>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-xs flex-1">
            <Icon
              icon={roundSearch}
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={m.account_students_search()}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={[
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  filter === f.key
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/70",
                ].join(" ")}
              >
                {f.label()}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="overflow-x-auto [&_td]:py-1.5 [&_th]:h-8">
          <Table>
            <TableHeader>
              <TableRow>
                <SortHead label={m.account_col_student()} k="name" />
                <TableHead>{m.account_col_country()}</TableHead>
                <SortHead label={m.account_col_progress()} k="completion" />
                <SortHead label={m.account_col_stars()} k="stars" className="text-right" />
                <SortHead label={m.account_col_active()} k="active" />
                <TableHead>{m.account_col_status()}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((s) => {
                const meta = STATUS_META[s.status];
                return (
                  <TableRow key={s.id}>
                    <TableCell>
                      <Link
                        to="/u/$username"
                        params={{ username: s.username }}
                        className="flex items-center gap-2.5 hover:underline"
                      >
                        <span className="grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-full bg-primary/10 text-sm">
                          {s.avatarUrl ? (
                            <img
                              src={s.avatarUrl}
                              alt=""
                              className="h-full w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : s.avatarEmoji ? (
                            s.avatarEmoji
                          ) : (
                            <span className="font-semibold text-primary">
                              {s.displayName[0]?.toUpperCase() ?? "?"}
                            </span>
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-semibold text-foreground">
                            {s.displayName}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {m.account_stages_progress({
                              completed: s.completedChang,
                              total: s.totalChang,
                            })}
                          </span>
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        {s.country && s.country.length === 2 && (
                          <FlagImg code={s.country} size={16} />
                        )}
                        {countryLabel(s.country)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <ProgressBar pct={s.completionPct} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-sm">
                      {s.speakingStars > 0 ? (
                        <span className="font-semibold text-foreground">⭐ {s.speakingStars}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {relativeTime(s.lastActive)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`${meta.className} hover:${meta.className} border-0`}
                      >
                        {meta.label()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    {m.account_no_matching_students()}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// Chặng that students reach but don't finish — the curriculum's sticking points.
function StuckPoints({ funnel }: { funnel: ChangFunnelRow[] }) {
  const hardest = useMemo(
    () =>
      funnel
        .filter((f) => f.reached >= 3) // ignore chặng too few students have seen to be meaningful
        .sort((a, b) => a.completionPct - b.completionPct || b.dropoff - a.dropoff)
        .slice(0, 8),
    [funnel],
  );

  if (hardest.length === 0) return null;

  return (
    <Card className="rounded-lg shadow-sm">
      <CardHeader className="px-4 pb-3 pt-4">
        <CardTitle className="font-display text-sm">{m.account_stuck_title()}</CardTitle>
        <CardDescription className="text-xs">{m.account_stuck_description()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 px-4 pb-4">
        {hardest.map((f) => (
          <div key={f.id} className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-foreground">{f.title}</div>
              {f.chudeTitle && (
                <div className="truncate text-xs text-muted-foreground">{f.chudeTitle}</div>
              )}
            </div>
            <div className="hidden w-40 sm:block">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-amber-500"
                  style={{ width: `${f.completionPct}%` }}
                />
              </div>
            </div>
            <div className="w-28 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
              <span className="font-semibold text-foreground">{f.completionPct.toFixed(0)}%</span>{" "}
              {m.account_completed_suffix()}
              <div className="text-xs">
                {m.account_unfinished({ dropoff: f.dropoff, reached: f.reached })}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </h2>
  );
}

export function StudentReport() {
  const { report, isReportLoading, reportError } = useStudentReport();

  if (reportError) {
    return (
      <section className="space-y-4">
        <SectionHeading>{m.account_report_title()}</SectionHeading>
        <p className="text-sm text-muted-foreground">{m.account_report_error()}</p>
      </section>
    );
  }

  if (isReportLoading || !report) {
    return (
      <section className="space-y-4">
        <SectionHeading>{m.account_report_title()}</SectionHeading>
        <p className="text-sm text-muted-foreground">{m.account_report_loading()}</p>
      </section>
    );
  }

  const { summary } = report;

  return (
    <section className="space-y-3">
      <SectionHeading>{m.account_report_title()}</SectionHeading>
      <Card className="rounded-lg py-0 shadow-sm">
        <div className="grid grid-cols-2 divide-y divide-border sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
          <SummaryStat
            label={m.account_summary_total()}
            value={summary.totalStudents.toLocaleString("en-US")}
          />
          <SummaryStat
            label={m.account_summary_active_week()}
            value={summary.activeWeek.toLocaleString("en-US")}
            tone="text-primary"
          />
          <SummaryStat
            label={m.account_status_attention()}
            value={summary.needAttention.toLocaleString("en-US")}
            tone="text-amber-600 dark:text-amber-400"
          />
          <SummaryStat
            label={m.account_summary_avg_progress()}
            value={`${summary.avgCompletion.toFixed(0)}%`}
          />
        </div>
      </Card>
      <div className="grid grid-cols-1 items-start gap-3 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <StudentTable students={report.students} />
        </div>
        <StuckPoints funnel={report.funnel} />
      </div>
    </section>
  );
}
