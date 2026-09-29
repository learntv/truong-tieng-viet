import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpenText,
  Check,
  Copy,
  Copyright,
  Heart,
  Languages,
  Mail,
  MessageCircle,
  Network,
  PencilLine,
  Quote,
  Volume2,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { PressNews } from "./PressNews";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { Section, SectionHeading } from "@/components/layout/Section";
import { HUES, type Hue } from "@/lib/hues";
import { cn } from "@/lib/utils";
import congVienChuCai from "@/assets/cong-vien-chu-cai.jpg";
import quyen1Cover from "@/assets/quyen_1_cover.jpg";
import quyen2Cover from "@/assets/quyen_2_cover.jpg";
import kidsAoDai from "@/assets/kids-aodai.jpg";
import chimLac from "@/assets/symbols/chim-lac.png";
import hoaSen from "@/assets/symbols/hoa-sen.png";
import uyBan from "@/assets/uy-ban.png";
import mascotWave from "@/assets/mascot/wave.png";
import mascotCheer from "@/assets/mascot/cheer.png";
import caLopChupChung from "@/assets/gallery/ca-lop-chup-chung.webp";
import beGioTheCo from "@/assets/gallery/be-gio-the-co.webp";
import coGiaoKhaiMac from "@/assets/gallery/co-giao-khai-mac.webp";
import ghepTheDayLa from "@/assets/gallery/ghep-the-day-la.webp";
import lopHocTuongTac from "@/assets/gallery/lop-hoc-tuong-tac.webp";
import timTheNguoiThan from "@/assets/gallery/tim-the-nguoi-than.webp";
import choiTheTuVung from "@/assets/gallery/choi-the-tu-vung.webp";

/* ── Hero ─────────────────────────────────────────────────────────────── */

const HERO_CHIPS: { label: string; Icon: LucideIcon; hue: Hue; pos: string }[] = [
  {
    label: "Bảng chữ cái",
    Icon: Languages,
    hue: "grape",
    pos: "left-3 top-6 sm:-left-5 sm:top-14",
  },
  { label: "Luyện nói", Icon: Volume2, hue: "rose", pos: "right-3 top-1/2 sm:-right-6" },
  { label: "Tập viết", Icon: PencilLine, hue: "leaf", pos: "bottom-6 left-6 sm:-left-3" },
];

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-wash">
      <Container className="grid items-center gap-12 pt-10 pb-16 sm:pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pt-16 lg:pb-24">
        <div className="flex flex-col items-start gap-6 animate-rise">
          <h1 id="hero-title" className="text-display text-ink-900">
            Học tiếng Việt{" "}
            <span className="relative whitespace-nowrap text-brand-600">
              vui nhộn
              <svg
                aria-hidden
                viewBox="0 0 220 18"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-3.5 w-full text-sun-500 sm:-bottom-3 sm:h-4"
              >
                <path
                  d="M3 13 C 50 4, 120 3, 217 9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            cùng Trâu con
          </h1>

          <p className="max-w-xl text-lede text-ink-600">
            Hành trình miễn phí cho trẻ em kiều bào 5–12 tuổi: bảng chữ cái, 8 chủ đề với 40 chặng
            học, luyện nói và tập viết — số hóa từ bộ sách{" "}
            <strong className="font-semibold text-ink-800">Vui học Tiếng Việt</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button asChild size="xl">
              <Link to="/hoc-tap">
                Bắt đầu học
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link to="/hoc-tap/luyen-noi">
                <Volume2 className="text-rose-600" aria-hidden />
                Luyện nói
              </Link>
            </Button>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm font-medium text-ink-600">
            {["Miễn phí trọn đời", "8 chủ đề · 40 chặng học", "Dành cho em 5–12 tuổi"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="grid size-5 place-items-center rounded-full bg-leaf-100 text-leaf-700">
                  <Check className="size-3" strokeWidth={3.5} aria-hidden />
                </span>
                {t}
              </li>
            ))}
          </ul>

          <p className="flex items-center gap-3 border-t border-ink-100 pt-5 text-sm text-ink-600">
            <img
              src={uyBan}
              alt=""
              className="size-10 rounded-full bg-white object-contain p-0.5 shadow-xs"
            />
            <span>
              Dưới sự bảo trợ của{" "}
              <strong className="font-semibold text-ink-800">UBNVONN – Bộ Ngoại giao</strong>
            </span>
          </p>
        </div>

        <HeroStage />
      </Container>
    </section>
  );
}

