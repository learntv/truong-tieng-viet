import { type ReactNode, useState } from "react";
import { Icon, type IconifyIcon } from "@iconify/react";
import roundArrowForward from "@iconify-icons/ic/round-arrow-forward";
import roundMenuBook from "@iconify-icons/ic/round-menu-book";
import roundCheck from "@iconify-icons/ic/round-check";
import roundCopyright from "@iconify-icons/ic/round-copyright";
import roundContentCopy from "@iconify-icons/ic/round-content-copy";
import roundMail from "@iconify-icons/ic/round-mail";
import roundWhatsapp from "@iconify-icons/ic/round-whatsapp";
import roundHub from "@iconify-icons/ic/round-hub";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { InfoHero } from "./InfoHero";
import { InfoCarousel } from "./InfoCarousel";
import { InfoStats } from "./InfoStats";
import hoaSen from "@/assets/symbols/hoa-sen.png";
import chimLac from "@/assets/symbols/chim-lac.png";
import { SectionHeader } from "@/components/ui/section-header";
import { RichMessage } from "@/components/home/RichMessage";
import { m } from "@/paraglide/messages";

/**
 * The content is not four equal facts: the Bộ Ngoại giao sponsorship is the
 * trust signal and leads on a full-width indigo card; the rest drop to a plain
 * bordered trio with red line-icons. No tints, no decorative symbol artwork.
 */
const boldGold = { b: (c: ReactNode) => <strong className="font-semibold text-gold">{c}</strong> };
const boldInk = {
  b: (c: ReactNode) => <strong className="font-semibold text-foreground">{c}</strong>,
};

const LEAD = {
  heading: m.home_about_partner_heading,
  body: () => <RichMessage parts={m.home_about_partner_body.parts()} tags={boldGold} />,
};

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

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
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
    <div className="group flex items-center justify-between gap-3 rounded-2xl bg-card px-5 py-4 text-left shadow-card transition-all hover:shadow-card-hover sm:px-6">
      <a href={href} className="flex min-w-0 flex-1 items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
          <Icon icon={icon} className="h-5 w-5" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          <span className="block select-all font-display text-base font-semibold text-navy">{value}</span>
        </span>
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
        aria-label={m.home_copy()}
        title={m.home_copy()}
      >
        {copied ? (
          <Icon icon={roundCheck} className="h-4 w-4 text-green-600" aria-hidden />
        ) : (
          <Icon icon={roundContentCopy} className="h-4 w-4" aria-hidden />
        )}
      </button>
    </div>
  );
}

const ROWS = [
  {
    id: "digital",
    icon: roundMenuBook,
    heading: m.home_about_digital_heading,
    body: () => <RichMessage parts={m.home_info_digital_body.parts()} tags={boldInk} />,
  },
  {
    id: "network",
    icon: roundHub,
    heading: m.home_about_network_heading,
    body: () => <RichMessage parts={m.home_info_network_body.parts()} tags={boldInk} />,
  },
  {
    id: "copyright",
    icon: roundCopyright,
    heading: m.home_about_copyright_heading,
    body: () => m.home_info_copyright_body(),
  },
];

