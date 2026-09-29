import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpenText,
  Check,
  Copy,
  Copyright,
  Heart,
  Mail,
  MessageCircle,
  Network,
  Volume2,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { SkyBackdrop } from "./SkyBackdrop";
import { PressNews } from "./PressNews";
import { SkyBox, SkyCard } from "@/components/ui/sky-box";
import { skyButton } from "@/components/ui/sky-button";
import congVienChuCai from "@/assets/cong-vien-chu-cai.jpg";
import quyen1Cover from "@/assets/quyen_1_cover.jpg";
import quyen2Cover from "@/assets/quyen_2_cover.jpg";
import kidsAoDai from "@/assets/kids-aodai.jpg";
import chimLac from "@/assets/symbols/chim-lac.png";
import hoaSen from "@/assets/symbols/hoa-sen.png";
import buffalo from "@/assets/buffalo-icon.png";
import logoWordmark from "@/assets/logo-wordmark.png";
import mascotRunning from "@/assets/mascot/running.png";
import mascotWave from "@/assets/mascot/wave.png";
import mascotReading from "@/assets/mascot/reading.png";
import mascotFlag from "@/assets/mascot/flag.png";
import mascotEatingPho from "@/assets/mascot/eating-pho.png";
import mascotThumbsUp from "@/assets/mascot/thumbs-up.png";
import mascotThinking from "@/assets/mascot/thinking.png";
import mascotCheer from "@/assets/mascot/cheer.png";
import mascotPointing from "@/assets/mascot/pointing.png";
import caLopChupChung from "@/assets/gallery/ca-lop-chup-chung.webp";
import beGioTheCo from "@/assets/gallery/be-gio-the-co.webp";
import coGiaoKhaiMac from "@/assets/gallery/co-giao-khai-mac.webp";
import ghepTheDayLa from "@/assets/gallery/ghep-the-day-la.webp";
import lopHocTuongTac from "@/assets/gallery/lop-hoc-tuong-tac.webp";
import timTheNguoiThan from "@/assets/gallery/tim-the-nguoi-than.webp";
import choiTheTuVung from "@/assets/gallery/choi-the-tu-vung.webp";

/* ── Hero: the logo, centred on the sky ───────────────────────────────── */

/* A thin white sticker outline around the wordmark, so the red and navy
   brush lettering holds up on the blue sky. Each drop-shadow copies the
   result of the one before, so four offsets make a 2px outline all round. */
const LOGO_OUTLINE =
  "[filter:drop-shadow(2px_0_0_white)_drop-shadow(-2px_0_0_white)_drop-shadow(0_2px_0_white)_drop-shadow(0_-2px_0_white)]";

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative px-4 pt-12 sm:px-6 sm:pt-16 lg:pt-20">
      {/* The wrapper is the logo's own width, so on lg the bubble can hang off
        its right edge while the logo itself stays centred. */}
      <div className="relative mx-auto w-full max-w-[30rem] text-center">
        <h1 id="hero-title">
          <img
            src={logoWordmark}
            alt="Trường Tiếng Việt Của Em"
            width={1462}
            height={589}
            fetchPriority="high"
            className={["block h-auto w-full", LOGO_OUTLINE].join(" ")}
          />
        </h1>
        <SpellBubble />
      </div>

      <Gallery />
    </section>
  );
}

/* ── Spelling bubble: the logo "says" a word, letter by letter ───────── */

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

/* Tiles cycle through the stage accents — flat fills, no bevel. */
const TILE_COLORS = ["bg-stage-5", "bg-stage-2", "bg-stage-4", "bg-stage-1", "bg-stage-3"];
const WORD_COLORS = [
  "text-stage-5",
  "text-stage-2",
  "text-stage-4",
  "text-stage-1",
  "text-stage-3",
];

const SPELL_INTERVAL_MS = 2800;