/**
 * The right half of the hero: a rounded stage on the notebook dot grid, Trâu
 * con standing in it, and the spelling bubble over his head — the product's
 * mechanism (a word built sound by sound) playing on loop in the first view.
 */
function HeroStage() {
  return (
    <div className="relative mx-auto w-full max-w-md animate-rise [animation-delay:120ms] lg:max-w-none">
      <div className="relative aspect-[5/5.2] overflow-hidden rounded-[2.5rem] bg-brand-50 sm:aspect-[5/4.6]">
        <div aria-hidden className="bg-dots absolute inset-0 opacity-70" />
        <div
          aria-hidden
          className="absolute -right-16 -bottom-24 size-80 rounded-full bg-sun-100"
        />
        <div aria-hidden className="absolute -top-20 -left-20 size-64 rounded-full bg-brand-100" />

        <div className="absolute inset-x-0 top-[9%] flex justify-center">
          <SpellBubble />
        </div>

        <img
          src={mascotWave}
          alt="Trâu con đội nón lá vẫy tay chào"
          width={296}
          height={340}
          fetchPriority="high"
          className="absolute bottom-0 left-1/2 h-[54%] w-auto -translate-x-1/2 drop-shadow-[0_18px_24px_rgb(20_28_49/0.18)]"
        />
      </div>

      {HERO_CHIPS.map(({ label, Icon, hue, pos }, i) => (
        <span
          key={label}
          aria-hidden
          style={{ animationDelay: `${300 + i * 120}ms` }}
          className={cn(
            "absolute flex animate-pop items-center gap-2 rounded-full border border-ink-100 bg-white py-1.5 pr-3.5 pl-1.5 text-sm font-semibold text-ink-800 shadow-md",
            pos,
          )}
        >
          <span
            className={cn("grid size-7 place-items-center rounded-full text-white", HUES[hue].fill)}
          >
            <Icon className="size-4" strokeWidth={2.5} />
          </span>
          {label}
        </span>
      ))}
    </div>
  );
}

/* ── Spelling bubble: a word spelled sound by sound ───────────────────── */

/* Each word split the way a Vietnamese child spells it — "nh" is one sound,
   so it is one tile — with the tone mark kept on its vowel. */
const SPELL_WORDS = [
  { parts: ["m", "è", "o"], word: "mèo" },
  { parts: ["b", "à"], word: "bà" },
  { parts: ["c", "á"], word: "cá" },
  { parts: ["nh", "à"], word: "nhà" },
  { parts: ["h", "o", "a"], word: "hoa" },
  { parts: ["đ", "ỏ"], word: "đỏ" },
];

/* Tiles cycle through the stage hues at their AA step, so the white letters
   hold contrast on every one of them. */
const TILE_COLORS = ["bg-stage-5", "bg-brand-600", "bg-stage-4", "bg-stage-1", "bg-stage-3"];
const WORD_COLORS = [
  "text-stage-5",
  "text-brand-600",
  "text-stage-4",
  "text-stage-1",
  "text-stage-3",
];

const SPELL_INTERVAL_MS = 2800;

/** Decorative (aria-hidden): a live region changing every three seconds
 *  would only be noise for a screen reader. */
function SpellBubble() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % SPELL_WORDS.length),
      SPELL_INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  const { parts, word } = SPELL_WORDS[index];
  const color = (i: number) => (index + i) % TILE_COLORS.length;

  return (
    <div
      aria-hidden="true"
      className="relative w-[15.5rem] rounded-3xl bg-white px-4 py-3.5 shadow-lg sm:w-[18rem]"
    >
      {/* The tail points down at Trâu con. */}
      <svg
        viewBox="0 0 28 16"
        className="absolute top-[calc(100%-1px)] left-1/2 h-4 w-7 -translate-x-1/2"
      >
        <path d="M0 0 H28 L14 16 Z" className="fill-white" />
      </svg>

      <div key={index} className="flex items-center justify-center gap-1.5">
        {parts.map((p, i) => (
          <span
            key={i}
            style={{ animationDelay: `${i * 140}ms` }}
            className={cn(
              "grid h-10 min-w-10 animate-pop place-items-center rounded-xl px-1.5 text-[1.375rem] leading-none font-extrabold text-white sm:h-12 sm:min-w-12 sm:text-[1.625rem]",
              TILE_COLORS[color(i)],
            )}
          >
            {p}
          </span>
        ))}
        <ArrowRight
          style={{ animationDelay: `${parts.length * 140 + 120}ms` }}
          className="mx-0.5 size-5 animate-pop text-ink-400"
          strokeWidth={3}
        />
        <span
          style={{ animationDelay: `${parts.length * 140 + 240}ms` }}
          className={cn(
            "animate-pop text-[1.75rem] leading-none font-extrabold sm:text-[2.125rem]",
            WORD_COLORS[color(parts.length)],
          )}
        >
          {word}
        </span>
      </div>
    </div>
  );
}