export function InfoTab() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <InfoHero />
      <InfoCarousel />

      <div id="gioi-thieu" className="mx-auto max-w-6xl scroll-mt-24 pt-8 pb-16 sm:pt-12 sm:pb-24">
        <SectionHeader
          align="center"
          eyebrow={m.home_info_about_eyebrow()}
          title={m.home_about_title()}
          subtitle={m.home_info_about_subtitle()}
          className="mx-auto mb-10 sm:mb-14"
        />

        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl bg-indigo px-6 py-8 sm:px-10 sm:py-10">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(40rem 20rem at 88% -20%, color-mix(in oklab, var(--primary-glow) 45%, transparent) 0%, transparent 65%)",
              }}
            />
            <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:gap-8 sm:text-left">
              {/* The symbol PNGs carry a white matte fringe from how they were
                cut out. Rather than fight it, the badge gives the artwork a pale
                disc to sit on, so the fringe lands on near-white and disappears. */}
              <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-white/92 shadow-sm ring-1 ring-white/25 sm:h-28 sm:w-28">
                <img src={chimLac} alt="" className="h-16 w-16 object-contain sm:h-20 sm:w-20" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-semibold tracking-[0.12em] text-gold uppercase">
                  {LEAD.heading()}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-white/90 sm:text-lg">
                  {LEAD.body()}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:mt-6 sm:grid-cols-3 sm:gap-6">
            {ROWS.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border border-border bg-card px-6 py-6 shadow-card sm:px-7 sm:py-7"
              >
                <Icon icon={r.icon} className="h-6 w-6 text-primary" aria-hidden />
                <h3 className="mt-4 font-display text-lg font-bold text-navy">{r.heading()}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.body()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="lo-trinh" className="-mx-4 scroll-mt-24 bg-sky-tint px-4 py-16 sm:-mx-6 sm:px-6 sm:py-24 lg:-mx-8">
        <SectionHeader align="center" title={m.home_info_path_title()} className="mb-10 sm:mb-12" />
        <InfoStats />

        {/* Repeats the hero's primary CTA at the point where the reader has
          just seen what the course actually contains. */}
        <div className="mt-12 flex justify-center sm:mt-14">
          <Link
            to="/hoc-tap"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-card transition-colors hover:bg-primary/90 sm:text-base"
          >
            {m.home_learn_now()}
            <Icon icon={roundArrowForward} className="h-5 w-5" aria-hidden />
          </Link>
        </div>
      </div>

      {/* Lời cảm ơn — full-bleed deep red band with two soft squircle shapes
        bleeding off opposite corners, per the TTVCE-UI red theme. */}
      <div className="relative -mx-4 overflow-hidden bg-indigo px-4 py-16 sm:-mx-6 sm:px-6 sm:py-24 lg:-mx-8">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(60rem 28rem at 82% -10%, color-mix(in oklab, var(--primary-glow) 50%, transparent) 0%, transparent 65%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(44rem 24rem at 10% 115%, color-mix(in oklab, var(--gold) 24%, transparent) 0%, transparent 60%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <img
            src={hoaSen}
            alt=""
            className="mx-auto mb-5 h-20 w-20 object-contain sm:h-24 sm:w-24"
          />
          <h3 className="inline-flex items-center gap-2 font-display text-2xl font-bold text-white sm:text-3xl">
            {m.home_thanks_title()}
          </h3>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-white/90 sm:text-base">
            <RichMessage parts={m.home_thanks_body.parts()} tags={boldGold} />
          </p>
          <p className="mt-6 text-sm font-semibold text-gold-soft">{m.home_thanks_signature()}</p>
        </div>
      </div>

      {/* Đồng hành / Call to action — light band after the indigo thank-you. */}
      <div id="dong-hanh" className="-mx-4 scroll-mt-24 bg-sky-tint px-4 py-16 sm:-mx-6 sm:px-6 sm:py-24 lg:-mx-8">
        <div className="mx-auto max-w-3xl text-center">
          <h3 className="font-display text-2xl font-bold text-navy sm:text-3xl">
            {m.home_info_support_heading()}
          </h3>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            <RichMessage
              parts={m.home_info_support_body.parts()}
              tags={{ b: (c) => <strong className="font-semibold text-primary">{c}</strong> }}
            />
          </p>

          <div className="mt-8 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-stretch">
            <ContactCard
              icon={roundMail}
              label="Email"
              value="contact@cvcec.org"
              href="mailto:contact@cvcec.org"
            />
            <ContactCard
              icon={roundWhatsapp}
              label="WhatsApp"
              value="+1 647 897 2358"
              href="https://wa.me/16478972358"
            />
          </div>

          <p className="mt-8 font-display text-base font-semibold text-primary">
            {m.home_support_thanks()}
          </p>
        </div>
      </div>
    </div>
  );
}
