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
import { useTranslations } from "use-intl";
import { richTags } from "@/i18n/rich";
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
  const t = useTranslations("home.hero");
  return (
    <section aria-labelledby="hero-title" className="relative px-4 pt-12 sm:px-6 sm:pt-16 lg:pt-20">
      {/* The wrapper is the logo's own width, so on lg the bubble can hang off
        its right edge while the logo itself stays centred. */}
      <div className="relative mx-auto w-full max-w-[30rem] text-center">
        <h1 id="hero-title">
          <img
            src={logoWordmark}
            alt={t("logoAlt")}
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
   4/3 × 4/3 = 16/9). Every tile stands on a faint mirror-image reflection.
   Each photo's alt text is its id under "home.gallery" in the messages. */
const PHOTOS = [
  { src: beGioTheCo, id: "flag" },
  { src: coGiaoKhaiMac, id: "opening" },
  { src: caLopChupChung, id: "groupPhoto" },
  { src: ghepTheDayLa, id: "matching" },
  { src: lopHocTuongTac, id: "interactive" },
  { src: timTheNguoiThan, id: "family" },
  { src: choiTheTuVung, id: "vocab" },
] as const;

const TILE = "overflow-hidden rounded-lg border-2 border-white sm:rounded-xl sm:border-[3px]";

function Gallery() {
  return (
    // mb leaves room for the bottom row's reflection before the divider.
    <ul className="mx-auto mt-6 mb-8 grid max-w-4xl grid-cols-12 gap-2 sm:mt-8 sm:mb-10 sm:gap-3">
      {PHOTOS.map((p, i) => (
        <GalleryTile key={p.src} photo={p} bottomRow={i >= 4} />
      ))}
    </ul>
  );
}

/**
 * One gallery photo and its reflection. The gallery is the first thing under
 * the logo, so the photos load eagerly, and the whole tile — white frame,
 * photo and reflection — stays invisible until the photo has loaded, then
 * fades in as one piece instead of showing an empty frame that fills later.
 */
function GalleryTile({ photo, bottomRow }: { photo: (typeof PHOTOS)[number]; bottomRow: boolean }) {
  const t = useTranslations("home.gallery");
  const [loaded, setLoaded] = useState(false);
  const shape = bottomRow ? "aspect-[16/9]" : "aspect-[4/3]";

  return (
    <li
      className={[
        "relative transition-opacity duration-300",
        bottomRow ? "col-span-4" : "col-span-3",
        loaded ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      <div className={[TILE, shape].join(" ")}>
        <img
          // A server-rendered image can finish loading before React attaches
          // onLoad, so also check `complete` when the element mounts.
          ref={(el) => {
            if (el?.complete && el.naturalWidth > 0) setLoaded(true);
          }}
          src={photo.src}
          alt={t(photo.id)}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Reflection: a copy of the tile flipped upside down just under
        it, masked from faint to clear so it fades out like a glossy
        floor. Drawn with markup rather than -webkit-box-reflect so it
        works in Firefox too. The top row's reflections fall behind
        the bottom row: later list items paint over earlier ones, so
        only a sliver shows in the gap. Same URL as the photo, so it
        comes from cache. */}
      <div
        aria-hidden="true"
        className={[
          TILE,
          shape,
          "pointer-events-none absolute inset-x-0 top-full -scale-y-100 [mask-image:linear-gradient(to_top,rgb(0_0_0/0.18),transparent_35%)]",
        ].join(" ")}
      >
        <img src={photo.src} alt="" decoding="async" className="h-full w-full object-cover" />
      </div>
    </li>
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

/* Titles and bodies are under "home.mission.steps.<id>" in the messages. */
const STEPS = [
  { id: "alphabet", img: congVienChuCai },
  { id: "book1", img: quyen1Cover },
  { id: "book2", img: quyen2Cover },
  { id: "speaking", img: kidsAoDai },
] as const;

function MissionBox() {
  const t = useTranslations("home.mission");
  return (
    <SkyBox
      tone="lavender"
      ribbon={t("ribbon")}
      // --indigo (the <accent> tag), not --primary, for every accent that sits
      // straight on a box tone: the tones carry enough chroma now that
      // --primary only reaches 2.8:1 on them, while --indigo clears 5:1.
      title={t.rich("title", richTags)}
      lede={t.rich("lede", richTags)}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <SkyCard key={s.id} className="relative flex flex-col">
            <span className="absolute -top-3 -left-3 grid h-9 w-9 place-items-center rounded-full border-[3px] border-white bg-primary font-display text-sm font-extrabold text-primary-foreground">
              {i + 1}
            </span>
            <h3 className="text-center font-display text-base font-extrabold text-sky-ink">
              {t(`steps.${s.id}.title`)}
            </h3>
            <span className="mt-3 block overflow-hidden rounded-xl border-[3px] border-white">
              <img src={s.img} alt="" className="aspect-4/3 w-full object-cover" loading="lazy" />
            </span>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-sky-ink-soft">
              {t(`steps.${s.id}.body`)}
            </p>
          </SkyCard>
        ))}
      </div>
    </SkyBox>
  );
}

