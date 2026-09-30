import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { Minus, Plus, RotateCcw } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { PageBanner } from "@/components/site/PageBanner";
import { useDashboardStats, type CountryCount } from "@/hooks/useDashboardStats";
import { StudentReport } from "@/components/dashboard/StudentReport";
import { ISO_ALPHA2_TO_NUMERIC } from "@/lib/iso3166";
import { FlagImg } from "@/components/FlagImg";
import { messagesFor, useLocale, useT, type Locale, type Messages } from "@/i18n";
import { pageTitle } from "@/i18n/head";

export const Route = createFileRoute("/dashboard")({
  // UX gate — sends non-staff back to the homepage. The real protection is the
  // staff-read RLS on the progress tables; this just avoids rendering an empty
  // dashboard for people who shouldn't be here.
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/" });
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "staff")
      .maybeSingle();
    if (!data) throw redirect({ to: "/" });
  },
  head: ({ match }) => {
    const { locale } = match.context;
    const m = messagesFor(locale).meta.dashboard;
    const title = pageTitle(locale, m.title);
    return {
      meta: [
        { title },
        { name: "description", content: m.description },
        { property: "og:title", content: title },
        { property: "og:description", content: m.ogDescription },
        { name: "robots", content: "noindex" },
        { property: "og:url", content: "/dashboard" },
      ],
      links: [{ rel: "canonical", href: "/dashboard" }],
    };
  },
  component: DashboardPage,
});

const REGION_NAMES: Record<Locale, Intl.DisplayNames> = {
  vi: new Intl.DisplayNames(["vi"], { type: "region" }),
  en: new Intl.DisplayNames(["en"], { type: "region" }),
};

function countryLabel(locale: Locale, code: string): string {
  try {
    return REGION_NAMES[locale].of(code) ?? code;
  } catch {
    return code;
  }
}

/** Monthly buckets arrive as "YYYY-MM"; weekly ones are a bare week number and pass through. */
function formatPeriod(t: Messages, period: string): string {
  const month = /^(\d{4})-(\d{2})$/.exec(period);
  return month ? t.dashboard.monthLabel(Number(month[2]), Number(month[1])) : period;
}

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const TOOLTIP_STYLE: React.CSSProperties = {
  borderRadius: "0.75rem",
  fontSize: "12px",
  border: "1px solid var(--border)",
  background: "var(--card)",
  color: "var(--foreground)",
  boxShadow: "0 8px 24px -12px oklch(0 0 0 / 0.2)",
};

