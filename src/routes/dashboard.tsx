import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { BarChart3, Minus, Plus, RotateCcw } from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/layout/Container";
import { useDashboardStats, type CountryCount } from "@/hooks/useDashboardStats";
import { StudentReport } from "@/components/dashboard/StudentReport";
import { ISO_ALPHA2_TO_NUMERIC } from "@/lib/iso3166";
import { FlagImg } from "@/components/FlagImg";

export const Route = createFileRoute("/dashboard")({
  // UX gate — sends non-staff back to the homepage. The real protection is the
  // staff-read RLS on the progress tables; this just avoids rendering an empty
  // dashboard for people who shouldn't be here.
  beforeLoad: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/" });
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "staff")
      .maybeSingle();
    if (!data) throw redirect({ to: "/" });
  },
  head: () => ({
    meta: [
      { title: "Báo cáo tác động — Trường Tiếng Việt Của Em" },
      {
        name: "description",
        content:
          "Báo cáo tác động xã hội của Trường Tiếng Việt Của Em: quy mô, tăng trưởng và phân bổ địa lý.",
      },
      { property: "og:title", content: "Báo cáo tác động — Trường Tiếng Việt Của Em" },
      {
        property: "og:description",
        content: "Quy mô, tăng trưởng và phân bổ địa lý của học sinh Trường Tiếng Việt Của Em.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:url", content: "/dashboard" },
    ],
    links: [{ rel: "canonical", href: "/dashboard" }],
  }),
  component: DashboardPage,
});

const REGION_NAMES = new Intl.DisplayNames(["vi"], { type: "region" });

function countryLabel(code: string): string {
  try {
    return REGION_NAMES.of(code) ?? code;
  } catch {
    return code;
  }
}

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const TOOLTIP_STYLE: React.CSSProperties = {
  borderRadius: "1rem",
  fontSize: "13px",
  border: "1px solid var(--color-ink-100)",
  background: "#fff",
  color: "var(--color-ink-800)",
  boxShadow: "0 4px 8px rgb(20 28 49 / 0.04), 0 22px 44px -14px rgb(20 28 49 / 0.2)",
};

function countryFill(count: number | undefined, maxCount: number): string {
  if (!count) return "var(--color-ink-100)";
  // sqrt scale so mid-sized counts stay visually distinct from the top country instead
  // of clustering near the low end.
  const intensity = 0.35 + 0.65 * Math.sqrt(count / maxCount);
  // One hue, light → dark: the brand blue mixed down toward white for small counts.
  return `color-mix(in oklab, var(--color-brand-600) ${(intensity * 100).toFixed(0)}%, white)`;
}

