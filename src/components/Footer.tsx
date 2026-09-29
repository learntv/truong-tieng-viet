import { Facebook, Linkedin, MessageCircle, Youtube } from "lucide-react";
import { Link } from "@tanstack/react-router";
import boLogo from "@/assets/uy-ban.png";
import cvcecLogo from "@/assets/cvcec.jpg";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/layout/Container";

const COPYRIGHT_YEAR = 2026;

const SOCIALS = [
  { label: "Facebook", Icon: Facebook, href: "https://facebook.com/cvcec.org" },
  { label: "YouTube", Icon: Youtube, href: "https://youtube.com/@CVCEC2024" },
  { label: "LinkedIn", Icon: Linkedin, href: "https://linkedin.com/company/cvcec/" },
  {
    label: "WhatsApp",
    Icon: MessageCircle,
    href: "https://api.whatsapp.com/send?phone=16478972358",
  },
];

const COLUMNS = [
  {
    title: "Về chúng tôi",
    links: [
      { label: "Giới thiệu", to: "/" },
      { label: "Hướng dẫn sử dụng", to: "/huong-dan-su-dung" },
      { label: "Câu hỏi thường gặp", to: "/cau-hoi-thuong-gap" },
      { label: "Liên hệ", to: "/lien-he" },
    ],
  },
  {
    title: "Học tập",
    links: [
      { label: "Bảng chữ cái", to: "/hoc-tap/bang-chu-cai" },
      { label: "Bài học", to: "/hoc-tap" },
      { label: "Luyện nói", to: "/hoc-tap/luyen-noi" },
      { label: "Bảng xếp hạng", to: "/bang-xep-hang" },
    ],
  },
  {
    title: "Chính sách",
    links: [
      { label: "Điều khoản sử dụng", to: "/dieu-khoan-su-dung" },
      { label: "Chính sách bảo mật", to: "/chinh-sach-bao-mat" },
    ],
  },
];

/** The five stage hues, end to end — the system's signature, used once. */
const STRIPE = ["bg-leaf-500", "bg-sky-500", "bg-grape-500", "bg-coral-500", "bg-rose-500"];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-ink-100 bg-ink-25">
      <div aria-hidden className="flex h-1">
        {STRIPE.map((c) => (
          <span key={c} className={`flex-1 ${c}`} />
        ))}
      </div>

      <Container className="grid gap-12 py-14 lg:grid-cols-[1.4fr_2fr] lg:gap-16">
        <div className="flex flex-col gap-6">
          <Logo variant="wordmark" size="md" className="self-start" />
          <p className="max-w-sm text-sm leading-relaxed text-ink-600">
            Nền tảng học tiếng Việt miễn phí dành cho trẻ em Việt Nam ở trong và ngoài nước.
          </p>
          <ul className="flex items-center gap-2">
            {SOCIALS.map(({ label, Icon, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full border border-ink-100 bg-white text-ink-600 shadow-xs transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-600"
                >
                  <Icon className="size-[1.1rem]" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h2 className="text-label tracking-wide text-ink-900">{col.title}</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-ink-600 transition-colors hover:text-brand-600"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      <div className="border-t border-ink-100">
        <Container className="flex flex-col items-center justify-between gap-5 py-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="text-caption text-ink-500">Đồng hành cùng</span>
            <img
              src={boLogo}
              alt="Ủy ban Nhà nước về người Việt Nam ở nước ngoài – Bộ Ngoại giao"
              className="h-11 w-auto rounded-lg border border-ink-100 bg-white object-contain p-1"
            />
            <img
              src={cvcecLogo}
              alt="CVCEC"
              className="h-11 w-auto rounded-lg border border-ink-100 bg-white object-contain p-1"
            />
          </div>
          <p className="text-caption text-ink-500">
            © {COPYRIGHT_YEAR} Trường Tiếng Việt Của Em. Tất cả quyền được bảo lưu.
          </p>
        </Container>
      </div>
    </footer>
  );
}
