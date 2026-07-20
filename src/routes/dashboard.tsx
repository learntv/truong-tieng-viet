import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { PageBanner } from "@/components/site/PageBanner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Báo cáo tác động — Trường Tiếng Việt Của Em" },
      {
        name: "description",
        content:
          "Báo cáo tác động xã hội của Trường Tiếng Việt Của Em: quy mô, tăng trưởng, phân bổ địa lý và tiến độ học tập.",
      },
    ],
  }),
  component: DashboardPage,
});

const COUNTRY_DATA = [
  { country: "Canada", flag: "🇨🇦", students: 450, isoNum: "124" },
  { country: "Úc (Australia)", flag: "🇦🇺", students: 300, isoNum: "036" },
  { country: "Mỹ (USA)", flag: "🇺🇸", students: 280, isoNum: "840" },
  { country: "Pháp (France)", flag: "🇫🇷", students: 210, isoNum: "250" },
  { country: "Đức (Germany)", flag: "🇩🇪", students: 185, isoNum: "276" },
  { country: "Nhật (Japan)", flag: "🇯🇵", students: 120, isoNum: "392" },
  { country: "Anh (UK)", flag: "🇬🇧", students: 98, isoNum: "826" },
  { country: "Hàn Quốc", flag: "🇰🇷", students: 75, isoNum: "410" },
  { country: "Đài Loan", flag: "🇹🇼", students: 60, isoNum: "158" },
  { country: "Khác", flag: "🌍", students: 69, isoNum: "" },
];

const COUNTRY_BY_ISO: Record<string, (typeof COUNTRY_DATA)[number]> = Object.fromEntries(
  COUNTRY_DATA.filter((c) => c.isoNum).map((c) => [c.isoNum, c]),
);

const TOTAL_STUDENTS = COUNTRY_DATA.reduce((s, c) => s + c.students, 0);
const MAX_STUDENTS = COUNTRY_DATA[0].students;

const MONTHLY_GROWTH = [
  { period: "T7/2025", students: 210 },
  { period: "T8/2025", students: 268 },
  { period: "T9/2025", students: 320 },
  { period: "T10/2025", students: 395 },
  { period: "T11/2025", students: 470 },
  { period: "T12/2025", students: 580 },
  { period: "T1/2026", students: 720 },
  { period: "T2/2026", students: 890 },
  { period: "T3/2026", students: 1050 },
  { period: "T4/2026", students: 1280 },
  { period: "T5/2026", students: 1550 },
  { period: "T6/2026", students: 1847 },
];

const WEEKLY_GROWTH = [
  { period: "T1", students: 1420 },
  { period: "T2", students: 1510 },
  { period: "T3", students: 1620 },
  { period: "T4", students: 1700 },
  { period: "T5", students: 1750 },
  { period: "T6", students: 1810 },
  { period: "T7", students: 1847 },
];

const COMPLETION_DATA = [
  { name: "Đã hoàn thành", value: 312, color: "var(--stage-1)" },
  { name: "Đang học", value: 980, color: "var(--stage-2)" },
  { name: "Mới bắt đầu", value: 555, color: "var(--muted)" },
];

const TOPIC_COMPLETION = [
  { label: "Gia đình", emoji: "👨‍👩‍👧", completed: 312 },
  { label: "Con vật", emoji: "🐰", completed: 287 },
  { label: "Cây cối", emoji: "🌳", completed: 261 },
  { label: "Nhà ở", emoji: "🏡", completed: 234 },
  { label: "Thời tiết", emoji: "🌤️", completed: 198 },
  { label: "Đi chơi", emoji: "🎈", completed: 165 },
  { label: "Trường học", emoji: "🏫", completed: 124 },
  { label: "Văn hóa Việt", emoji: "🏯", completed: 89 },
];

const STATS = {
  totalHours: 5847,
  totalSessions: 28340,
  avgHoursPerStudent: 3.2,
  completedAll8Topics: 312,
  certificatesIssued: 289,
  completionRate: 16.9,
};

