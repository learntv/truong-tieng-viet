import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Search } from "lucide-react";
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
import { useLocale, useT, type Locale, type Messages } from "@/i18n";

const REGION_NAMES: Record<Locale, Intl.DisplayNames> = {
  vi: new Intl.DisplayNames(["vi"], { type: "region" }),
  en: new Intl.DisplayNames(["en"], { type: "region" }),
};

function countryLabel(locale: Locale, code: string | null): string {
  if (!code) return "—";
  try {
    return REGION_NAMES[locale].of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

function relativeTime(t: Messages, d: Date | null): string {
  if (!d) return t.dashboard.neverActive;
  const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (days <= 0) return t.dashboard.today;
  if (days === 1) return t.dashboard.yesterday;
  if (days < 30) return t.dashboard.daysAgo(days);
  if (days < 365) return t.dashboard.monthsAgo(Math.floor(days / 30));
  return t.dashboard.yearsAgo(Math.floor(days / 365));
}

const STATUS_CLASS: Record<StudentStatus, string> = {
  completed: "bg-[var(--stage-1)]/15 text-[var(--stage-1)]",
  active: "bg-primary/10 text-primary",
  attention: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  new: "bg-muted text-muted-foreground",
};

type SortKey = "name" | "completion" | "stars" | "active";
type StatusFilter = "all" | StudentStatus;

const FILTERS: StatusFilter[] = ["all", "active", "attention", "completed", "new"];

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
  const t = useT();
  const { locale } = useLocale();
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
          countryLabel(locale, s.country).toLowerCase().includes(q),
      );
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      switch (sort.key) {
        case "name":
          // Names are Vietnamese whatever the interface language, so collate them as such.
          return dir * a.displayName.localeCompare(b.displayName, "vi");
        case "completion":
          return dir * (a.completionPct - b.completionPct);
        case "stars":
          return dir * (a.speakingStars - b.speakingStars);
        case "active":
          return dir * ((a.lastActive?.getTime() ?? 0) - (b.lastActive?.getTime() ?? 0));
      }
    });
  }, [students, query, filter, sort, locale]);

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
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          ))}
      </button>
    </TableHead>
  );

  return (
    <Card className="rounded-lg shadow-sm">
      <CardHeader className="gap-3 px-4 pb-3 pt-4">
        <div className="flex flex-col gap-0.5">
          <CardTitle className="font-display text-sm">{t.dashboard.studentList}</CardTitle>
          <CardDescription className="text-xs">{t.dashboard.studentListHint}</CardDescription>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-xs flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.dashboard.searchPlaceholder}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={[
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  filter === f
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/70",
                ].join(" ")}
              >
                {f === "all" ? t.dashboard.all : t.dashboard.status[f]}
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
                <SortHead label={t.dashboard.colStudent} k="name" />
                <TableHead>{t.dashboard.colCountry}</TableHead>
                <SortHead label={t.dashboard.colProgress} k="completion" />
                <SortHead label={t.dashboard.colStars} k="stars" className="text-right" />
                <SortHead label={t.dashboard.colActive} k="active" />
                <TableHead>{t.dashboard.colStatus}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((s) => {
                const statusClass = STATUS_CLASS[s.status];
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
                            {t.dashboard.stagesOf(s.completedChang, s.totalChang)}
                          </span>
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        {s.country && s.country.length === 2 && (
                          <FlagImg code={s.country} size={16} />
                        )}
                        {countryLabel(locale, s.country)}
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
                      {relativeTime(t, s.lastActive)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`${statusClass} hover:${statusClass} border-0`}
                      >
                        {t.dashboard.status[s.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    {t.dashboard.noMatches}
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
  const t = useT();
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
        <CardTitle className="font-display text-sm">{t.dashboard.stuckTitle}</CardTitle>
        <CardDescription className="text-xs">{t.dashboard.stuckHint}</CardDescription>
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
              {t.dashboard.completedWord}
              <div className="text-[11px]">{t.dashboard.unfinished(f.dropoff, f.reached)}</div>
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
  const t = useT();
  const { fmtNumber } = useLocale();
  const { report, isReportLoading, reportError } = useStudentReport();

  if (reportError) {
    return (
      <section className="space-y-4">
        <SectionHeading>{t.dashboard.reportTitle}</SectionHeading>
        <p className="text-sm text-muted-foreground">{t.dashboard.reportFailed}</p>
      </section>
    );
  }

  if (isReportLoading || !report) {
    return (
      <section className="space-y-4">
        <SectionHeading>{t.dashboard.reportTitle}</SectionHeading>
        <p className="text-sm text-muted-foreground">{t.dashboard.reportLoading}</p>
      </section>
    );
  }

  const { summary } = report;

  return (
    <section className="space-y-3">
      <SectionHeading>{t.dashboard.reportTitle}</SectionHeading>
      <Card className="rounded-lg py-0 shadow-sm">
        <div className="grid grid-cols-2 divide-y divide-border sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
          <SummaryStat label={t.dashboard.totalStudents} value={fmtNumber(summary.totalStudents)} />
          <SummaryStat
            label={t.dashboard.activeWeek}
            value={fmtNumber(summary.activeWeek)}
            tone="text-primary"
          />
          <SummaryStat
            label={t.dashboard.needAttention}
            value={fmtNumber(summary.needAttention)}
            tone="text-amber-600 dark:text-amber-400"
          />
          <SummaryStat
            label={t.dashboard.avgProgress}
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
