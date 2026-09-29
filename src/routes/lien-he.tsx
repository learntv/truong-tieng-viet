import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Facebook,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Youtube,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/layout/Container";

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

const CHANNEL_HUES = [
  "bg-brand-50 text-brand-600",
  "bg-leaf-50 text-leaf-600",
  "bg-coral-50 text-coral-600",
];

function Contact() {
  return (
    <>
      <PageHeader
        icon={Mail}
        hue="sky"
        title="Liên hệ"
        lede="Chúng tôi luôn sẵn lòng lắng nghe và hỗ trợ bạn."
        width="content"
      >
        <p className="max-w-xl text-ink-600">
          Trường Tiếng Việt Của Em được vận hành bởi{" "}
          <a href="https://www.cvcec.org/" target="_blank" rel="noreferrer" className="link-inline">
            Canada Vietnam Cultural &amp; Educational Council (CVCEC)
          </a>
          . Nếu bạn có câu hỏi, góp ý hoặc mong muốn hợp tác, hãy liên hệ với chúng tôi qua các kênh
          dưới đây.
        </p>
      </PageHeader>

      <Container width="content" className="pb-20">
        <ul className="grid gap-4 md:grid-cols-3">
          {CHANNELS.map(({ Icon, label, value, href }, i) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                className="group flex h-full flex-col gap-5 rounded-3xl border border-ink-100 bg-white p-6 shadow-xs transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
              >
                <span
                  className={`grid size-12 place-items-center rounded-2xl ${CHANNEL_HUES[i % CHANNEL_HUES.length]}`}
                >
                  <Icon className="size-6" aria-hidden />
                </span>
                <span>
                  <span className="block text-label text-ink-500">{label}</span>
                  <span className="mt-1 block font-semibold break-words text-ink-900 group-hover:text-brand-700">
                    {value}
                  </span>
                </span>
                <ArrowUpRight
                  className="mt-auto size-5 text-ink-300 transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-600"
                  aria-hidden
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-h3 text-ink-900">Theo dõi chúng tôi</h2>
          <ul className="flex items-center gap-3">
            {SOCIALS.map(({ Icon, label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-ink-100 bg-white px-4 text-sm font-semibold text-ink-700 shadow-xs transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700"
                >
                  <Icon className="size-4" aria-hidden />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </>
  );
}