const SCALE_STATS = {
  totalRegistered: 1847,
  dau: 284,
  mau: 1320,
  dauGrowth: "+8% vs tuần trước",
  mauGrowth: "+15% vs tháng trước",
  retentionWeek1: 78,
  retentionMonth1: 52,
};

const REPORT_UPDATED_AT = "24/06/2026";

const RETENTION_CURVE = [
  { label: "Ngày 1", rate: 100 },
  { label: "Tuần 1", rate: 78 },
  { label: "Tuần 2", rate: 68 },
  { label: "Tuần 3", rate: 59 },
  { label: "Tháng 1", rate: 52 },
  { label: "Tháng 2", rate: 44 },
  { label: "Tháng 3", rate: 38 },
];

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const TOOLTIP_STYLE: React.CSSProperties = {
  borderRadius: "0.75rem",
  fontSize: "12px",
  border: "1px solid var(--border)",
  background: "var(--card)",
  color: "var(--foreground)",
  boxShadow: "0 8px 24px -12px oklch(0 0 0 / 0.2)",
};

function countryFill(isoId: string): string {
  const c = COUNTRY_BY_ISO[isoId];
  if (!c) return "color-mix(in oklab, var(--muted) 80%, transparent)";
  const intensity = 0.2 + 0.8 * (c.students / MAX_STUDENTS);
  return `color-mix(in oklab, var(--primary) ${(intensity * 100).toFixed(0)}%, transparent)`;
}

