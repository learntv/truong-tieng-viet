import { type ReactNode, useState } from "react";
import { Icon, type IconifyIcon } from "@iconify/react";
import roundArrowForward from "@iconify-icons/ic/round-arrow-forward";
import roundMenuBook from "@iconify-icons/ic/round-menu-book";
import roundCheck from "@iconify-icons/ic/round-check";
import roundContentCopy from "@iconify-icons/ic/round-content-copy";
import roundCopyright from "@iconify-icons/ic/round-copyright";
import roundFavorite from "@iconify-icons/ic/round-favorite";
import roundMail from "@iconify-icons/ic/round-mail";
import roundChat from "@iconify-icons/ic/round-chat";
import roundHub from "@iconify-icons/ic/round-hub";
import roundVolumeUp from "@iconify-icons/ic/round-volume-up";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { SkyBackdrop } from "./SkyBackdrop";
import { PressNews } from "./PressNews";
import { MissionCarousel } from "./MissionCarousel";
import { RichMessage } from "./RichMessage";
import { SkyBox, SkyCard } from "@/components/ui/sky-box";
import { skyButton } from "@/components/ui/sky-button";
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
import { m } from "@/paraglide/messages";

/* How a plain {#b} in the about copy renders; the boxes that set it in
   indigo pass their own. */
const bold = { b: (c: ReactNode) => <strong>{c}</strong> };
const boldIndigo = { b: (c: ReactNode) => <strong className="text-indigo">{c}</strong> };

/* ── Hero: the logo, centred on the sky ───────────────────────────────── */

/* A thin white sticker outline around the wordmark, so the red and navy
   brush lettering holds up on the blue sky. Each drop-shadow copies the
   result of the one before, so four offsets make a 2px outline all round. */
const LOGO_OUTLINE =
  "[filter:drop-shadow(2px_0_0_white)_drop-shadow(-2px_0_0_white)_drop-shadow(0_2px_0_white)_drop-shadow(0_-2px_0_white)]";

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative px-4 pt-12 sm:px-6 sm:pt-16 lg:pt-20">
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
      </div>
    </section>
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
 * Divider between the hero and the content boxes: Trâu con in all his
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

/* ── Mission box: the classes the project serves ─────────────────────── */

function MissionBox() {
  return (
    <SkyBox
      tone="lavender"
      ribbon={m.home_mission_ribbon()}
      title={
        <>
          {/* --indigo, not --primary, for every accent that sits straight on a
            box tone: the tones carry enough chroma now that --primary only
            reaches 2.8:1 on them, while --indigo clears 5:1. */}
          <RichMessage
            parts={m.home_mission_title.parts()}
            tags={{ hl: (c) => <span className="text-indigo">{c}</span> }}
          />
        </>
      }
    >
      <MissionCarousel />
    </SkyBox>
  );
}

/* ── About box ────────────────────────────────────────────────────────── */

/* Bodies are functions so the copy is read in the visitor's language at
   render time, not frozen at module load. */
const ROWS = [
  {
    id: "digital",
    icon: roundMenuBook,
    heading: m.home_about_digital_heading,
    body: () => <RichMessage parts={m.home_about_digital_body.parts()} tags={bold} />,
  },
  {
    id: "network",
    icon: roundHub,
    heading: m.home_about_network_heading,
    body: () => (
      <>
        <RichMessage parts={m.home_about_network_body.parts()} tags={bold} />
        <span className="mt-2 block">
          <RichMessage parts={m.home_about_network_body_2.parts()} tags={bold} />
        </span>
      </>
    ),
  },
  {
    id: "copyright",
    icon: roundCopyright,
    heading: m.home_about_copyright_heading,
    body: () => m.home_about_copyright_body(),
  },
];

