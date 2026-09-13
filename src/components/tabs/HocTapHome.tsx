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
  /**
   * Where the tile sits in the bento. Two columns on phones, four from sm up,
   * over rows of a fixed height — so a tile's size is just how many cells it
   * takes. The spans are written to leave no holes in either layout (phone
   * packs 1+1 / 2 / 1+1, desktop 2+1+1 / 2+2) and to match each tile's art:
   * the book covers get tall portrait cells, the photos wide ones.
   */
  span: string;
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
    span: "col-span-1 row-span-3 sm:col-span-2",
  },
  {
    to: "/hoc-tap/quyen-{$quyenNumber}",
    params: { quyenNumber: "2" },
    title: "Quyển 2",
    tone: "peach",
    image: quyen2Cover,
    imageFit: "contain",
    span: "col-span-1 row-span-3",
  },
  {
    to: "/hoc-tap/bang-chu-cai",
    title: "Bảng chữ cái",
    tone: "ice",
    image: alphabetPark,
    imageFit: "cover",
    span: "col-span-2 row-span-2 sm:col-span-1 sm:row-span-3",
  },
  {
    to: "/hoc-tap/luyen-noi",
    title: "Luyện nói",
    tone: "pink",
    art: <Mascot pose="listening" decorative className="h-full max-h-28 w-auto sm:max-h-36" />,
    span: "col-span-1 row-span-2 sm:col-span-2",
  },
  {
    to: "/hoc-tap/khai-minh-duc",
    title: "Khai Minh Đức",
    badge: { text: "Mới", tone: "blue", icon: Sparkles },
    tone: "mint",
    image: khaiMinhDucImg,
    imageFit: "cover",
    span: "col-span-1 row-span-2 sm:col-span-2",
  },
];

export function HocTapHome() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <h1 className="flex justify-center sm:justify-start">
        <SkyBoxRibbon shape="flag-right" fillClassName="bg-blue-600 text-yellow-300" size="lg">
          Em muốn học gì hôm nay?
        </SkyBoxRibbon>
      </h1>

      <div className="mt-8 grid auto-rows-[5.5rem] grid-cols-2 gap-3 sm:mt-10 sm:auto-rows-[7rem] sm:grid-cols-4 sm:gap-4">
        {items.map((item) => (
          <ProgramTile key={item.to + (item.params?.quyenNumber ?? "")} item={item} />
        ))}
      </div>
    </div>
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

/**
 * One bento cell. Same two halves as a SkyBox — a light tone holding the art,
 * a deeper tone holding the label — inside the thick white border that is what
 * separates anything from the sky.
 *
 * The two halves are clipped by an inner wrapper rather than by the link
 * itself, so the corner badge can be a sibling of that wrapper and lie across
 * the white border instead of being cut off inside it.
 */
function ProgramTile({ item }: { item: Item }) {
  return (
    <Link
      to={item.to}
      params={item.params}
      className={[
        "group relative h-full rounded-[1.25rem] shadow-[0_10px_28px_rgba(12,58,110,0.22)] sm:rounded-[1.5rem]",
        // The tile grows in place rather than lifting, and rises above its
        // neighbours while it does so the grown edges aren't overlapped.
        "transition-transform duration-150 hover:z-10 hover:scale-[1.035] active:scale-100",
        item.span,
      ].join(" ")}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[1.25rem] border-[5px] border-white sm:rounded-[1.5rem] sm:border-[6px]">
        <div className={["relative flex flex-1 items-center justify-center overflow-hidden", TONE_BG[item.tone]].join(" ")}>
          {item.image ? (
            <img
              src={item.image}
              alt=""
              className={[
                "h-full w-full",
                item.imageFit === "contain" ? "object-contain" : "object-cover",
              ].join(" ")}
            />
          ) : (
            item.art
          )}
        </div>

        <div className={["flex shrink-0 items-center justify-between gap-2 px-3 py-3", TONE_BG_DEEP[item.tone]].join(" ")}>
          <span className="truncate text-sm font-semibold text-sky-ink">{item.title}</span>
          <ArrowRight className="h-4 w-4 shrink-0 text-sky-ink-soft" strokeWidth={2.5} />
        </div>
      </div>

      {item.badge && <CornerBadge badge={item.badge} />}
    </Link>
  );
}

/**
 * The diagonal ribbon across the tile's top-left. It sits over the white
 * border, clipped only to the tile's own corner radius so the ribbon follows
 * the curve instead of overhanging it.
 */
function CornerBadge({ badge }: { badge: CornerBadgeData }) {
  const tone = BADGE_TONES[badge.tone];
  const Icon = badge.icon;
  return (
    <div className="absolute left-0 top-0 z-10 h-20 w-20 overflow-hidden rounded-tl-[1.25rem] sm:rounded-tl-[1.5rem]">
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