/* ── About box ────────────────────────────────────────────────────────── */

/* Headings and bodies are under "home.about.<id>" in the messages. */
const ROWS = [
  { Icon: BookOpenText, id: "digitization" },
  { Icon: Network, id: "ecosystem" },
  { Icon: Copyright, id: "copyright" },
] as const;

function AboutBox() {
  const t = useTranslations("home.about");
  return (
    <SkyBox tone="ice" title={t("title")}>
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
            {t("partner.heading")}
          </span>
          <span className="mt-1 block text-sm leading-relaxed text-sky-ink-soft sm:text-base">
            {t.rich("partner.body", richTags)}
          </span>
        </span>
      </SkyCard>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {ROWS.map((r) => (
          <SkyCard key={r.id}>
            <r.Icon className="h-6 w-6 text-primary" strokeWidth={2.5} aria-hidden />
            <h3 className="mt-3 font-display text-base font-extrabold text-sky-ink">
              {t(`${r.id}.heading`)}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-sky-ink-soft">
              {t.rich(`${r.id}.body`, richTags)}
            </p>
          </SkyCard>
        ))}
      </div>
    </SkyBox>
  );
}

/* ── Thank-you box ────────────────────────────────────────────────────── */

function ThanksBox() {
  const t = useTranslations("home.thanks");
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
      <SkyBox tone="pink" title={t("title")}>
        <SkyCard className="mx-auto max-w-2xl">
          <p className="text-sm leading-relaxed text-sky-ink-soft sm:text-base">
            {t.rich("body", richTags)}
          </p>
          <p className="mt-4 text-right font-display text-sm font-extrabold text-indigo">
            {t("signature")}
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
  const t = useTranslations("home.support");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(t("copied", { value }));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error(t("copyFailed"));
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
        aria-label={t("copy", { label })}
        title={t("copy", { label })}
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
   những gì dự án đang làm, không phải lời hứa. Nội dung nằm ở
   "home.support.points.<id>" trong messages. */
const SUPPORT_POINTS = ["free", "content", "speaking"] as const;

function SupportBox() {
  const t = useTranslations("home.support");
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
      <SkyBox tone="peach" title={t("title")}>
        <div className="grid gap-5 sm:grid-cols-2 sm:items-start sm:gap-6">
          {/* Cột trái: lời kêu gọi và hai cách liên hệ. */}
          <div>
            <h3 className="font-display text-2xl font-extrabold text-indigo-deep sm:text-3xl">
              {t("heading")}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-sky-ink-soft">
              {t.rich("body", richTags)}
            </p>

            <div className="mt-5 flex flex-col gap-2">
              <ContactCard
                icon={Mail}
                label={t("email")}
                value="contact@cvcec.org"
                href="mailto:contact@cvcec.org"
              />
              <ContactCard
                icon={MessageCircle}
                label={t("phone")}
                value="+1 647 897 2358"
                href="https://wa.me/16478972358"
              />
            </div>
          </div>

          {/* Cột phải: đóng góp đi về đâu. */}
          <SkyCard className="sm:p-5">
            <h4 className="font-display text-xs font-extrabold tracking-[0.12em] text-indigo uppercase sm:text-sm">
              {t("helpsTitle")}
            </h4>
            <ul className="mt-4 flex flex-col gap-4">
              {SUPPORT_POINTS.map((point) => (
                <li key={point} className="flex gap-3">
                  <Check
                    className="mt-0.5 h-5 w-5 shrink-0 text-nav-green"
                    strokeWidth={3.5}
                    aria-hidden
                  />
                  <span>
                    <span className="block font-display text-sm font-extrabold text-sky-ink">
                      {t(`points.${point}.heading`)}
                    </span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-sky-ink-soft">
                      {t(`points.${point}.body`)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-5 font-display text-sm font-extrabold text-indigo">{t("thankYou")}</p>
          </SkyCard>
        </div>
      </SkyBox>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */

export function HomePage() {
  const t = useTranslations("home.closing");
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
                {t("title")}
              </>
            }
            lede={t("lede")}
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/hoc-tap" className={skyButton("primary", "px-6")}>
                {t("start")}
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
              <Link to="/hoc-tap/luyen-noi" className={skyButton("white", "px-6")}>
                <Volume2 className="h-5 w-5" aria-hidden />
                {t("speaking")}
              </Link>
            </div>
          </SkyBox>
        </div>
      </div>
    </div>
  );
}
