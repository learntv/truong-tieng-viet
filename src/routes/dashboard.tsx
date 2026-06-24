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

export const Route = createFileRoute("/dashboard")({
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
  { name: "Đã hoàn thành", value: 312, color: "#10b981" },
  { name: "Đang học", value: 980, color: "#f59e0b" },
  { name: "Mới bắt đầu", value: 555, color: "#e5e7eb" },
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

function countryFill(isoId: string): string {
  const c = COUNTRY_BY_ISO[isoId];
  if (!c) return "#e2e8f0";
  const intensity = 0.2 + 0.8 * (c.students / MAX_STUDENTS);
  return `rgba(220, 38, 38, ${intensity.toFixed(2)})`;
}

function StatCard({ title, value, sub, badge }: { title: string; value: string; sub?: string; badge?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription className="text-xs font-medium uppercase tracking-wider">{title}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {sub && <p className="mt-1 text-sm text-gray-500">{sub}</p>}
        {badge && <Badge variant="secondary" className="mt-2">{badge}</Badge>}
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
              <span className="flex items-center gap-2 font-medium text-gray-700">
                <span className="text-lg">{row.flag}</span>
                {row.country}
              </span>
              <span className="flex items-center gap-2 tabular-nums text-gray-500">
                <span className="text-xs font-semibold text-gray-400">{pct}%</span>
                {row.students.toLocaleString()} trẻ
              </span>
            </div>
            <Progress value={(row.students / MAX_STUDENTS) * 100} className="h-2" />
          </div>
        );
      })}
      <Separator className="my-2" />
      <p className="text-xs text-gray-400 text-right">
        Tổng: {TOTAL_STUDENTS.toLocaleString()} học sinh tại {COUNTRY_DATA.length} quốc gia
      </p>
    </div>
  );
}

function MapView() {
  const [hovered, setHovered] = useState<(typeof COUNTRY_DATA)[0] | null>(null);

  return (
    <div className="space-y-3">
      <div className="h-8 flex items-center">
        {hovered ? (
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md px-3 py-1">
            <span className="text-base">{hovered.flag}</span>
            <span>{hovered.country}</span>
            <span className="text-red-600 font-bold">{hovered.students.toLocaleString()} trẻ</span>
          </div>
        ) : (
          <p className="text-xs text-gray-400">Di chuột vào quốc gia để xem chi tiết</p>
        )}
      </div>

      <ComposableMap projectionConfig={{ scale: 140, center: [10, 10] }} style={{ width: "100%", height: "auto" }}>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const data = COUNTRY_BY_ISO[geo.id];
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={countryFill(geo.id)}
                  stroke="#fff"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: data ? "#b91c1c" : "#cbd5e1", cursor: data ? "pointer" : "default" },
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

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>Ít hơn</span>
        <div className="flex gap-0.5">
          {[0.2, 0.4, 0.6, 0.8, 1.0].map((op) => (
            <div key={op} className="w-5 h-3 rounded-sm" style={{ backgroundColor: `rgba(220, 38, 38, ${op})` }} />
          ))}
        </div>
        <span>Nhiều hơn</span>
        <span className="ml-auto text-gray-400">Tổng: {TOTAL_STUDENTS.toLocaleString()} học sinh</span>
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{children}</h2>;
}

