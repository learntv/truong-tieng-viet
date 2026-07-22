import { createFileRoute } from "@tanstack/react-router";
import { Facebook, Linkedin, Mail, MapPin, MessageCircle, Youtube } from "lucide-react";
import { PageBanner } from "@/components/site/PageBanner";

export const Route = createFileRoute("/lien-he")({
  head: () => ({
    meta: [
      { title: "Liên hệ — Trường Tiếng Việt Của Em" },
      {
        name: "description",
        content:
          "Liên hệ với Trường Tiếng Việt Của Em và Canada Vietnam Cultural & Educational Council (CVCEC) qua email, WhatsApp, mạng xã hội hoặc địa chỉ tại Toronto, Canada.",
      },
      { property: "og:title", content: "Liên hệ — Trường Tiếng Việt Của Em" },
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
    Icon: Mail,
    label: "Email",
    value: "contact@cvcec.org",
    href: "mailto:contact@cvcec.org",
  },
  {
    Icon: MessageCircle,
    label: "WhatsApp",
    value: "+1 647-897-2358",
    href: "https://api.whatsapp.com/send?phone=16478972358",
  },
  {
    Icon: MapPin,
    label: "Địa chỉ",
    value: "192 Spadina Ave., Toronto, ON M5T 2C2, Canada",
    href: "https://maps.google.com/?q=192+Spadina+Ave,+Toronto,+ON+M5T+2C2",
  },
];

const SOCIALS = [
  { Icon: Facebook, label: "Facebook", href: "https://facebook.com/cvcec.org" },
  { Icon: Youtube, label: "YouTube", href: "https://youtube.com/@CVCEC2024" },
  { Icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/cvcec/" },
];

function Contact() {
  return (
    <main>
      <PageBanner
        title="Liên hệ"
        subtitle="Chúng tôi luôn sẵn lòng lắng nghe và hỗ trợ bạn."
      />

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
          {CHANNELS.map(({ Icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {label}
                </span>
                <span className="font-display font-extrabold text-foreground">{value}</span>
              </span>
            </a>
          ))}
        </div>

        <h2 className="mb-4 mt-10 font-display text-xl font-extrabold text-foreground">
          Theo dõi chúng tôi
        </h2>
        <div className="flex items-center gap-3">
          {SOCIALS.map(({ Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="grid h-11 w-11 place-items-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-white"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