/* ── The path: four steps, one journey ────────────────────────────────── */

const STEPS: {
  title: string;
  img: string;
  body: string;
  hue: Hue;
  to: "/hoc-tap/bang-chu-cai" | "/hoc-tap/luyen-noi" | "/hoc-tap/quyen-{$quyenNumber}";
  /** Route params, for the two quyển — they share one route. */
  params?: { quyenNumber: string };
}[] = [
  {
    title: "Bảng chữ cái",
    img: congVienChuCai,
    body: "Làm quen với bảng chữ cái tiếng Việt qua hình ảnh, âm thanh và trò chơi.",
    hue: "grape",
    to: "/hoc-tap/bang-chu-cai",
  },
  {
    title: "Quyển 1",
    img: quyen1Cover,
    body: "Bốn chủ đề đầu tiên: gia đình, trường lớp và những người bạn quanh em.",
    hue: "brand",
    to: "/hoc-tap/quyen-{$quyenNumber}",
    params: { quyenNumber: "1" },
  },
  {
    title: "Quyển 2",
    img: quyen2Cover,
    body: "Bốn chủ đề tiếp theo: quê hương, thiên nhiên và văn hóa Việt Nam.",
    hue: "coral",
    to: "/hoc-tap/quyen-{$quyenNumber}",
    params: { quyenNumber: "2" },
  },
  {
    title: "Luyện nói",
    img: kidsAoDai,
    body: "Nghe, nhắc lại và ghi âm để nói tiếng Việt tự tin, rõ ràng hơn mỗi ngày.",
    hue: "rose",
    to: "/hoc-tap/luyen-noi",
  },
];