/**
 * A cartoon speech bubble beside the logo that spells a short word tile by
 * tile, then shows it whole: m · è · o → mèo. It moves on to the next word
 * every few seconds. Purely decorative (aria-hidden) — a live region that
 * changes every three seconds would only be noise for a screen reader.
 *
 * lg+: it hangs off the logo's right edge. Below lg there is no room beside
 * the logo, so it sits centred underneath. Either way the tail curls off its
 * bottom-right corner.
 */
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
      className="relative mx-auto mt-4 mb-20 w-[15rem] rotate-[6deg] rounded-[1.4rem] border-[3px] border-indigo-deep bg-white px-3.5 py-2.5 shadow-bevel-primary lg:absolute lg:top-[8%] lg:left-full lg:mt-0 lg:mb-0 lg:ml-2 xl:ml-5 xl:w-[17.5rem]"
    >
      {/* Tail: a curved comic-strip hook off the bottom-right. The SVG starts
        4px up inside the bubble so its white fill paints over the bubble's
        bottom border and bevel where they meet; only the two curved sides are
        stroked, so the join reads as one continuous outline. */}
      <svg
        viewBox="0 0 40 36"
        className="absolute top-[calc(100%-4px)] right-5 h-9 w-10 overflow-visible"
      >
        <path d="M6 0 C 8 14 20 26 37 33 C 28 22 26 12 26 0 Z" className="fill-white" />
        <path
          d="M6 0 C 8 14 20 26 37 33 C 28 22 26 12 26 0"
          fill="none"
          strokeWidth="3"
          strokeLinejoin="round"
          className="stroke-indigo-deep"
        />
      </svg>

      {/* The speaker: Trâu con's head at the tip of the tail, counter-rotated
        so it stays upright while the bubble tilts. */}
      <img
        src={buffalo}
        alt=""
        className={[
          "absolute top-[calc(100%+0.75rem)] -right-10 h-14 w-14 -rotate-[6deg] object-contain xl:h-16 xl:w-16",
          LOGO_OUTLINE,
        ].join(" ")}
      />

      {/* Fixed-width bubble, content centred: it holds its size from word to
        word instead of jumping as they change length. */}
      <div key={index} className="relative flex items-center justify-center gap-1.5">
        {parts.map((p, i) => (
          <span
            key={i}
            style={{ animationDelay: `${i * 140}ms` }}
            className={[
              "grid h-9 min-w-9 animate-tile-pop place-items-center rounded-xl px-1.5 font-display text-xl leading-none font-extrabold text-white xl:h-11 xl:min-w-11 xl:text-[1.7rem]",
              TILE_COLORS[color(i)],
            ].join(" ")}
          >
            {p}
          </span>
        ))}
        <span
          style={{ animationDelay: `${parts.length * 140 + 120}ms` }}
          className="ml-1 animate-tile-pop font-display text-xl font-extrabold text-indigo-deep"
        >
          →
        </span>
        <span
          style={{ animationDelay: `${parts.length * 140 + 240}ms` }}
          className={[
            "animate-tile-pop font-display text-2xl leading-none font-extrabold xl:text-[2rem]",
            WORD_COLORS[color(parts.length)],
          ].join(" ")}
        >
          {word}
        </span>
      </div>
    </div>
  );
}

/* ── Gallery: two rows of class photos under the logo ────────────────── */

/* Four photos over three, each its own rounded, white-bordered tile on the
   sky. It runs on a 12-column grid so both rows fill the width: the top four
   take 3 columns each at 4:3, the bottom three take 4 columns each at 16:9,
   which is the same height as the top row (a third wider, same height:
   4/3 × 4/3 = 16/9). Every tile stands on a faint mirror-image reflection. */
