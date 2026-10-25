import { createFileRoute } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import roundFacebook from "@iconify-icons/ic/round-facebook";
import mdiLinkedin from "@iconify-icons/mdi/linkedin";
import roundMail from "@iconify-icons/ic/round-mail";
import roundPlace from "@iconify-icons/ic/round-place";
import roundWhatsapp from "@iconify-icons/ic/round-whatsapp";
import mdiYoutube from "@iconify-icons/mdi/youtube";
import { PageBanner } from "@/components/site/PageBanner";

export const Route = createFileRoute("/lien-he")({
  head: () => ({
    meta: [
      { title: "Liên hệ | Trường Tiếng Việt Của Em" },
      {
        name: "description",
        content:
          "Liên hệ với Trường Tiếng Việt Của Em và Canada Vietnam Cultural & Educational Council (CVCEC) qua email, WhatsApp, mạng xã hội hoặc địa chỉ tại Toronto, Canada.",
      },
      { property: "og:title", content: "Liên hệ | Trường Tiếng Việt Của Em" },
      {
        property: "og:description",
        content: "Kết nối với chúng tôi qua email, WhatsApp, mạng xã hội hoặc địa chỉ tại Toronto.",
      },
      { property: "og:url", content: "/lien-he" },
    ],
    links: [{ rel: "canonical", href: "/lien-he" }],
  }),
  component: Contact,
});

const CHANNELS = [
  {
    icon: roundMail,
    label: "Email",
    value: "contact@cvcec.org",
    href: "mailto:contact@cvcec.org",
  },
  {
    icon: roundWhatsapp,
    label: "WhatsApp",
    value: "+1 647-897-2358",
    href: "https://api.whatsapp.com/send?phone=16478972358",
  },
  {
    icon: roundPlace,
    label: "Địa chỉ",
    value: "192 Spadina Ave., Toronto, ON M5T 2C2, Canada",
    href: "https://maps.google.com/?q=192+Spadina+Ave,+Toronto,+ON+M5T+2C2",
  },
];

const SOCIALS = [
  { icon: roundFacebook, label: "Facebook", href: "https://facebook.com/cvcec.org" },
  { icon: mdiYoutube, label: "YouTube", href: "https://youtube.com/@CVCEC2024" },
  { icon: mdiLinkedin, label: "LinkedIn", href: "https://linkedin.com/company/cvcec/" },
];

function Contact() {
  return (
    <main>
      <PageBanner title="Liên hệ" />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="mb-10 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Trường Tiếng Việt Của Em được vận hành bởi{" "}
          <a
            href="https://www.cvcec.org/"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-primary underline underline-offset-2"
          >
            Canada Vietnam Cultural &amp; Educational Council (CVCEC)
          </a>
          . Nếu bạn có câu hỏi, góp ý hoặc mong muốn hợp tác, hãy liên hệ với chúng tôi qua các
          kênh dưới đây.
        </p>

        <div className="flex flex-col gap-3">
          {CHANNELS.map(({ icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <Icon icon={icon} className="h-5 w-5" aria-hidden />
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {label}
                </span>
                <span className="font-display font-semibold text-foreground">{value}</span>
              </span>
            </a>
          ))}
        </div>

        <h2 className="mb-4 mt-10 font-display text-xl font-bold text-foreground">
          Theo dõi chúng tôi
        </h2>
        <div className="flex items-center gap-3">
          {SOCIALS.map(({ icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="grid h-11 w-11 place-items-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-white"
            >
              <Icon icon={icon} className="h-5 w-5" aria-hidden />
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