function Journey() {
  return (
    <Section id="su-menh" space="loose" className="scroll-mt-20">
      <SectionHeading
        title={
          <>
            Giúp mọi trẻ em kiều bào <span className="text-brand-600">giữ tiếng Việt</span> — miễn
            phí
          </>
        }
        lede={
          <>
            Trường Tiếng Việt Của Em số hóa bộ sách Vui học Tiếng Việt thành một hành trình bốn
            bước. Miễn phí, trọn đời, cho mọi em nhỏ.
          </>
        }
        action={
          <Button asChild variant="secondary">
            <Link to="/hoc-tap">
              Xem tất cả bài học
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        }
      />

      <ol className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {/* The dashed route joining the four stops, drawn behind them on lg. */}
        <span
          aria-hidden
          className="absolute top-[4.25rem] right-[12%] left-[12%] hidden border-t-2 border-dashed border-ink-200 lg:block"
        />
        {STEPS.map((s, i) => {
          const h = HUES[s.hue];
          return (
            <li key={s.title} className="relative">
              <Link
                to={s.to}
                params={s.params}
                className="group flex h-full flex-col rounded-3xl p-3 transition-colors duration-200 hover:bg-ink-25"
              >
                <span className={cn("relative block overflow-hidden rounded-2xl", h.wash)}>
                  <img
                    src={s.img}
                    alt=""
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                  <span
                    className={cn(
                      "absolute top-3 left-3 grid size-9 place-items-center rounded-full text-sm font-extrabold text-white shadow-md ring-4 ring-white",
                      h.fill,
                    )}
                  >
                    {i + 1}
                  </span>
                </span>
                <span className="mt-4 flex items-center justify-between gap-2 px-1">
                  <span className="text-h3 text-ink-900">{s.title}</span>
                  <ArrowRight
                    className={cn(
                      "size-5 shrink-0 -translate-x-1 opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:opacity-100",
                      h.ink,
                    )}
                    aria-hidden
                  />
                </span>
                <span className="mt-2 px-1 text-sm leading-relaxed text-ink-600">{s.body}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

/* ── Gallery: the classes behind the platform ─────────────────────────── */

const PHOTOS = [
  {
    src: caLopChupChung,
    alt: "Cô giáo, tình nguyện viên và các em học sinh mặc áo dài chụp ảnh chung, tay cầm sách tiếng Việt",
    span: "col-span-2 row-span-2",
  },
  { src: beGioTheCo, alt: "Em bé mặc áo dài đỏ giơ cao thẻ cờ Việt Nam", span: "" },
  {
    src: coGiaoKhaiMac,
    alt: "Cô giáo cầm thẻ cờ Việt Nam trong buổi khai mạc lớp tiếng Việt tương tác, dịp Giỗ Tổ Hùng Vương",
    span: "",
  },
  { src: ghepTheDayLa, alt: "Các em nhỏ chơi ghép thẻ từ vựng “Đây là” quanh bàn", span: "" },
  {
    src: lopHocTuongTac,
    alt: "Học sinh, tình nguyện viên và phụ huynh trong buổi học tiếng Việt tương tác",
    span: "",
  },
  {
    src: timTheNguoiThan,
    alt: "Các em cùng tìm thẻ hình người thân trên bàn",
    span: "col-span-2 sm:col-span-1",
  },
  {
    src: choiTheTuVung,
    alt: "Nhóm học sinh cúi xem thẻ từ vựng trải trên bàn",
    span: "col-span-2 sm:col-span-3",
  },
];

function Gallery() {
  return (
    <Section band="tint" space="loose">
      <SectionHeading
        title="Những lớp học thật phía sau từng bài học"
        lede="Các buổi học tiếng Việt cộng đồng của CVCEC tại Canada — nơi bộ sách được dạy, chơi và thử nghiệm cùng các em."
      />
      <ul className="grid auto-rows-[9rem] grid-cols-2 gap-3 sm:auto-rows-[11rem] sm:grid-cols-4 sm:gap-4 lg:auto-rows-[13rem]">
        {PHOTOS.map((p) => (
          <li key={p.src} className={cn("overflow-hidden rounded-2xl bg-ink-100", p.span)}>
            <img
              src={p.src}
              alt={p.alt}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ── About ────────────────────────────────────────────────────────────── */

const ABOUT_ROWS = [
  {
    Icon: BookOpenText,
    hue: "brand" as Hue,
    heading: "Dự án số hóa",
    body: (
      <>
        Số hóa hai cuốn sách của <strong>NXB ĐH Sư Phạm TP Hồ Chí Minh</strong>, trong khuôn khổ
        Chương trình Tôn vinh tiếng Việt trong cộng đồng người Việt Nam ở nước ngoài do{" "}
        <strong>UBNVONN – Bộ Ngoại giao</strong> phát động.
      </>
    ),
  },
  {
    Icon: Network,
    hue: "leaf" as Hue,
    heading: "Hệ sinh thái",
    body: (
      <>
        Dự án là thành viên tích cực của{" "}
        <strong>Mạng lưới các cơ sở giảng dạy tiếng Việt và văn hóa Việt Nam ở nước ngoài</strong>.
      </>
    ),
  },
  {
    Icon: Copyright,
    hue: "grape" as Hue,
    heading: "Bản quyền",
    body: (
      <>
        Được bảo hộ bản quyền bởi đồng tác giả: Phan Thị Quỳnh Trang, Nguyễn Trần Thanh Hải, Đỗ Thị
        Phương Mai, Trần Thanh Phúc, Trần Văn Nhật.
      </>
    ),
  },
];

function About() {
  return (
    <Section id="gioi-thieu" band="tint" space="loose" className="scroll-mt-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        {/* The endorsement is the trust signal, so it gets the one solid
          colored block on the page's upper half. */}
        <div className="relative flex flex-col justify-between gap-10 overflow-hidden rounded-[2rem] bg-brand-600 p-8 text-white sm:p-10">
          <div
            aria-hidden
            className="absolute -top-24 -right-24 size-72 rounded-full bg-brand-500"
          />
          <div
            aria-hidden
            className="absolute -bottom-32 -left-16 size-72 rounded-full bg-brand-700/60"
          />
          <span className="relative grid size-20 place-items-center rounded-3xl bg-white shadow-md">
            <img src={chimLac} alt="" className="size-14 object-contain" />
          </span>
          <div className="relative">
            <h2 className="text-h2 text-white">Đồng hành chuyên môn</h2>
            <p className="mt-4 text-lede text-brand-50">
              Dự án thực hiện dưới sự đồng hành và ủng hộ của{" "}
              <strong className="font-bold text-white">
                Ủy ban Nhà nước về người Việt Nam ở nước ngoài – Bộ Ngoại giao
              </strong>
              .
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <h2 className="text-h2 text-ink-900">Giới thiệu dự án</h2>
          <ul className="mt-6 divide-y divide-ink-100">
            {ABOUT_ROWS.map((r) => {
              const h = HUES[r.hue];
              return (
                <li key={r.heading} className="flex gap-5 py-6 first:pt-2 last:pb-0">
                  <span
                    className={cn(
                      "grid size-12 shrink-0 place-items-center rounded-2xl",
                      h.wash,
                      h.ink,
                    )}
                  >
                    <r.Icon className="size-6" strokeWidth={2.25} aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-h3 text-ink-900">{r.heading}</h3>
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-600 [&_strong]:font-semibold [&_strong]:text-ink-800">
                      {r.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Section>
  );
}

/* ── Thanks: a letter, set as a quotation ─────────────────────────────── */

function Thanks() {
  return (
    <Section space="loose" width="content">
      <figure className="relative mx-auto max-w-3xl text-center">
        <img src={hoaSen} alt="" aria-hidden className="mx-auto size-20 object-contain" />
        <Quote aria-hidden className="mx-auto mt-6 size-8 fill-coral-500 text-coral-500" />
        <h2 className="sr-only">Lời cảm ơn</h2>
        <blockquote className="mt-5 text-lede leading-relaxed text-ink-700 sm:text-[1.25rem] [&_strong]:font-semibold [&_strong]:text-ink-900">
          <p>
            Ban quản lý dự án xin được gửi lời cảm ơn chân thành tới{" "}
            <strong>Ủy ban Nhà nước về người Việt Nam ở nước ngoài – Bộ Ngoại giao</strong> nước
            Cộng hòa xã hội chủ nghĩa Việt Nam đã luôn đồng hành và định hướng. Chúng tôi xin gửi
            lời tri ân sâu sắc tới các Đại sứ quán, các cơ quan ban ngành tại Việt Nam và Canada,
            cùng Mạng lưới giảng dạy tiếng Việt đã tạo điều kiện và hỗ trợ quý báu để dự án{" "}
            <strong>&quot;Trường Tiếng Việt Của Em&quot;</strong> được hoàn thiện và đi vào vận
            hành. Sự đồng hành của quý vị là nguồn động lực to lớn giúp chúng tôi gìn giữ và lan tỏa
            ngôn ngữ, văn hóa Việt đến với thế hệ trẻ tại Canada nói riêng và trên toàn thế giới nói
            chung.
          </p>
        </blockquote>
        <figcaption className="mt-6 text-label text-coral-700">— Ban quản lý dự án</figcaption>
      </figure>
    </Section>
  );
}

/* ── Support ──────────────────────────────────────────────────────────── */

/** One line of contact: icon, the address itself, and a copy button. */
function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Đã sao chép: " + value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Không thể sao chép");
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-ink-100 bg-white p-2 pl-3 shadow-xs">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-coral-50 text-coral-600">
        <Icon className="size-[1.1rem]" aria-hidden />
      </span>
      <a href={href} className="min-w-0 flex-1 hover:text-brand-600">
        <span className="block text-caption text-ink-500">{label}</span>
        <span className="block truncate font-semibold text-ink-900">{value}</span>
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-900"
        aria-label={"Sao chép " + label}
        title={"Sao chép " + label}
      >
        {copied ? (
          <Check className="size-4 text-leaf-600" strokeWidth={3} aria-hidden />
        ) : (
          <Copy className="size-4" aria-hidden />
        )}
      </button>
    </div>
  );
}

/* Each point is something the project already does, not a promise. */
const SUPPORT_POINTS = [
  {
    heading: "Giữ toàn bộ chương trình miễn phí",
    body: "40+ bài học trải khắp 8 chủ đề, mở cho mọi em nhỏ, trọn đời, không thu phí.",
  },
  {
    heading: "Số hóa thêm nội dung mới",
    body: "Tiếp nối bộ sách Vui học Tiếng Việt của NXB ĐH Sư Phạm TP Hồ Chí Minh.",
  },
  {
    heading: "Nuôi dưỡng phần luyện nói",
    body: "Hình ảnh, âm thanh, trò chơi và ghi âm để các em nói tiếng Việt tự tin hơn.",
  },
];

function Support() {
  return (
    <Section id="dong-hanh" band="tint" space="loose" className="scroll-mt-20">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="grid size-12 place-items-center rounded-2xl bg-rose-50 text-rose-600">
            <Heart className="size-6 fill-rose-500 text-rose-500" aria-hidden />
          </span>
          <h2 className="mt-5 text-h2 text-ink-900">Đồng hành để giữ tiếng Việt cho mọi em nhỏ</h2>
          <p className="mt-4 max-w-xl text-lede text-ink-600">
            &quot;Trường Tiếng Việt Của Em&quot; là dự án phi lợi nhuận. Dự án luôn rộng mở đón nhận
            sự đồng hành, đóng góp và tài trợ từ các bậc phụ huynh, kiều bào và các mạnh thường
            quân. Mỗi sự đóng góp – dù là nhỏ nhất – đều quý báu.
          </p>
          <div className="mt-8 grid max-w-md gap-3">
            <ContactRow
              icon={Mail}
              label="Email"
              value="contact@cvcec.org"
              href="mailto:contact@cvcec.org"
            />
            <ContactRow
              icon={MessageCircle}
              label="Điện thoại / WhatsApp"
              value="+1 647 897 2358"
              href="https://wa.me/16478972358"
            />
          </div>
        </div>

        <div className="rounded-[2rem] bg-leaf-50 p-6 sm:p-10">
          <h3 className="text-h3 text-leaf-700">Đóng góp của bạn giúp</h3>
          <ul className="mt-6 flex flex-col gap-6">
            {SUPPORT_POINTS.map((point) => (
              <li key={point.heading} className="flex gap-4">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-leaf-600 text-white">
                  <Check className="size-4" strokeWidth={3} aria-hidden />
                </span>
                <span>
                  <span className="block font-semibold text-ink-900">{point.heading}</span>
                  <span className="mt-1 block text-[0.9375rem] leading-relaxed text-ink-600">
                    {point.body}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-8 font-semibold text-leaf-700">Xin chân thành cảm ơn!</p>
        </div>
      </div>
    </Section>
  );
}

/* ── Closing call ─────────────────────────────────────────────────────── */

function ClosingCall() {
  return (
    <Section space="loose">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-600 px-6 py-12 sm:px-12 sm:py-16 lg:px-16">
        <div aria-hidden className="absolute -top-32 -left-24 size-96 rounded-full bg-brand-500" />
        <div
          aria-hidden
          className="absolute -right-10 -bottom-40 size-96 rounded-full bg-sun-500/25"
        />
        <div className="relative flex flex-col items-center gap-10 text-center md:flex-row md:justify-between md:text-left">
          <div className="max-w-xl">
            <h2 className="text-h1 text-white">Học tiếng Việt mọi lúc, mọi nơi</h2>
            <p className="mt-4 text-lede text-brand-50">
              Trâu con đội nón lá đã sẵn sàng. Mở bài học đầu tiên và bắt đầu hành trình của em.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <Button asChild size="xl" variant="white">
                <Link to="/hoc-tap">
                  Học ngay
                  <ArrowRight className="text-brand-600" aria-hidden />
                </Link>
              </Button>
              <Button
                asChild
                size="xl"
                variant="ghost"
                className="text-white ring-1 ring-white/40 hover:bg-white/10 hover:text-white"
              >
                <Link to="/hoc-tap/luyen-noi">
                  <Volume2 aria-hidden />
                  Luyện nói
                </Link>
              </Button>
            </div>
          </div>
          <img
            src={mascotCheer}
            alt=""
            aria-hidden
            loading="lazy"
            className="h-44 w-auto shrink-0 animate-float drop-shadow-[0_20px_24px_rgb(20_28_49/0.25)] sm:h-56"
          />
        </div>
      </div>
    </Section>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */

export function HomePage() {
  return (
    <>
      <Hero />
      <Journey />
      <Gallery />
      <div id="tin-tuc" className="scroll-mt-20">
        <PressNews />
      </div>
      <About />
      <Thanks />
      <Support />
      <ClosingCall />
    </>
  );
}