const PHOTOS = [
  {
    src: beGioTheCo,
    alt: "Em bé mặc áo dài đỏ giơ cao thẻ cờ Việt Nam",
  },
  {
    src: coGiaoKhaiMac,
    alt: "Cô giáo cầm thẻ cờ Việt Nam trong buổi khai mạc lớp tiếng Việt tương tác, dịp Giỗ Tổ Hùng Vương",
  },
  {
    src: caLopChupChung,
    alt: "Cô giáo, tình nguyện viên và các em học sinh mặc áo dài chụp ảnh chung, tay cầm sách tiếng Việt",
  },
  {
    src: ghepTheDayLa,
    alt: "Các em nhỏ chơi ghép thẻ từ vựng “Đây là” quanh bàn",
  },
  {
    src: lopHocTuongTac,
    alt: "Học sinh, tình nguyện viên và phụ huynh trong buổi học tiếng Việt tương tác",
  },
  {
    src: timTheNguoiThan,
    alt: "Các em cùng tìm thẻ hình người thân trên bàn",
  },
  {
    src: choiTheTuVung,
    alt: "Nhóm học sinh cúi xem thẻ từ vựng trải trên bàn",
  },
];

const TILE = "overflow-hidden rounded-lg border-2 border-white sm:rounded-xl sm:border-[3px]";

