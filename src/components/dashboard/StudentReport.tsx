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

const REGION_NAMES = new Intl.DisplayNames(["vi"], { type: "region" });

function countryLabel(code: string | null): string {
  if (!code) return "—";
  try {
    return REGION_NAMES.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

function countryFlag(code: string | null): string {
  if (!code || code.length !== 2) return "🌍";
  const cp = [...code.toUpperCase()].map((c) => 0x1f1e6 + (c.charCodeAt(0) - 65));
  return String.fromCodePoint(...cp);
}

function relativeTime(d: Date | null): string {
  if (!d) return "Chưa hoạt động";
  const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (days <= 0) return "Hôm nay";
  if (days === 1) return "Hôm qua";
  if (days < 30) return `${days} ngày trước`;
  if (days < 365) return `${Math.floor(days / 30)} tháng trước`;
  return `${Math.floor(days / 365)} năm trước`;
}

const STATUS_META: Record<
  StudentStatus,
  { label: string; className: string }
> = {
  completed: { label: "Hoàn thành", className: "bg-[var(--stage-1)]/15 text-[var(--stage-1)]" },
  active: { label: "Đang học", className: "bg-primary/10 text-primary" },
  attention: { label: "Cần hỗ trợ", className: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  new: { label: "Mới", className: "bg-muted text-muted-foreground" },
};

type SortKey = "name" | "completion" | "stars" | "active";
type StatusFilter = "all" | StudentStatus;

const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "active", label: "Đang học" },
  { key: "attention", label: "Cần hỗ trợ" },
  { key: "completed", label: "Hoàn thành" },
  { key: "new", label: "Mới" },
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
          <CardTitle className="font-display text-sm">Danh sách học sinh</CardTitle>
          <CardDescription className="text-xs">
            Nhấp tiêu đề cột để sắp xếp, lọc theo trạng thái để tìm em cần hỗ trợ.
          </CardDescription>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-xs flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo tên, quốc gia…"
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
                  "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                  filter === f.key
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/70",
                ].join(" ")}
              >
                {f.label}
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
                <SortHead label="Học sinh" k="name" />
                <TableHead>Quốc gia</TableHead>
                <SortHead label="Tiến độ" k="completion" />
                <SortHead label="Sao nói" k="stars" className="text-right" />
                <SortHead label="Hoạt động" k="active" />
                <TableHead>Trạng thái</TableHead>
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
                            <span className="font-bold text-primary">
                              {s.displayName[0]?.toUpperCase() ?? "?"}
                            </span>
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-foreground">
                            {s.displayName}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {s.completedChang}/{s.totalChang} chặng
                          </span>
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      <span className="mr-1.5">{countryFlag(s.country)}</span>
                      {countryLabel(s.country)}
                    </TableCell>
                    <TableCell>
                      <ProgressBar pct={s.completionPct} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-sm">
                      {s.speakingStars > 0 ? (
                        <span className="font-medium text-foreground">⭐ {s.speakingStars}</span>
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
                        {meta.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    Không có học sinh nào khớp bộ lọc.
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
        <CardTitle className="font-display text-sm">Chặng học sinh dễ mắc kẹt</CardTitle>
        <CardDescription className="text-xs">
          Tỷ lệ hoàn thành thấp nhất trong số các chặng đã có nhiều em bắt đầu — nơi nên xem lại nội
          dung hoặc hỗ trợ thêm.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 px-4 pb-4">
        {hardest.map((f) => (
          <div key={f.id} className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-foreground">{f.title}</div>
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
              hoàn thành
              <div className="text-[11px]">
                {f.dropoff} / {f.reached} còn dở
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
        <SectionHeading>Báo Cáo Học Sinh</SectionHeading>
        <p className="text-sm text-muted-foreground">
          Không tải được báo cáo học sinh. Vui lòng thử lại.
        </p>
      </section>
    );
  }

  if (isReportLoading || !report) {
    return (
      <section className="space-y-4">
        <SectionHeading>Báo Cáo Học Sinh</SectionHeading>
        <p className="text-sm text-muted-foreground">Đang tải báo cáo học sinh…</p>
      </section>
    );
  }

  const { summary } = report;

  return (
    <section className="space-y-3">
      <SectionHeading>Báo Cáo Học Sinh</SectionHeading>
      <Card className="rounded-lg py-0 shadow-sm">
        <div className="grid grid-cols-2 divide-y divide-border sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
          <SummaryStat label="Tổng học sinh" value={summary.totalStudents.toLocaleString("en-US")} />
          <SummaryStat
            label="Hoạt động trong 7 ngày"
            value={summary.activeWeek.toLocaleString("en-US")}
            tone="text-primary"
          />
          <SummaryStat
            label="Cần hỗ trợ"
            value={summary.needAttention.toLocaleString("en-US")}
            tone="text-amber-600 dark:text-amber-400"
          />
          <SummaryStat
            label="Tiến độ TB (đã bắt đầu)"
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