function countryFill(count: number | undefined, maxCount: number): string {
  if (!count) return "color-mix(in oklab, var(--muted) 65%, var(--foreground))";
  // sqrt scale so mid-sized counts stay visually distinct from the top country instead
  // of clustering near the low end.
  const intensity = 0.35 + 0.65 * Math.sqrt(count / maxCount);
  return `color-mix(in oklab, var(--primary) ${(intensity * 100).toFixed(0)}%, var(--card))`;
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
    <div className="min-w-0 px-4 py-3">
      <div className="truncate text-xs text-muted-foreground">{title}</div>
      <div className="mt-1 font-display text-2xl font-bold leading-none tabular-nums text-foreground">
        {value}
      </div>
      {sub && (
        <div
          className={`mt-1.5 truncate text-xs font-semibold ${
            deltaTone === "up"
              ? "text-emerald-600 dark:text-emerald-400"
              : deltaTone === "down"
                ? "text-red-600 dark:text-red-400"
                : "text-muted-foreground"
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
    <Card className="rounded-lg py-0 shadow-sm">
      <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
        {children}
      </div>
    </Card>
  );
}

const DEFAULT_MAP_CENTER: [number, number] = [10, 10];
const MIN_MAP_ZOOM = 1;
const MAX_MAP_ZOOM = 8;

function MapView({ countryData, total }: { countryData: CountryCount[]; total: number }) {
  const t = useT();
  const { locale, fmtNumber } = useLocale();
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
            className="pointer-events-none absolute z-10 flex -translate-x-1/2 -translate-y-full items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground shadow-md"
            style={{ left: pointer.x, top: pointer.y - 10 }}
          >
            <FlagImg code={hovered.code} size={18} />
            <span>{countryLabel(locale, hovered.code)}</span>
            <span className="font-semibold text-primary">
              {t.dashboard.students(fmtNumber(hovered.count))}
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
                      stroke="var(--card)"
                      strokeWidth={0.5 / zoom}
                      style={{
                        default: { outline: "none" },
                        hover: {
                          outline: "none",
                          fill: data
                            ? "color-mix(in oklab, var(--primary) 85%, var(--foreground))"
                            : "color-mix(in oklab, var(--muted) 55%, var(--foreground))",
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
            aria-label={t.dashboard.zoomIn}
            onClick={() => setZoom((z) => Math.min(MAX_MAP_ZOOM, z * 1.5))}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card text-foreground shadow-sm hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label={t.dashboard.zoomOut}
            onClick={() => setZoom((z) => Math.max(MIN_MAP_ZOOM, z / 1.5))}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card text-foreground shadow-sm hover:bg-muted"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label={t.dashboard.resetView}
            onClick={() => {
              setZoom(1);
              setCenter(DEFAULT_MAP_CENTER);
            }}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card text-foreground shadow-sm hover:bg-muted"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{t.dashboard.less}</span>
        <div className="flex gap-0.5">
          {[0.2, 0.4, 0.6, 0.8, 1.0].map((frac) => (
            <div
              key={frac}
              className="h-3 w-5 rounded-sm border border-border/50"
              style={{ background: countryFill(frac, 1) }}
            />
          ))}
        </div>
        <span>{t.dashboard.more}</span>
        <span className="ml-auto">{t.dashboard.total(fmtNumber(total))}</span>
      </div>
    </div>
  );
}

function TopCountries({ countryData, total }: { countryData: CountryCount[]; total: number }) {
  const { locale, fmtNumber } = useLocale();
  const top = countryData.slice(0, 8);
  const max = countryData[0]?.count ?? 1;
  return (
    <div className="space-y-2">
      {top.map((c) => (
        <div key={c.code} className="flex items-center gap-2">
          <FlagImg code={c.code} size={18} />
          <span className="w-24 shrink-0 truncate text-xs text-foreground">
            {countryLabel(locale, c.code)}
          </span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-sm bg-muted">
            <div
              className="h-full rounded-sm bg-primary"
              style={{ width: `${Math.max(4, (c.count / max) * 100)}%` }}
            />
          </div>
          <span className="w-14 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
            {fmtNumber(c.count)}
            <span className="ml-1 text-[10px]">
              {total > 0 ? `${((c.count / total) * 100).toFixed(0)}%` : ""}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

function DashboardPage() {
  const t = useT();
  const { fmtNumber } = useLocale();
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
        { name: t.dashboard.completed, value: stats.completion.completed, color: "var(--stage-1)" },
        {
          name: t.dashboard.inProgress,
          value: stats.completion.inProgress,
          color: "var(--stage-2)",
        },
        {
          name: t.dashboard.justStarted,
          value: stats.completion.notStarted,
          color: "var(--muted)",
        },
      ]
    : [];

  return (
    <main className="bg-muted/40">
      <PageBanner title={t.dashboard.title} />

      <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 sm:px-6">
        {isStatsLoading || !stats ? (
          <p className="text-center text-sm text-muted-foreground">{t.dashboard.loading}</p>
        ) : (
          <>
            {/* KPI row — one merged card, columns divided by hairlines */}
            <KpiRow>
              <KpiCell
                title={t.dashboard.accounts}
                value={fmtNumber(stats.totalRegistered)}
                sub={recentAdds > 0 ? t.dashboard.recentAdds(recentAdds) : t.dashboard.registered}
                deltaTone={recentAdds > 0 ? "up" : undefined}
              />
              <KpiCell
                title={t.dashboard.completedKpi}
                value={fmtNumber(stats.completion.completed)}
                sub={t.dashboard.rate(
                  fmtNumber(stats.completionRate, {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  }),
                )}
              />
              <KpiCell
                title={t.dashboard.inProgress}
                value={fmtNumber(stats.completion.inProgress)}
                sub={t.dashboard.inProgressSub}
              />
              <KpiCell
                title={t.dashboard.countries}
                value={fmtNumber(stats.countryData.length)}
                sub={t.dashboard.withStudents}
              />
            </KpiRow>

            {/* Growth + completion bento */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Card className="rounded-lg shadow-sm lg:col-span-2">
                <CardHeader className="flex flex-row items-start justify-between gap-3 px-4 pb-2 pt-4">
                  <div>
                    <CardTitle className="font-display text-sm">
                      {t.dashboard.growthTitle}
                    </CardTitle>
                    <CardDescription className="text-xs">{t.dashboard.growthSub}</CardDescription>
                  </div>
                  <Tabs
                    value={growthView}
                    onValueChange={(v) => setGrowthView(v as "monthly" | "weekly")}
                  >
                    <TabsList className="h-8">
                      <TabsTrigger value="monthly" className="px-3 text-xs">
                        {t.dashboard.monthly}
                      </TabsTrigger>
                      <TabsTrigger value="weekly" className="px-3 text-xs">
                        {t.dashboard.weekly}
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={growthData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid
                        vertical={false}
                        stroke="var(--border)"
                        strokeDasharray="3 3"
                      />
                      <XAxis
                        dataKey="period"
                        tickFormatter={(p: string) => formatPeriod(t, p)}
                        tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                        axisLine={false}
                        tickLine={false}
                        width={45}
                      />
                      <Tooltip
                        formatter={(v: number) => [
                          t.dashboard.students(fmtNumber(v)),
                          t.dashboard.totalShort,
                        ]}
                        labelFormatter={(p: string) => formatPeriod(t, p)}
                        contentStyle={TOOLTIP_STYLE}
                      />
                      <Line
                        type="monotone"
                        dataKey="students"
                        stroke="var(--primary)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: "var(--primary)" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="rounded-lg shadow-sm">
                <CardHeader className="px-4 pb-2 pt-4">
                  <CardTitle className="font-display text-sm">
                    {t.dashboard.completionTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 px-4 pb-4">
                  <ResponsiveContainer width="100%" height={120}>
                    <PieChart>
                      <Pie
                        data={completionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={62}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {completionData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v: number) => [t.dashboard.students(fmtNumber(v))]}
                        contentStyle={TOOLTIP_STYLE}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {completionData.map((entry) => (
                    <div key={entry.name}>
                      <div className="mb-0.5 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <span
                            className="inline-block h-2 w-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          {entry.name}
                        </span>
                        <span className="font-semibold tabular-nums text-foreground">
                          {fmtNumber(entry.value)}
                        </span>
                      </div>
                      <Progress
                        value={(entry.value / (stats.totalRegistered || 1)) * 100}
                        className="h-1"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Map + top countries bento */}
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
              <Card className="rounded-lg shadow-sm lg:col-span-2">
                <CardHeader className="px-4 pb-2 pt-4">
                  <CardTitle className="font-display text-sm">
                    {t.dashboard.byCountryTitle}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {t.dashboard.byCountrySub(
                      fmtNumber(stats.totalRegistered),
                      stats.countryData.length,
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <MapView countryData={stats.countryData} total={stats.totalRegistered} />
                </CardContent>
              </Card>

              <Card className="rounded-lg shadow-sm">
                <CardHeader className="px-4 pb-2 pt-4">
                  <CardTitle className="font-display text-sm">{t.dashboard.topCountries}</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <TopCountries
                    countryData={stats.countryData}
                    total={stats.totalRegistered}
                  />
                </CardContent>
              </Card>
            </div>

            <StudentReport />
          </>
        )}
      </div>
    </main>
  );
}