function Gallery() {
  return (
    // mb leaves room for the bottom row's reflection before the divider.
    <ul className="mx-auto mt-6 mb-8 grid max-w-4xl grid-cols-12 gap-2 sm:mt-8 sm:mb-10 sm:gap-3">
      {PHOTOS.map((p, i) => {
        const bottomRow = i >= 4;
        const shape = bottomRow ? "aspect-[16/9]" : "aspect-[4/3]";
        return (
          <li
            key={p.src}
            className={["relative", bottomRow ? "col-span-4" : "col-span-3"].join(" ")}
          >
            <div className={[TILE, shape].join(" ")}>
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Reflection: a copy of the tile flipped upside down just under
              it, masked from faint to clear so it fades out like a glossy
              floor. Drawn with markup rather than -webkit-box-reflect so it
              works in Firefox too. The top row's reflections fall behind
              the bottom row: later list items paint over earlier ones, so
              only a sliver shows in the gap. */}
            <div
              aria-hidden="true"
              className={[
                TILE,
                shape,
                "pointer-events-none absolute inset-x-0 top-full -scale-y-100 [mask-image:linear-gradient(to_top,rgb(0_0_0/0.18),transparent_35%)]",
              ].join(" ")}
            >
              <img
                src={p.src}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ── Divider: a row of Trâu con poses ───────────────────────────────── */

/* Nine full-body poses — crying and the two peeking crops don't stand on a
   line. */
const PARADE = [
  mascotRunning,
  mascotWave,
  mascotReading,
  mascotFlag,
  mascotEatingPho,
  mascotThumbsUp,
  mascotThinking,
  mascotCheer,
  mascotPointing,
];

/**
 * Divider between the gallery and the content boxes: Trâu con in all his
 * poses, standing in one still row spread across the content width. Phones
 * only have room for the first six. Decorative.
 */
function BuffaloParade() {
  return (
    <div aria-hidden="true" className="my-6 flex items-end justify-between sm:my-8">
      {PARADE.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className={["h-12 w-auto sm:h-14 lg:h-16", i >= 6 ? "hidden sm:block" : ""].join(" ")}
        />
      ))}
    </div>
  );
}

/* ── Mission box: the four steps of the journey ───────────────────────── */

const STEPS = [
  {
    title: "Bảng chữ cái",
    img: congVienChuCai,
    body: "Làm quen với bảng chữ cái tiếng Việt qua hình ảnh, âm thanh và trò chơi.",
  },
  {
    title: "Quyển 1",
    img: quyen1Cover,
    body: "Bốn chủ đề đầu tiên: gia đình, trường lớp và những người bạn quanh em.",
  },
  {
    title: "Quyển 2",
    img: quyen2Cover,
    body: "Bốn chủ đề tiếp theo: quê hương, thiên nhiên và văn hóa Việt Nam.",
  },
  {
    title: "Luyện nói",
    img: kidsAoDai,
    body: "Nghe, nhắc lại và ghi âm để nói tiếng Việt tự tin, rõ ràng hơn mỗi ngày.",
  },
];

function MissionBox() {
  return (
    <SkyBox
      tone="lavender"
      ribbon="Sứ mệnh của dự án"
      title={
        <>
          {/* --indigo, not --primary, for every accent that sits straight on a
            box tone: the tones carry enough chroma now that --primary only
            reaches 2.8:1 on them, while --indigo clears 5:1. */}
          Giúp mọi trẻ em kiều bào <span className="text-indigo">giữ tiếng Việt</span> — miễn phí
        </>
      }
      lede={
        <>
          Trường Tiếng Việt Của Em số hóa bộ sách <strong>Vui học Tiếng Việt</strong> thành một hành
          trình bốn bước: chữ cái, quyển 1, quyển 2 và luyện nói. Miễn phí, trọn đời, cho mọi em
          nhỏ.
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <SkyCard key={s.title} className="relative flex flex-col">
            <span className="absolute -top-3 -left-3 grid h-9 w-9 place-items-center rounded-full border-[3px] border-white bg-primary font-display text-sm font-extrabold text-primary-foreground">
              {i + 1}
            </span>
            <h3 className="text-center font-display text-base font-extrabold text-sky-ink">
              {s.title}
            </h3>
            <span className="mt-3 block overflow-hidden rounded-xl border-[3px] border-white">
              <img src={s.img} alt="" className="aspect-4/3 w-full object-cover" loading="lazy" />
            </span>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-sky-ink-soft">{s.body}</p>
          </SkyCard>
        ))}
      </div>
    </SkyBox>
  );
}

/* ── About box ────────────────────────────────────────────────────────── */

const ROWS = [
  {
    Icon: BookOpenText,
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
    heading: "Bản quyền",
    body: (
      <>
        Được bảo hộ bản quyền bởi đồng tác giả: Phan Thị Quỳnh Trang, Nguyễn Trần Thanh Hải, Đỗ Thị
        Phương Mai, Trần Thanh Phúc, Trần Văn Nhật.
      </>
    ),
  },
];

function AboutBox() {
  return (
    <SkyBox tone="ice" title="Giới thiệu">
      {/* The sponsorship is the trust signal, so it leads on its own card
        above the plain trio. The symbol PNG carries a white matte fringe from
        how it was cut out, so it sits on a white disc where the fringe
        disappears rather than being fought. */}
      <SkyCard className="flex flex-col items-center gap-4 text-center sm:flex-row sm:gap-6 sm:text-left">
        <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-white sm:h-24 sm:w-24">
          <img src={chimLac} alt="" className="h-14 w-14 object-contain sm:h-16 sm:w-16" />
        </span>
        <span>
          <span className="block font-display text-lg font-extrabold text-sky-ink">
            Đồng hành chuyên môn
          </span>
          <span className="mt-1 block text-sm leading-relaxed text-sky-ink-soft sm:text-base">
            Dự án thực hiện dưới sự đồng hành và ủng hộ của{" "}
            <strong className="text-indigo">
              Ủy ban Nhà nước về người Việt Nam ở nước ngoài – Bộ Ngoại giao
            </strong>
            .
          </span>
        </span>
      </SkyCard>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {ROWS.map((r) => (
          <SkyCard key={r.heading}>
            <r.Icon className="h-6 w-6 text-primary" strokeWidth={2.5} aria-hidden />
            <h3 className="mt-3 font-display text-base font-extrabold text-sky-ink">{r.heading}</h3>
            <p className="mt-2 text-sm leading-relaxed text-sky-ink-soft">{r.body}</p>
          </SkyCard>
        ))}
      </div>
    </SkyBox>
  );
}

/* ── Thank-you box ────────────────────────────────────────────────────── */

function ThanksBox() {
  return (
    <div className="relative">
      {/* Hoa sen nhô lên góc trên như trái tim của hộp đồng hành — cũng phải là
        anh em của SkyBox vì SkyBox cắt phần tràn. */}
      <img
        src={hoaSen}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -top-4 right-4 z-10 h-20 w-20 object-contain sm:-top-5 sm:right-8 sm:h-24 sm:w-24"
        style={{ filter: "drop-shadow(0 5px 4px oklch(0.28 0.045 260 / 0.28))" }}
      />
      <SkyBox tone="pink" title="Lời cảm ơn">
        <SkyCard className="mx-auto max-w-2xl">
          <p className="text-sm leading-relaxed text-sky-ink-soft sm:text-base">
            Ban quản lý dự án xin được gửi lời cảm ơn chân thành tới{" "}
            <strong className="text-indigo">
              Ủy ban Nhà nước về người Việt Nam ở nước ngoài – Bộ Ngoại giao
            </strong>{" "}
            nước Cộng hòa xã hội chủ nghĩa Việt Nam đã luôn đồng hành và định hướng. Chúng tôi xin
            gửi lời tri ân sâu sắc tới các Đại sứ quán, các cơ quan ban ngành tại Việt Nam và
            Canada, cùng Mạng lưới giảng dạy tiếng Việt đã tạo điều kiện và hỗ trợ quý báu để dự án{" "}
            <strong className="text-indigo">&quot;Trường Tiếng Việt Của Em&quot;</strong> được hoàn
            thiện và đi vào vận hành. Sự đồng hành của quý vị là nguồn động lực to lớn giúp chúng
            tôi gìn giữ và lan tỏa ngôn ngữ, văn hóa Việt đến với thế hệ trẻ tại Canada nói riêng và
            trên toàn thế giới nói chung.
          </p>
          <p className="mt-4 text-right font-display text-sm font-extrabold text-indigo">
            — Ban quản lý dự án
          </p>
        </SkyCard>
      </SkyBox>
    </div>
  );
}

/* ── Support box ──────────────────────────────────────────────────────── */

/**
 * One line of contact: icon, the address itself, and a copy button. Deliberately
 * not a card — it sits under the support headline, where a boxed card would
 * outweigh the copy it belongs to.
 */
function ContactCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
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
    <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
      <a href={href} className="group flex min-w-0 items-center gap-2.5">
        {/* Đĩa tròn nhỏ giữ cho icon có cùng trọng lượng với dòng chữ đậm bên
          cạnh — icon trần trông lạc lõng ở cỡ này. */}
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
          <Icon className="h-3.5 w-3.5" aria-hidden />
        </span>
        <span className="text-sm text-sky-ink-soft">{label}:</span>
        <span className="font-display text-sm font-extrabold text-sky-ink group-hover:text-indigo-deep">
          {value}
        </span>
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-md text-sky-ink-soft transition-colors hover:bg-white hover:text-primary"
        aria-label={"Sao chép " + label}
        title={"Sao chép " + label}
      >
        {copied ? (
          <Check className="h-4 w-4 text-nav-green" aria-hidden />
        ) : (
          <Copy className="h-4 w-4" aria-hidden />
        )}
      </button>
    </div>
  );
}