/** A single cell within a merged KPI row — label on top, big number, small delta/sub below. */
function KpiCell({
  title,
  value,
  sub,
  deltaTone,
}: {
  title: string;
  value: string;
  sub?: string;
  /** "up" renders sub in green (positive change), "down" in red — omit for a neutral/gray sub. */
  deltaTone?: "up" | "down";
}) {
  return (
    <div className="min-w-0 px-5 py-5">
      <div className="truncate text-sm font-medium text-ink-500">{title}</div>
      <div className="mt-2 text-h1 leading-none text-ink-900 tabular-nums">{value}</div>
      {sub && (
        <div
          className={`mt-2 truncate text-sm font-semibold ${
            deltaTone === "up"
              ? "text-leaf-700"
              : deltaTone === "down"
                ? "text-danger-700"
                : "text-ink-500"
          }`}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

/** Merges KPI cells into one bordered card with dividers between them, Sellforte-style. */
function KpiRow({ children }: { children: React.ReactNode }) {
  return (
    <Card className="py-0">
      <div className="grid grid-cols-2 divide-ink-100 sm:grid-cols-4 sm:divide-x max-sm:[&>*:nth-child(-n+2)]:border-b max-sm:[&>*:nth-child(odd)]:border-r">
        {children}
      </div>
    </Card>
  );
}

const DEFAULT_MAP_CENTER: [number, number] = [10, 10];
const MIN_MAP_ZOOM = 1;
const MAX_MAP_ZOOM = 8;

function MapView({ countryData, total }: { countryData: CountryCount[]; total: number }) {
  const [hovered, setHovered] = useState<CountryCount | null>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>(DEFAULT_MAP_CENTER);
  const maxCount = countryData[0]?.count ?? 1;
  const countByNumeric = useMemo(() => {
    const map = new Map<string, CountryCount>();
    for (const row of countryData) {
      const numeric = ISO_ALPHA2_TO_NUMERIC[row.code];
      if (numeric) map.set(numeric, row);
    }
    return map;
  }, [countryData]);

  return (
    <div className="space-y-2">
      <div
        className="relative"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setPointer({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
        onMouseLeave={() => {
          setHovered(null);
          setPointer(null);
        }}
      >
        {hovered && pointer && (
          <div
            className="pointer-events-none absolute z-10 flex -translate-x-1/2 -translate-y-full items-center gap-2 rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm font-medium text-ink-800 shadow-lg"
            style={{ left: pointer.x, top: pointer.y - 10 }}
          >
            <FlagImg code={hovered.code} size={18} />
            <span>{countryLabel(hovered.code)}</span>
            <span className="font-semibold text-ink-900 tabular-nums">
              {hovered.count.toLocaleString("en-US")} học sinh
            </span>
          </div>
        )}

        <ComposableMap
          width={800}
          height={300}
          projectionConfig={{ scale: 130, center: [10, 10] }}
          style={{ width: "100%", height: "auto" }}
        >
          <ZoomableGroup
            zoom={zoom}
            center={center}
            minZoom={MIN_MAP_ZOOM}
            maxZoom={MAX_MAP_ZOOM}
            translateExtent={[
              [-100, -100],
              [900, 520],
            ]}
            onMoveEnd={({ zoom: z, coordinates }) => {
              setZoom(z);
              setCenter(coordinates);
            }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const data = countByNumeric.get(geo.id);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={countryFill(data?.count, maxCount)}
                      stroke="#fff"
                      strokeWidth={0.5 / zoom}
                      style={{
                        default: { outline: "none" },
                        hover: {
                          outline: "none",
                          fill: data ? "var(--color-brand-800)" : "var(--color-ink-200)",
                          cursor: data ? "pointer" : "default",
                        },
                        pressed: { outline: "none" },
                      }}
                      onMouseEnter={() => data && setHovered(data)}
                      onMouseLeave={() => setHovered(null)}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        <div className="absolute right-2 top-2 flex flex-col gap-1">
          <button
            type="button"
            aria-label="Phóng to"
            onClick={() => setZoom((z) => Math.min(MAX_MAP_ZOOM, z * 1.5))}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-ink-100 bg-white text-ink-700 shadow-sm transition-colors hover:bg-ink-50"
          >
            <Plus className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Thu nhỏ"
            onClick={() => setZoom((z) => Math.max(MIN_MAP_ZOOM, z / 1.5))}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-ink-100 bg-white text-ink-700 shadow-sm transition-colors hover:bg-ink-50"
          >
            <Minus className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Đặt lại"
            onClick={() => {
              setZoom(1);
              setCenter(DEFAULT_MAP_CENTER);
            }}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-ink-100 bg-white text-ink-700 shadow-sm transition-colors hover:bg-ink-50"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-caption text-ink-500">
        <span>Ít hơn</span>
        <div className="flex gap-0.5">
          {[0.2, 0.4, 0.6, 0.8, 1.0].map((frac) => (
            <div
              key={frac}
              className="h-3 w-5 rounded-[3px]"
              style={{ background: countryFill(frac, 1) }}
            />
          ))}
        </div>
        <span>Nhiều hơn</span>
        <span className="ml-auto">Tổng: {total.toLocaleString("en-US")} học sinh</span>
      </div>
    </div>
  );
}

function TopCountries({ countryData, total }: { countryData: CountryCount[]; total: number }) {
  const top = countryData.slice(0, 8);
  const max = countryData[0]?.count ?? 1;
  return (
    <div className="space-y-2">
      {top.map((c) => (
        <div key={c.code} className="flex items-center gap-2.5">
          <FlagImg code={c.code} size={18} />
          <span className="w-24 shrink-0 truncate text-sm text-ink-800">
            {countryLabel(c.code)}
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-50">
            <div
              className="h-full rounded-full bg-brand-500"
              style={{ width: `${Math.max(4, (c.count / max) * 100)}%` }}
            />
          </div>
          <span className="w-16 shrink-0 text-right text-sm text-ink-700 tabular-nums">
            {c.count.toLocaleString("en-US")}
            <span className="ml-1 text-caption text-ink-400">
              {total > 0 ? `${((c.count / total) * 100).toFixed(0)}%` : ""}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

function DashboardPage() {
  const [growthView, setGrowthView] = useState<"monthly" | "weekly">("monthly");
  const { stats, isStatsLoading } = useDashboardStats();
  const growthData = stats
    ? growthView === "monthly"
      ? stats.monthlyGrowth
      : stats.weeklyGrowth
    : [];

  // Newest bucket's net additions — the cumulative series' last step.
  const recentAdds = stats
    ? (() => {
        const g = stats.monthlyGrowth;
        if (g.length === 0) return 0;
        if (g.length === 1) return g[0].students;
        return g[g.length - 1].students - g[g.length - 2].students;
      })()
    : 0;

  const completionData = stats
    ? [
        {
          name: "Đã hoàn thành",
          value: stats.completion.completed,
          color: "var(--color-leaf-500)",
        },
        { name: "Đang học", value: stats.completion.inProgress, color: "var(--color-brand-500)" },
        { name: "Mới bắt đầu", value: stats.completion.notStarted, color: "var(--color-ink-200)" },
      ]
    : [];

  return (
    <div className="flex-1 bg-ink-25">
      <PageHeader
        icon={BarChart3}
        hue="grape"
        title="Báo cáo tác động xã hội"
        lede="Trường Tiếng Việt Của Em · Dành cho Bộ Ngoại Giao & Ban Quản Lý"
      />

      <Container className="flex flex-col gap-5 pb-16">
        {isStatsLoading || !stats ? (
          <div className="flex flex-col gap-5" aria-busy="true" aria-label="Đang tải dữ liệu">
            <div className="h-28 animate-pulse rounded-2xl bg-ink-100" />
            <div className="grid gap-5 lg:grid-cols-3">
              <div className="h-64 animate-pulse rounded-2xl bg-ink-100 lg:col-span-2" />
              <div className="h-64 animate-pulse rounded-2xl bg-ink-100" />
            </div>
          </div>
        ) : (
          <>
            {/* KPI row — one merged card, columns divided by hairlines */}
            <KpiRow>
              <KpiCell
                title="Tài khoản"
                value={stats.totalRegistered.toLocaleString("en-US")}
                sub={recentAdds > 0 ? `+${recentAdds} kỳ gần nhất` : "đã đăng ký"}
                deltaTone={recentAdds > 0 ? "up" : undefined}
              />
              <KpiCell
                title="Hoàn thành"
                value={stats.completion.completed.toLocaleString("en-US")}
                sub={`${stats.completionRate.toFixed(1)}% tỷ lệ`}
              />
              <KpiCell
                title="Đang học"
                value={stats.completion.inProgress.toLocaleString("en-US")}
                sub="đang trong tiến trình"
              />
              <KpiCell
                title="Quốc gia"
                value={stats.countryData.length.toLocaleString("en-US")}
                sub="có học sinh"
              />
            </KpiRow>

            {/* Growth + completion bento */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-start justify-between gap-3 px-5 pt-5 pb-2">
                  <div>
                    <CardTitle className="text-base">Tốc độ tăng trưởng người dùng</CardTitle>
                    <CardDescription>Tổng học sinh tích lũy theo thời gian đăng ký</CardDescription>
                  </div>
                  <Tabs
                    value={growthView}
                    onValueChange={(v) => setGrowthView(v as "monthly" | "weekly")}
                  >
                    <TabsList className="h-9">
                      <TabsTrigger value="monthly" className="px-3 text-caption">
                        Tháng
                      </TabsTrigger>
                      <TabsTrigger value="weekly" className="px-3 text-caption">
                        Tuần
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={growthData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid
                        vertical={false}
                        stroke="var(--color-ink-100)"
                        strokeDasharray="3 3"
                      />
                      <XAxis
                        dataKey="period"
                        tick={{ fontSize: 12, fill: "var(--color-ink-500)" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: "var(--color-ink-500)" }}
                        axisLine={false}
                        tickLine={false}
                        width={45}
                      />
                      <Tooltip
                        formatter={(v: number) => [`${v.toLocaleString("en-US")} học sinh`, "Tổng"]}
                        contentStyle={TOOLTIP_STYLE}
                      />
                      <Line
                        type="monotone"
                        dataKey="students"
                        stroke="var(--color-brand-600)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{
                          r: 5,
                          fill: "var(--color-brand-600)",
                          stroke: "#fff",
                          strokeWidth: 2,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="px-5 pt-5 pb-2">
                  <CardTitle className="text-base">Tỷ lệ hoàn thành</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 px-5 pb-5">
                  <ResponsiveContainer width="100%" height={120}>
                    <PieChart>
                      <Pie
                        data={completionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={62}
                        paddingAngle={2}
                        stroke="#fff"
                        strokeWidth={2}
                        cornerRadius={4}
                        dataKey="value"
                      >
                        {completionData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v: number) => [`${v.toLocaleString("en-US")} học sinh`]}
                        contentStyle={TOOLTIP_STYLE}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {completionData.map((entry) => (
                    <div key={entry.name}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-ink-600">
                          <span
                            className="inline-block size-2.5 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          {entry.name}
                        </span>
                        <span className="font-semibold text-ink-900 tabular-nums">
                          {entry.value.toLocaleString("en-US")}
                        </span>
                      </div>
                      <Progress
                        value={(entry.value / (stats.totalRegistered || 1)) * 100}
                        className="h-1.5"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Map + top countries bento */}
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader className="px-5 pt-5 pb-2">
                  <CardTitle className="text-base">Học sinh theo quốc gia</CardTitle>
                  <CardDescription>
                    {stats.totalRegistered.toLocaleString("en-US")} học sinh tại{" "}
                    {stats.countryData.length} quốc gia
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <MapView countryData={stats.countryData} total={stats.totalRegistered} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="px-5 pt-5 pb-2">
                  <CardTitle className="text-base">Quốc gia dẫn đầu</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <TopCountries countryData={stats.countryData} total={stats.totalRegistered} />
                </CardContent>
              </Card>
            </div>

            <StudentReport />
          </>
        )}
      </Container>
    </div>
  );
}