function DashboardPage() {
  const [growthView, setGrowthView] = useState<"monthly" | "weekly">("monthly");
  const [countryView, setCountryView] = useState<"bars" | "map">("bars");
  const growthData = growthView === "monthly" ? MONTHLY_GROWTH : WEEKLY_GROWTH;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Báo Cáo Tác Động Xã Hội</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Trường Tiếng Việt Của Em · Dành cho Bộ Ngoại Giao &amp; Ban Quản Lý
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">Cập nhật: {new Date().toLocaleDateString("vi-VN")}</span>
            <Badge className="bg-red-600 text-white hover:bg-red-600">Nội bộ</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        <section className="space-y-4">
          <SectionHeading>Tổng Quan</SectionHeading>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard title="Tài khoản" value={SCALE_STATS.totalRegistered.toLocaleString()} sub="đã đăng ký" badge="↑ 24%" />
            <StatCard title="Người dùng / ngày" value={SCALE_STATS.dau.toLocaleString()} sub="hoạt động hôm nay" badge={SCALE_STATS.dauGrowth} />
            <StatCard title="Người dùng / tháng" value={SCALE_STATS.mau.toLocaleString()} sub="hoạt động tháng này" badge={SCALE_STATS.mauGrowth} />
            <StatCard title="Giờ học" value={`${STATS.totalHours.toLocaleString()}`} sub={`${STATS.totalSessions.toLocaleString()} phiên`} />
            <StatCard title="Chứng chỉ" value={STATS.certificatesIssued.toLocaleString()} sub="đã cấp" badge={`${STATS.completionRate}% tỷ lệ`} />
            <StatCard title="TB / học sinh" value={`${STATS.avgHoursPerStudent}h`} sub="giờ học trung bình" />
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeading>Tăng Trưởng &amp; Giữ Chân</SectionHeading>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>Tốc Độ Tăng Trưởng Người Dùng</CardTitle>
                  <CardDescription>Tổng học sinh tích lũy theo thời gian</CardDescription>
                </div>
                <Tabs value={growthView} onValueChange={(v) => setGrowthView(v as "monthly" | "weekly")}>
                  <TabsList className="h-8">
                    <TabsTrigger value="monthly" className="text-xs px-3">Tháng</TabsTrigger>
                    <TabsTrigger value="weekly" className="text-xs px-3">Tuần</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={growthData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradStudents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="period" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={45} />
                    <Tooltip
                      formatter={(v: number) => [`${v.toLocaleString()} học sinh`, "Tổng"]}
                      contentStyle={{ borderRadius: "8px", fontSize: "13px", border: "1px solid #e5e7eb" }}
                    />
                    <Area type="monotone" dataKey="students" stroke="#ef4444" strokeWidth={2.5} fill="url(#gradStudents)" dot={false} activeDot={{ r: 5, fill: "#ef4444" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Tỷ Lệ Giữ Chân</CardTitle>
                <CardDescription>% học sinh quay lại sau đăng ký</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 flex-1">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-indigo-50 p-3 text-center">
                    <div className="text-2xl font-bold text-indigo-600">{SCALE_STATS.retentionWeek1}%</div>
                    <div className="text-xs text-indigo-400 mt-0.5">Sau tuần đầu</div>
                  </div>
                  <div className="rounded-lg bg-indigo-50/60 p-3 text-center">
                    <div className="text-2xl font-bold text-indigo-400">{SCALE_STATS.retentionMonth1}%</div>
                    <div className="text-xs text-indigo-300 mt-0.5">Sau tháng đầu</div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={140}>
                  <LineChart data={RETENTION_CURVE} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={30} tickFormatter={(v) => `${v}%`} />
                    <Tooltip formatter={(v: number) => [`${v}%`, "Giữ chân"]} contentStyle={{ fontSize: "12px", borderRadius: "6px", border: "1px solid #e5e7eb" }} />
                    <ReferenceLine y={SCALE_STATS.retentionWeek1} stroke="#6366f1" strokeDasharray="3 3" />
                    <ReferenceLine y={SCALE_STATS.retentionMonth1} stroke="#a5b4fc" strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="rate" stroke="#6366f1" strokeWidth={2} dot={{ r: 3, fill: "#6366f1", strokeWidth: 0 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeading>Phân Bổ Địa Lý &amp; Tiến Độ Học Tập</SectionHeading>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>Học Sinh Theo Quốc Gia</CardTitle>
                  <CardDescription>
                    {TOTAL_STUDENTS.toLocaleString()} học sinh tại {COUNTRY_DATA.length} quốc gia
                  </CardDescription>
                </div>
                <Tabs value={countryView} onValueChange={(v) => setCountryView(v as "bars" | "map")}>
                  <TabsList className="h-8">
                    <TabsTrigger value="bars" className="text-xs px-3">Biểu đồ</TabsTrigger>
                    <TabsTrigger value="map" className="text-xs px-3">Bản đồ</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>{countryView === "bars" ? <BarsView /> : <MapView />}</CardContent>
            </Card>

            <div className="flex flex-col gap-6">
              <Card className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle>Tỷ Lệ Hoàn Thành</CardTitle>
                  <CardDescription>Tiến độ qua 8 chủ đề địa danh</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={COMPLETION_DATA} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
                        {COMPLETION_DATA.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => [`${v.toLocaleString()} học sinh`]} />
                    </PieChart>
                  </ResponsiveContainer>
                  {COMPLETION_DATA.map((entry) => (
                    <div key={entry.name}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="flex items-center gap-1.5 text-gray-600">
                          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
                          {entry.name}
                        </span>
                        <span className="font-semibold tabular-nums">{entry.value.toLocaleString()}</span>
                      </div>
                      <Progress value={(entry.value / TOTAL_STUDENTS) * 100} className="h-1" />
                    </div>
                  ))}
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Chứng chỉ đã cấp</span>
                    <span className="font-bold text-emerald-600">{STATS.certificatesIssued}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle>Hoàn Thành Theo Chủ Đề</CardTitle>
                  <CardDescription>Số học sinh hoàn thành từng chủ đề</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={TOPIC_COMPLETION} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={14}>
                      <XAxis dataKey="emoji" tick={{ fontSize: 13 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <Tooltip
                        formatter={(v: number) => [`${v} học sinh`, "Hoàn thành"]}
                        labelFormatter={(label: string) => {
                          const t = TOPIC_COMPLETION.find((x) => x.emoji === label);
                          return t ? t.label : label;
                        }}
                        contentStyle={{ fontSize: "11px", borderRadius: "6px", border: "1px solid #e5e7eb" }}
                      />
                      <Bar dataKey="completed" radius={[3, 3, 0, 0]}>
                        {TOPIC_COMPLETION.map((entry, i) => (
                          <Cell key={entry.label} fill={`rgba(16, 185, 129, ${0.4 + 0.075 * (TOPIC_COMPLETION.length - 1 - i)})`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <p className="text-center text-xs text-gray-400 pb-4">Dữ liệu mẫu · Trường Tiếng Việt Của Em</p>
      </div>
    </div>
  );
}
