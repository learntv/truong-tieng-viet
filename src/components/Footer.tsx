import { Icon } from "@iconify/react";
import roundFacebook from "@iconify-icons/ic/round-facebook";
import roundWhatsapp from "@iconify-icons/ic/round-whatsapp";
import mdiLinkedin from "@iconify-icons/mdi/linkedin";
import mdiYoutube from "@iconify-icons/mdi/youtube";
import { Link } from "@tanstack/react-router";
import boLogo from "@/assets/uy-ban.png";
import cvcecLogo from "@/assets/cvcec.jpg";
import { Logo } from "@/components/Logo";
import { m } from "@/paraglide/messages";

const COPYRIGHT_YEAR = 2026;

const SOCIALS = [
  { label: "Facebook", icon: roundFacebook, href: "https://facebook.com/cvcec.org" },
  { label: "YouTube", icon: mdiYoutube, href: "https://youtube.com/@CVCEC2024" },
  { label: "LinkedIn", icon: mdiLinkedin, href: "https://linkedin.com/company/cvcec/" },
  {
    label: "WhatsApp",
    icon: roundWhatsapp,
    href: "https://api.whatsapp.com/send?phone=16478972358",
  },
];

type FooterLink = { label: () => string; to: string };

const ABOUT_LINKS: FooterLink[] = [
  { label: m.footer_about_intro, to: "/" },
  { label: m.footer_about_guide, to: "/huong-dan-su-dung" },
  { label: m.footer_about_faq, to: "/cau-hoi-thuong-gap" },
  { label: m.footer_about_contact, to: "/lien-he" },
];

const LEARN_LINKS: FooterLink[] = [
  { label: m.footer_learn_alphabet, to: "/hoc-tap/bang-chu-cai" },
  { label: m.footer_learn_lessons, to: "/hoc-tap" },
  { label: m.footer_learn_speaking, to: "/hoc-tap/luyen-noi" },
  { label: m.footer_learn_leaderboard, to: "/bang-xep-hang" },
];

const POLICY_LINKS: FooterLink[] = [
  { label: m.footer_policy_terms, to: "/dieu-khoan-su-dung" },
  { label: m.footer_policy_privacy, to: "/chinh-sach-bao-mat" },
];

function LinkColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h4 className="mb-4 font-display text-sm font-bold text-grass-ink">{title}</h4>
      <ul className="flex flex-col gap-2.5">
        {links.map(({ label, to }) => (
          <li key={to}>
            <Link
              to={to}
              className="text-sm text-grass-ink-soft transition-colors hover:text-indigo-deep"
            >
              {label()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    // Flat --grass, the exact colour the home page's hills end on, so the
    // footer is the same meadow running to the bottom of the page with no seam
    // and no fade. The field stays light, so the type is dark green, not white.
    <footer className="bg-grass text-grass-ink-soft">
      <div className="py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-4 sm:px-6 lg:grid-cols-5">
          <div className="col-span-2 flex flex-col gap-4">
            {/* The wordmark art, not the token lockup — its own colours read on
              the grass, where the lockup's red-on-green would not. */}
            <Logo size="sm" variant="wordmark" />
            <p className="max-w-sm text-sm leading-relaxed text-grass-ink-soft">
              {m.footer_tagline()}
            </p>
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ label, icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border-2 border-grass-ink/35 text-grass-ink transition-colors hover:border-grass-ink hover:bg-grass-ink hover:text-white"
                >
                  <Icon icon={icon} className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <img
                src={boLogo}
                alt={m.footer_ministry_logo_alt()}
                className="h-16 w-auto rounded-md bg-white/90 object-contain p-1 shadow-sm"
              />
              <img
                src={cvcecLogo}
                alt="CVCEC"
                className="h-16 w-auto rounded-md bg-white/90 object-contain p-1 shadow-sm"
              />
            </div>
          </div>

          <LinkColumn title={m.footer_about()} links={ABOUT_LINKS} />
          <LinkColumn title={m.footer_learn()} links={LEARN_LINKS} />
          <LinkColumn title={m.footer_policy()} links={POLICY_LINKS} />
        </div>
      </div>

      <div className="border-t border-grass-ink/20 py-5">
        <div className="mx-auto flex max-w-7xl px-4 sm:px-6">
          <p className="w-full text-center text-xs text-grass-ink-soft">
            {m.footer_copyright({ year: COPYRIGHT_YEAR })}
          </p>
        </div>
      </div>
    </footer>
  );
}