function AboutBox() {
  return (
    <SkyBox tone="ice" title={m.home_about_title()}>
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
            {m.home_about_partner_heading()}
          </span>
          <span className="mt-1 block text-sm leading-relaxed text-sky-ink-soft sm:text-base">
            <RichMessage parts={m.home_about_partner_body.parts()} tags={boldIndigo} />
          </span>
        </span>
      </SkyCard>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {ROWS.map((r) => (
          <SkyCard key={r.id}>
            <Icon icon={r.icon} className="h-6 w-6 text-primary" aria-hidden />
            <h3 className="mt-3 font-display text-base font-extrabold text-sky-ink">
              {r.heading()}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-sky-ink-soft">{r.body()}</p>
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
      <SkyBox tone="pink" title={m.home_thanks_title()}>
        <SkyCard className="mx-auto max-w-2xl">
          <p className="text-sm leading-relaxed text-sky-ink-soft sm:text-base">
            <RichMessage parts={m.home_thanks_body.parts()} tags={boldIndigo} />
          </p>
          <p className="mt-4 text-right font-display text-sm font-extrabold text-indigo">
            {m.home_thanks_signature()}
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
  icon,
  label,
  value,
  href,
}: {
  icon: IconifyIcon;
  label: string;
  value: string;
  href: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(m.home_copied({ value }));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error(m.home_copy_failed());
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
      <a href={href} className="group flex min-w-0 items-center gap-2.5">
        {/* Đĩa tròn nhỏ giữ cho icon có cùng trọng lượng với dòng chữ đậm bên
          cạnh — icon trần trông lạc lõng ở cỡ này. */}
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
          <Icon icon={icon} className="h-3.5 w-3.5" aria-hidden />
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
        aria-label={m.home_copy_label({ label })}
        title={m.home_copy_label({ label })}
      >
        {copied ? (
          <Icon icon={roundCheck} className="h-4 w-4 text-nav-green" aria-hidden />
        ) : (
          <Icon icon={roundContentCopy} className="h-4 w-4" aria-hidden />
        )}
      </button>
    </div>
  );
}

/* Mỗi dòng là một việc mà sự đồng hành trực tiếp nuôi dưỡng — tất cả đều là
   những gì dự án đang làm, không phải lời hứa. */
const SUPPORT_POINTS = [
  {
    id: "free",
    heading: m.home_support_free_heading,
    body: m.home_support_free_body,
  },
  {
    id: "digitize",
    heading: m.home_support_digitize_heading,
    body: m.home_support_digitize_body,
  },
  {
    id: "speaking",
    heading: m.home_support_speaking_heading,
    body: m.home_support_speaking_body,
  },
];

function SupportBox() {
  return (
    <div className="relative">
      {/* SkyBox có overflow-hidden nên trái tim phải là anh em của nó, không
        phải con — nếu không, phần nhô lên trên sẽ bị viền trắng cắt mất. Bóng
        đổ dùng drop-shadow inline vì filter phải bám theo hình trái tim, không
        phải theo ô vuông của icon. */}
      <Icon
        icon={roundFavorite}
        aria-hidden
        className="pointer-events-none absolute -top-6 right-4 z-10 h-20 w-20 rotate-6 text-stage-5 sm:-top-8 sm:right-8 sm:h-24 sm:w-24"
        style={{ filter: "drop-shadow(0 5px 4px oklch(0.46 0.12 15 / 0.45))" }}
      />
      <SkyBox tone="peach" title={m.home_support_title()}>
        <div className="grid gap-5 sm:grid-cols-2 sm:items-start sm:gap-6">
          {/* Cột trái: lời kêu gọi và hai cách liên hệ. */}
          <div>
            <h3 className="font-display text-2xl font-extrabold text-indigo-deep sm:text-3xl">
              {m.home_support_heading()}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-sky-ink-soft">
              <RichMessage parts={m.home_support_body.parts()} tags={boldIndigo} />
            </p>

            <div className="mt-5 flex flex-col gap-2">
              <ContactCard
                icon={roundMail}
                label="Email"
                value="contact@cvcec.org"
                href="mailto:contact@cvcec.org"
              />
              <ContactCard
                icon={roundChat}
                label={m.home_contact_phone()}
                value="+1 647 897 2358"
                href="https://wa.me/16478972358"
              />
            </div>
          </div>

          {/* Cột phải: đóng góp đi về đâu. */}
          <SkyCard className="sm:p-5">
            <h4 className="font-display text-xs font-extrabold tracking-[0.12em] text-indigo uppercase sm:text-sm">
              {m.home_support_helps()}
            </h4>
            <ul className="mt-4 flex flex-col gap-4">
              {SUPPORT_POINTS.map((point) => (
                <li key={point.id} className="flex gap-3">
                  <Icon
                    icon={roundCheck}
                    className="mt-0.5 h-5 w-5 shrink-0 text-nav-green"
                    aria-hidden
                  />
                  <span>
                    <span className="block font-display text-sm font-extrabold text-sky-ink">
                      {point.heading()}
                    </span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-sky-ink-soft">
                      {point.body()}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-5 font-display text-sm font-extrabold text-indigo">
              {m.home_support_thanks()}
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
                {m.home_cta_title()}
              </>
            }
            lede={m.home_cta_lede()}
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/hoc-tap" className={skyButton("primary", "px-6")}>
                {m.home_learn_now()}
                <Icon icon={roundArrowForward} className="h-5 w-5" aria-hidden />
              </Link>
              <Link to="/hoc-tap/luyen-noi" className={skyButton("white", "px-6")}>
                <Icon icon={roundVolumeUp} className="h-5 w-5" aria-hidden />
                {m.home_speaking()}
              </Link>
            </div>
          </SkyBox>
        </div>
      </div>
    </div>
  );
}