/* Mỗi dòng là một việc mà sự đồng hành trực tiếp nuôi dưỡng — tất cả đều là
   những gì dự án đang làm, không phải lời hứa. */
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

function SupportBox() {
  return (
    <div className="relative">
      {/* SkyBox có overflow-hidden nên trái tim phải là anh em của nó, không
        phải con — nếu không, phần nhô lên trên sẽ bị viền trắng cắt mất. Bóng
        đổ dùng drop-shadow inline vì filter phải bám theo hình trái tim, không
        phải theo ô vuông của icon. */}
      <Heart
        aria-hidden
        className="pointer-events-none absolute -top-6 right-4 z-10 h-20 w-20 rotate-6 fill-stage-5 text-stage-5-deep sm:-top-8 sm:right-8 sm:h-24 sm:w-24"
        strokeWidth={1.5}
        style={{ filter: "drop-shadow(0 5px 4px oklch(0.46 0.12 15 / 0.45))" }}
      />
      <SkyBox tone="peach" title="Kêu gọi hỗ trợ">
        <div className="grid gap-5 sm:grid-cols-2 sm:items-start sm:gap-6">
          {/* Cột trái: lời kêu gọi và hai cách liên hệ. */}
          <div>
            <h3 className="font-display text-2xl font-extrabold text-indigo-deep sm:text-3xl">
              Đồng hành để giữ tiếng Việt cho mọi em nhỏ.
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-sky-ink-soft">
              <strong className="text-indigo">&quot;Trường Tiếng Việt Của Em&quot;</strong> là dự án
              phi lợi nhuận. Dự án luôn rộng mở đón nhận sự đồng hành, đóng góp và tài trợ từ các
              bậc phụ huynh, kiều bào và các mạnh thường quân. Mỗi sự đóng góp – dù là nhỏ nhất –
              đều quý báu.
            </p>

            <div className="mt-5 flex flex-col gap-2">
              <ContactCard
                icon={Mail}
                label="Email"
                value="contact@cvcec.org"
                href="mailto:contact@cvcec.org"
              />
              <ContactCard
                icon={MessageCircle}
                label="Điện thoại"
                value="+1 647 897 2358"
                href="https://wa.me/16478972358"
              />
            </div>
          </div>

          {/* Cột phải: đóng góp đi về đâu. */}
          <SkyCard className="sm:p-5">
            <h4 className="font-display text-xs font-extrabold tracking-[0.12em] text-indigo uppercase sm:text-sm">
              Đóng góp của bạn giúp
            </h4>
            <ul className="mt-4 flex flex-col gap-4">
              {SUPPORT_POINTS.map((point) => (
                <li key={point.heading} className="flex gap-3">
                  <Check
                    className="mt-0.5 h-5 w-5 shrink-0 text-nav-green"
                    strokeWidth={3.5}
                    aria-hidden
                  />
                  <span>
                    <span className="block font-display text-sm font-extrabold text-sky-ink">
                      {point.heading}
                    </span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-sky-ink-soft">
                      {point.body}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-5 font-display text-sm font-extrabold text-indigo">
              Xin chân thành cảm ơn!
            </p>
          </SkyCard>
        </div>
      </SkyBox>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */

export function HomePage() {
  return (
    <div className="relative isolate overflow-hidden">
      <SkyBackdrop />

      <Hero />

      {/* pb clears the grass band at the bottom of the backdrop, so the last
        box never overlaps the hills. */}
      <div className="relative w-full px-4 pt-8 pb-44 sm:px-6 sm:pt-10 sm:pb-56">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-9 sm:gap-12">
          <BuffaloParade />

          <div id="su-menh" className="scroll-mt-24">
            <MissionBox />
          </div>

          <div id="tin-tuc" className="scroll-mt-24">
            <PressNews />
          </div>

          <div id="gioi-thieu" className="scroll-mt-24">
            <AboutBox />
          </div>

          <ThanksBox />

          <div id="dong-hanh" className="scroll-mt-24">
            <SupportBox />
          </div>

          {/* Closing call — the reference's "Take Starfall Anywhere" beat. */}
          <SkyBox
            tone="mint"
            title={
              <>
                <img src={buffalo} alt="" className="mx-auto mb-2 h-16 w-16 object-contain" />
                Học tiếng Việt mọi lúc, mọi nơi
              </>
            }
            lede="Trâu con đội nón lá đã sẵn sàng. Mở bài học đầu tiên và bắt đầu hành trình của em."
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/hoc-tap" className={skyButton("primary", "px-6")}>
                Học ngay
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
              <Link to="/hoc-tap/luyen-noi" className={skyButton("white", "px-6")}>
                <Volume2 className="h-5 w-5" aria-hidden />
                Luyện nói
              </Link>
            </div>
          </SkyBox>
        </div>
      </div>
    </div>
  );
}
