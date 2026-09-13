import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Star, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import quyen1Cover from "@/assets/quyen_1_cover.jpg";
import quyen2Cover from "@/assets/quyen_2_cover.jpg";
import alphabetPark from "@/assets/cong-vien-chu-cai.jpg";
import khaiMinhDucImg from "@/assets/khai-minh-duc-reading.png";
import { Mascot } from "@/components/Mascot";
import { SkyBoxRibbon, type SkyBoxTone } from "@/components/ui/sky-box";

type LearnLink =
  | "/hoc-tap/quyen-{$quyenNumber}"
  | "/hoc-tap/bang-chu-cai"
  | "/hoc-tap/luyen-noi"
  | "/hoc-tap/khai-minh-duc";

type BadgeTone = "red" | "blue";

const BADGE_TONES: Record<BadgeTone, { gradient: string; iconColor: string }> = {
  red: { gradient: "from-red-500 via-red-600 to-red-800", iconColor: "fill-yellow-400 text-yellow-400" },
  blue: { gradient: "from-blue-500 via-blue-600 to-blue-800", iconColor: "fill-white text-white" },
};

type CornerBadgeData = {
  text: string;
  tone: BadgeTone;
  icon: LucideIcon;
};

type Item = {
  to: LearnLink;
  /** Route params, for the quyển cards — the two books share one route. */
  params?: { quyenNumber: string };
  title: string;
  badge?: CornerBadgeData;
  tone: SkyBoxTone;
  image?: string;
  imageFit?: "cover" | "contain";
  art?: ReactNode;
};

const items: Item[] = [
  {
    to: "/hoc-tap/quyen-{$quyenNumber}",
    params: { quyenNumber: "1" },
    title: "Quyển 1",
    badge: { text: "Bắt đầu", tone: "red", icon: Star },
    tone: "lavender",
    image: quyen1Cover,
    imageFit: "contain",
  },
  {
    to: "/hoc-tap/quyen-{$quyenNumber}",
    params: { quyenNumber: "2" },
    title: "Quyển 2",
    tone: "peach",
    image: quyen2Cover,
    imageFit: "contain",
  },
  {
    to: "/hoc-tap/bang-chu-cai",
    title: "Bảng chữ cái",
    tone: "ice",
    image: alphabetPark,
    imageFit: "cover",
  },
  {
    to: "/hoc-tap/luyen-noi",
    title: "Luyện nói",
    tone: "pink",
    art: <Mascot pose="listening" decorative className="h-full max-h-28 w-auto sm:max-h-36" />,
  },
  {
    to: "/hoc-tap/khai-minh-duc",
    title: "Khai Minh Đức",
    badge: { text: "Mới", tone: "blue", icon: Sparkles },
    tone: "mint",
    image: khaiMinhDucImg,
    imageFit: "cover",
  },
];

export function HocTapHome() {
  return (
    <main className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10">
        <h1 className="flex justify-center sm:justify-start">
          <SkyBoxRibbon shape="flag-right" fillClassName="bg-blue-600 text-yellow-300" size="lg">
            Em muốn học gì hôm nay?
          </SkyBoxRibbon>
        </h1>

        <div className="mt-12 grid grid-cols-3 gap-3 sm:gap-4">
          {items.map((item) => (
            <ProgramTile key={item.to + (item.params?.quyenNumber ?? "")} item={item} />
          ))}
        </div>
      </div>
    </main>
  );
}

const TONE_BG: Record<SkyBoxTone, string> = {
  lavender: "bg-box-lavender",
  peach: "bg-box-peach",
  ice: "bg-box-ice",
  pink: "bg-box-pink",
  mint: "bg-box-mint",
  cream: "bg-box-cream",
  red: "bg-box-red",
  white: "bg-white",
};

const TONE_BG_DEEP: Record<SkyBoxTone, string> = {
  lavender: "bg-box-lavender-deep",
  peach: "bg-box-peach-deep",
  ice: "bg-box-ice-deep",
  pink: "bg-box-pink-deep",
  mint: "bg-box-mint-deep",
  cream: "bg-box-cream-deep",
  red: "bg-box-red-deep",
  white: "bg-box-white-deep",
};

const TONE_BORDER: Record<SkyBoxTone, string> = {
  lavender: "border-box-lavender/40",
  peach: "border-box-peach/40",
  ice: "border-box-ice/40",
  pink: "border-box-pink/40",
  mint: "border-box-mint/40",
  cream: "border-box-cream/40",
  red: "border-box-red/40",
  white: "border-white",
};

function ProgramTile({ item }: { item: Item }) {
  return (
    <Link
      to={item.to}
      params={item.params}
      className={[
        "group relative flex aspect-square flex-col rounded-none border border-border bg-card shadow-md",
        "transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0",
      ].join(" ")}
    >
      {item.badge && <CornerBadge badge={item.badge} />}

      <div className={["relative flex flex-1 items-center justify-center overflow-hidden", TONE_BG[item.tone]].join(" ")}>
        {item.image ? (
          <img
            src={item.image}
            alt=""
            className={[
              "h-full w-full border-[3px]",
              TONE_BORDER[item.tone],
              item.imageFit === "contain" ? "object-contain" : "object-cover",
            ].join(" ")}
          />
        ) : (
          item.art
        )}
      </div>

      <div className={["flex shrink-0 items-center justify-between gap-2 px-3 py-4", TONE_BG_DEEP[item.tone]].join(" ")}>
        <span className="truncate text-sm font-semibold text-foreground">{item.title}</span>
        <ArrowRight className="h-4 w-4 shrink-0 text-foreground/70" strokeWidth={2.5} />
      </div>
    </Link>
  );
}

function CornerBadge({ badge }: { badge: CornerBadgeData }) {
  const tone = BADGE_TONES[badge.tone];
  const Icon = badge.icon;
  return (
    <div className="absolute -left-1 -top-1 z-10 h-20 w-20 overflow-hidden">
      <div
        className={["absolute inset-0 bg-gradient-to-br", tone.gradient].join(" ")}
        style={{
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
          boxShadow: "inset -3px -3px 6px rgba(0,0,0,0.35), inset 2px 2px 3px rgba(255,255,255,0.25)",
        }}
      />
      <Icon className={["absolute left-2 top-2 h-3 w-3 -rotate-45 drop-shadow", tone.iconColor].join(" ")} />
      <span className="absolute left-[-30px] top-[16px] block w-[120px] -rotate-45 py-1.5 text-center text-xs font-extrabold uppercase tracking-wide text-white drop-shadow-sm">
        {badge.text}
      </span>
    </div>
  );
}