function StatCard({
  title,
  value,
  sub,
  badge,
}: {
  title: string;
  value: string;
  sub?: string;
  badge?: string;
}) {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="font-display text-3xl font-extrabold text-foreground">{value}</div>
        {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
        {badge && (
          <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary hover:bg-primary/10">
            {badge}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}

function BarsView() {
  return (
    <div className="space-y-3">
      {COUNTRY_DATA.map((row) => {
        const pct = ((row.students / TOTAL_STUDENTS) * 100).toFixed(1);
        return (
          <div key={row.country} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium text-foreground">
                <span className="text-lg">{row.flag}</span>
                {row.country}
              </span>
              <span className="flex items-center gap-2 tabular-nums text-muted-foreground">
                <span className="text-xs font-semibold">{pct}%</span>
                {row.students.toLocaleString("en-US")} trẻ
              </span>
            </div>
            <Progress value={(row.students / MAX_STUDENTS) * 100} className="h-2" />
          </div>
        );
      })}
      <Separator className="my-2" />
      <p className="text-right text-xs text-muted-foreground">
        Tổng: {TOTAL_STUDENTS.toLocaleString("en-US")} học sinh tại {COUNTRY_DATA.length} quốc gia
      </p>
    </div>
  );
}

function MapView() {
  const [hovered, setHovered] = useState<(typeof COUNTRY_DATA)[0] | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex h-8 items-center">
        {hovered ? (
          <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-1 text-sm font-medium text-foreground">
            <span className="text-base">{hovered.flag}</span>
            <span>{hovered.country}</span>
            <span className="font-bold text-primary">
              {hovered.students.toLocaleString("en-US")} trẻ
            </span>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Di chuột vào quốc gia để xem chi tiết</p>
        )}
      </div>

      <ComposableMap
        projectionConfig={{ scale: 140, center: [10, 10] }}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const data = COUNTRY_BY_ISO[geo.id];
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={countryFill(geo.id)}
                  stroke="var(--card)"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: {
                      outline: "none",
                      fill: data ? "var(--primary)" : "var(--muted)",
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
      </ComposableMap>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Ít hơn</span>
        <div className="flex gap-0.5">
          {[0.2, 0.4, 0.6, 0.8, 1.0].map((op) => (
            <div
              key={op}
              className="h-3 w-5 rounded-sm"
              style={{
                background: `color-mix(in oklab, var(--primary) ${op * 100}%, transparent)`,
              }}
            />
          ))}
        </div>
        <span>Nhiều hơn</span>
        <span className="ml-auto">Tổng: {TOTAL_STUDENTS.toLocaleString("en-US")} học sinh</span>
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </h2>
  );
}

function DashboardPage() {
  const [growthView, setGrowthView] = useState<"monthly" | "weekly">("monthly");
  const [countryView, setCountryView] = useState<"bars" | "map">("bars");
  const growthData = growthView === "monthly" ? MONTHLY_GROWTH : WEEKLY_GROWTH;

  return (
    <main>
      <PageBanner
        title="Báo cáo tác động xã hội"
        subtitle={`Trường Tiếng Việt Của Em · Dành cho Bộ Ngoại Giao & Ban Quản Lý · Cập nhật ${REPORT_UPDATED_AT}`}
      />

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 sm:py-14">
        <section className="space-y-4">
          <SectionHeading>Tổng Quan</SectionHeading>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            <StatCard
              title="Tài khoản"
              value={SCALE_STATS.totalRegistered.toLocaleString("en-US")}
              sub="đã đăng ký"
              badge="↑ 24%"
            />
            <StatCard
              title="Người dùng / ngày"
              value={SCALE_STATS.dau.toLocaleString("en-US")}
              sub="hoạt động hôm nay"
              badge={SCALE_STATS.dauGrowth}
            />
            <StatCard
              title="Người dùng / tháng"
              value={SCALE_STATS.mau.toLocaleString("en-US")}
              sub="hoạt động tháng này"
              badge={SCALE_STATS.mauGrowth}
            />
            <StatCard
              title="Giờ học"
              value={STATS.totalHours.toLocaleString("en-US")}
              sub={`${STATS.totalSessions.toLocaleString("en-US")} phiên`}
            />
            <StatCard
              title="Chứng chỉ"
              value={STATS.certificatesIssued.toLocaleString("en-US")}
              sub="đã cấp"
              badge={`${STATS.completionRate}% tỷ lệ`}
            />
            <StatCard
              title="TB / học sinh"
              value={`${STATS.avgHoursPerStudent}h`}
              sub="giờ học trung bình"
            />
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeading>Tăng Trưởng &amp; Giữ Chân</SectionHeading>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="shadow-card lg:col-span-2">
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div>
                  <CardTitle className="font-display">Tốc độ tăng trưởng người dùng</CardTitle>
                  <CardDescription>Tổng học sinh tích lũy theo thời gian</CardDescription>
                </div>
                <Tabs
                  value={growthView}
                  onValueChange={(v) => setGrowthView(v as "monthly" | "weekly")}
                >
                  <TabsList className="h-8">
                    <TabsTrigger value="monthly" className="px-3 text-xs">
                      Tháng
                    </TabsTrigger>
                    <TabsTrigger value="weekly" className="px-3 text-xs">
                      Tuần
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={growthData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradStudents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="period"
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
                      formatter={(v: number) => [`${v.toLocaleString("en-US")} học sinh`, "Tổng"]}
                      contentStyle={TOOLTIP_STYLE}
                    />
                    <Area
                      type="monotone"
                      dataKey="students"
                      stroke="var(--primary)"
                      strokeWidth={2.5}
                      fill="url(#gradStudents)"
                      dot={false}
                      activeDot={{ r: 5, fill: "var(--primary)" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="flex flex-col shadow-card">
              <CardHeader>
                <CardTitle className="font-display">Tỷ lệ giữ chân</CardTitle>
                <CardDescription>% học sinh quay lại sau đăng ký</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-primary/10 p-3 text-center">
                    <div className="font-display text-2xl font-bold text-primary">
                      {SCALE_STATS.retentionWeek1}%
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">Sau tuần đầu</div>
                  </div>
                  <div className="rounded-lg bg-primary/5 p-3 text-center">
                    <div className="font-display text-2xl font-bold text-primary/70">
                      {SCALE_STATS.retentionMonth1}%
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">Sau tháng đầu</div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={140}>
                  <LineChart
                    data={RETENTION_CURVE}
                    margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                      width={30}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip
                      formatter={(v: number) => [`${v}%`, "Giữ chân"]}
                      contentStyle={TOOLTIP_STYLE}
                    />
                    <ReferenceLine
                      y={SCALE_STATS.retentionWeek1}
                      stroke="var(--stage-3)"
                      strokeDasharray="3 3"
                    />
                    <ReferenceLine
                      y={SCALE_STATS.retentionMonth1}
                      stroke="var(--stage-3-soft)"
                      strokeDasharray="3 3"
                    />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      stroke="var(--stage-3)"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "var(--stage-3)", strokeWidth: 0 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeading>Phân Bổ Địa Lý &amp; Tiến Độ Học Tập</SectionHeading>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="shadow-card lg:col-span-2">
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div>
                  <CardTitle className="font-display">Học sinh theo quốc gia</CardTitle>
                  <CardDescription>
                    {TOTAL_STUDENTS.toLocaleString("en-US")} học sinh tại {COUNTRY_DATA.length} quốc
                    gia
                  </CardDescription>
                </div>
                <Tabs
                  value={countryView}
                  onValueChange={(v) => setCountryView(v as "bars" | "map")}
                >
                  <TabsList className="h-8">
                    <TabsTrigger value="bars" className="px-3 text-xs">
                      Biểu đồ
                    </TabsTrigger>
                    <TabsTrigger value="map" className="px-3 text-xs">
                      Bản đồ
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>{countryView === "bars" ? <BarsView /> : <MapView />}</CardContent>
            </Card>

            <div className="flex flex-col gap-6">
              <Card className="flex-1 shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="font-display">Tỷ lệ hoàn thành</CardTitle>
                  <CardDescription>Tiến độ qua 8 chủ đề địa danh</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={COMPLETION_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={72}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {COMPLETION_DATA.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v: number) => [`${v.toLocaleString("en-US")} học sinh`]}
                        contentStyle={TOOLTIP_STYLE}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {COMPLETION_DATA.map((entry) => (
                    <div key={entry.name}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <span
                            className="inline-block h-2 w-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          {entry.name}
                        </span>
                        <span className="font-semibold tabular-nums text-foreground">
                          {entry.value.toLocaleString("en-US")}
                        </span>
                      </div>
                      <Progress value={(entry.value / TOTAL_STUDENTS) * 100} className="h-1" />
                    </div>
                  ))}
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Chứng chỉ đã cấp</span>
                    <span className="font-bold text-primary">{STATS.certificatesIssued}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="flex-1 shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="font-display">Hoàn thành theo chủ đề</CardTitle>
                  <CardDescription>Số học sinh hoàn thành từng chủ đề</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart
                      data={TOPIC_COMPLETION}
                      margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                      barSize={14}
                    >
                      <XAxis
                        dataKey="emoji"
                        tick={{ fontSize: 13 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        formatter={(v: number) => [`${v} học sinh`, "Hoàn thành"]}
                        labelFormatter={(label: string) => {
                          const t = TOPIC_COMPLETION.find((x) => x.emoji === label);
                          return t ? t.label : label;
                        }}
                        contentStyle={TOOLTIP_STYLE}
                      />
                      <Bar dataKey="completed" radius={[3, 3, 0, 0]}>
                        {TOPIC_COMPLETION.map((entry, i) => (
                          <Cell
                            key={entry.label}
                            fill={`color-mix(in oklab, var(--primary) ${40 + 7.5 * (TOPIC_COMPLETION.length - 1 - i)}%, transparent)`}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <p className="pb-4 text-center text-xs text-muted-foreground">
          Dữ liệu mẫu · Trường Tiếng Việt Của Em
        </p>
      </div>
    </main>
  );
}
