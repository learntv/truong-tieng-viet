import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Search, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

const REGION_NAMES = new Intl.DisplayNames(["vi"], { type: "region" });

function countryLabel(code: string | null): string {
  if (!code) return "—";
  try {
    return REGION_NAMES.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
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

const STATUS_META: Record<StudentStatus, { label: string; className: string }> = {
  completed: { label: "Hoàn thành", className: "bg-leaf-50 text-leaf-700" },
  active: { label: "Đang học", className: "bg-brand-50 text-brand-700" },
  attention: { label: "Cần hỗ trợ", className: "bg-sun-50 text-sun-700" },
  new: { label: "Mới", className: "bg-ink-50 text-ink-600" },
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
      <div className="h-2 w-24 overflow-hidden rounded-full bg-ink-50">
        <div
          className="h-full rounded-full bg-brand-500 transition-[width]"
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
      <span className="w-9 text-right text-sm text-ink-600 tabular-nums">{pct.toFixed(0)}%</span>
    </div>
  );
}

function SummaryStat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="min-w-0 px-5 py-5">
      <div className="truncate text-sm font-medium text-ink-500">{label}</div>
      <div className={`mt-2 text-h2 leading-none tabular-nums ${tone ?? "text-ink-900"}`}>
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
        className="inline-flex cursor-pointer items-center gap-1 hover:text-ink-900"
      >
        {label}
        {sort.key === k &&
          (sort.dir === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />)}
      </button>
    </TableHead>
  );

  return (
    <Card>
      <CardHeader className="gap-4 px-5 pt-5 pb-3">
        <div className="flex flex-col gap-0.5">
          <CardTitle className="text-base">Danh sách học sinh</CardTitle>
          <CardDescription>
            Nhấp tiêu đề cột để sắp xếp, lọc theo trạng thái để tìm em cần hỗ trợ.
          </CardDescription>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-xs flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo tên, quốc gia…"
              className="h-11 pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={[
                  "h-9 cursor-pointer rounded-full px-3.5 text-sm font-semibold transition-colors",
                  filter === f.key
                    ? "bg-ink-900 text-white"
                    : "bg-ink-50 text-ink-600 hover:bg-ink-100 hover:text-ink-900",
                ].join(" ")}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-3 sm:px-5 sm:pb-5">
        <div className="overflow-x-auto [&_td]:py-2.5">
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
                        className="group flex items-center gap-3"
                      >
                        <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-50 text-sm">
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
                            <span className="font-semibold text-brand-700">
                              {s.displayName[0]?.toUpperCase() ?? "?"}
                            </span>
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-semibold text-ink-900 group-hover:text-brand-700">
                            {s.displayName}
                          </span>
                          <span className="block truncate text-caption text-ink-500">
                            {s.completedChang}/{s.totalChang} chặng
                          </span>
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap text-ink-600">
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
                        <span className="inline-flex items-center gap-1 font-semibold text-ink-900">
                          <Star className="size-3.5 fill-sun-500 text-sun-500" aria-hidden />
                          {s.speakingStars}
                        </span>
                      ) : (
                        <span className="text-ink-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap text-ink-600">
                      {relativeTime(s.lastActive)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={meta.className}>
                        {meta.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm text-ink-500">
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
    <Card>
      <CardHeader className="px-5 pt-5 pb-3">
        <CardTitle className="text-base">Chặng học sinh dễ mắc kẹt</CardTitle>
        <CardDescription>
          Tỷ lệ hoàn thành thấp nhất trong số các chặng đã có nhiều em bắt đầu — nơi nên xem lại nội
          dung hoặc hỗ trợ thêm.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-5 pb-5">
        {hardest.map((f) => (
          <div key={f.id} className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-ink-900">{f.title}</div>
              {f.chudeTitle && (
                <div className="truncate text-caption text-ink-500">{f.chudeTitle}</div>
              )}
            </div>
            <div className="hidden w-40 sm:block">
              <div className="h-2 w-full overflow-hidden rounded-full bg-ink-50">
                <div
                  className="h-full rounded-full bg-sun-500"
                  style={{ width: `${f.completionPct}%` }}
                />
              </div>
            </div>
            <div className="w-28 shrink-0 text-right text-caption text-ink-500 tabular-nums">
              <span className="text-sm font-semibold text-ink-900">
                {f.completionPct.toFixed(0)}%
              </span>{" "}
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
  return <h2 className="mt-6 text-h2 text-ink-900">{children}</h2>;
}

export function StudentReport() {
  const { report, isReportLoading, reportError } = useStudentReport();

  if (reportError) {
    return (
      <section className="space-y-4">
        <SectionHeading>Báo Cáo Học Sinh</SectionHeading>
        <p className="rounded-2xl bg-danger-50 p-4 text-sm font-medium text-danger-700">
          Không tải được báo cáo học sinh. Vui lòng thử lại.
        </p>
      </section>
    );
  }

  if (isReportLoading || !report) {
    return (
      <section className="space-y-4">
        <SectionHeading>Báo Cáo Học Sinh</SectionHeading>
        <div
          className="h-64 animate-pulse rounded-2xl bg-ink-100"
          aria-label="Đang tải báo cáo học sinh"
        />
      </section>
    );
  }

  const { summary } = report;

  return (
    <section className="space-y-5">
      <SectionHeading>Báo Cáo Học Sinh</SectionHeading>
      <Card className="py-0">
        <div className="grid grid-cols-2 divide-ink-100 sm:grid-cols-4 sm:divide-x max-sm:[&>*:nth-child(-n+2)]:border-b max-sm:[&>*:nth-child(odd)]:border-r">
          <SummaryStat
            label="Tổng học sinh"
            value={summary.totalStudents.toLocaleString("en-US")}
          />
          <SummaryStat
            label="Hoạt động trong 7 ngày"
            value={summary.activeWeek.toLocaleString("en-US")}
            tone="text-brand-700"
          />
          <SummaryStat
            label="Cần hỗ trợ"
            value={summary.needAttention.toLocaleString("en-US")}
            tone="text-sun-700"
          />
          <SummaryStat
            label="Tiến độ TB (đã bắt đầu)"
            value={`${summary.avgCompletion.toFixed(0)}%`}
          />
        </div>
      </Card>
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <StudentTable students={report.students} />
        </div>
        <StuckPoints funnel={report.funnel} />
      </div>
    </section>
  );
}
