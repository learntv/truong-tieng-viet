import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Sparkles, Star } from "lucide-react";
import type { ReactNode } from "react";
import quyen1Cover from "@/assets/quyen_1_cover.jpg";
import quyen2Cover from "@/assets/quyen_2_cover.jpg";
import alphabetPark from "@/assets/cong-vien-chu-cai.jpg";
import khaiMinhDucImg from "@/assets/khai-minh-duc-reading.png";
import tapVietImg from "@/assets/tap-viet-tile.jpg";
import { Mascot } from "@/components/Mascot";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/layout/Container";
import { HUES, type Hue } from "@/lib/hues";
import { cn } from "@/lib/utils";

type LearnLink =
  | "/hoc-tap/quyen-{$quyenNumber}"
  | "/hoc-tap/bang-chu-cai"
  | "/hoc-tap/luyen-noi"
  | "/hoc-tap/khai-minh-duc"
  | "/hoc-tap/tap-viet";

type Item = {
  to: LearnLink;
  /** Route params, for the quyển tiles — the two books share one route. */
  params?: { quyenNumber: string };
  title: string;
  blurb: string;
  badge?: "start" | "new";
  hue: Hue;
  image?: string;
  imageFit?: "cover" | "contain";
  art?: ReactNode;
  /**
   * Where the tile sits in the bento: two columns on phones, four from sm, over
   * rows of a fixed height. Spans leave no holes in either layout — phone packs
   * 2 / 1+1 / 1+1 / 2, desktop 2+1+1 / 1+2+1 — and give the book covers tall
   * cells and the photos wide ones.
   */
  span: string;
};

const items: Item[] = [
  {
    to: "/hoc-tap/quyen-{$quyenNumber}",
    params: { quyenNumber: "1" },
    title: "Quyển 1",
    blurb: "Gia đình, trường lớp và những người bạn quanh em.",
    badge: "start",
    hue: "brand",
    image: quyen1Cover,
    imageFit: "contain",
    span: "col-span-2 row-span-2 sm:row-span-3",
  },
  {
    to: "/hoc-tap/quyen-{$quyenNumber}",
    params: { quyenNumber: "2" },
    title: "Quyển 2",
    blurb: "Quê hương, thiên nhiên và văn hóa Việt Nam.",
    hue: "coral",
    image: quyen2Cover,
    imageFit: "contain",
    span: "col-span-1 row-span-2 sm:row-span-3",
  },
  {
    to: "/hoc-tap/bang-chu-cai",
    title: "Bảng chữ cái",
    blurb: "Làm quen từng chữ cái qua hình ảnh và âm thanh.",
    hue: "grape",
    image: alphabetPark,
    imageFit: "cover",
    span: "col-span-1 row-span-2 sm:row-span-3",
  },
  {
    to: "/hoc-tap/luyen-noi",
    title: "Luyện nói",
    blurb: "Nghe mẫu, ghi âm và nhận sao.",
    hue: "rose",
    art: <Mascot pose="listening" decorative className="h-[78%] w-auto" />,
    span: "col-span-1 row-span-2",
  },
  {
    to: "/hoc-tap/khai-minh-duc",
    title: "Khai Minh Đức",
    blurb: "Học đánh vần từng âm, từng vần.",
    badge: "new",
    hue: "leaf",
    image: khaiMinhDucImg,
    imageFit: "cover",
    span: "col-span-2 row-span-2",
  },
  {
    to: "/hoc-tap/tap-viet",
    title: "Tập viết",
    blurb: "Tô chữ trên trang vở ô li.",
    badge: "new",
    hue: "sky",
    image: tapVietImg,
    imageFit: "contain",
    span: "col-span-1 row-span-2",
  },
];

export function HocTapHome() {
  return (
    <>
      <PageHeader
        icon={BookOpen}
        hue="brand"
        title="Em muốn học gì hôm nay?"
        lede="Chọn một góc học bên dưới. Mỗi ngày một chút — Trâu con luôn học cùng em."
        aside={
          <Mascot
            pose="reading"
            size="lg"
            decorative
            className="hidden h-40 animate-float md:block"
          />
        }
      />

      <Container className="pb-16 sm:pb-24">
        <ul className="grid grid-flow-dense auto-rows-[8.5rem] grid-cols-2 gap-3 sm:auto-rows-[7.5rem] sm:grid-cols-4 sm:gap-5">
          {items.map((item, i) => (
            <li
              key={item.to + (item.params?.quyenNumber ?? "")}
              className={cn("animate-rise", item.span)}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <ProgramTile item={item} />
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}

/**
 * One bento cell: the art on its hue's soft wash, and a white label plate
 * floating at the bottom with the title, one line of what it is, and a round
 * arrow in the hue. The whole tile lifts on hover and its art leans in.
 */
function ProgramTile({ item }: { item: Item }) {
  const h = HUES[item.hue];
  return (
    <Link
      to={item.to}
      params={item.params}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl p-2 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lg sm:p-2.5",
        h.wash,
      )}
    >
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl">
        {item.image ? (
          <img
            src={item.image}
            alt=""
            className={cn(
              "h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.04]",
              item.imageFit === "contain"
                ? "object-contain p-2 drop-shadow-[0_10px_18px_rgb(20_28_49/0.18)]"
                : "rounded-2xl object-cover",
            )}
          />
        ) : (
          <div className="flex h-full items-end justify-center transition-transform duration-500 ease-out group-hover:scale-[1.05]">
            {item.art}
          </div>
        )}

        {item.badge && <TileBadge kind={item.badge} />}
      </div>

      <div className="mt-2 flex shrink-0 items-center gap-3 rounded-2xl bg-white px-3 py-2.5 shadow-xs sm:px-4 sm:py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-ink-900 sm:text-[1.0625rem]">{item.title}</p>
          <p className="mt-0.5 hidden truncate text-sm text-ink-500 sm:block">{item.blurb}</p>
        </div>
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-full text-white transition-transform duration-300 ease-out group-hover:translate-x-0.5 sm:size-9",
            h.fill,
          )}
        >
          <ArrowRight className="size-4" strokeWidth={2.75} aria-hidden />
        </span>
      </div>
    </Link>
  );
}

function TileBadge({ kind }: { kind: "start" | "new" }) {
  const start = kind === "start";
  const Icon = start ? Star : Sparkles;
  return (
    <span
      className={cn(
        "absolute top-2 left-2 inline-flex h-7 items-center gap-1 rounded-full px-2.5 text-caption font-bold shadow-sm",
        start ? "bg-coral-600 text-white" : "bg-sun-300 text-ink-900",
      )}
    >
      <Icon className={cn("size-3.5", start ? "fill-white" : "fill-ink-900")} aria-hidden />
      {start ? "Bắt đầu" : "Mới"}
    </span>
  );
}
