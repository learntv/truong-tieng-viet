import { Facebook, Linkedin, MessageCircle, Youtube } from "lucide-react";
import { Link } from "@tanstack/react-router";
import boLogo from "@/assets/uy-ban.png";
import cvcecLogo from "@/assets/cvcec.jpg";
import { Logo } from "@/components/Logo";

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

const ABOUT_LINKS = [
  { label: "Giới thiệu", to: "/" },
  { label: "Hướng dẫn sử dụng", to: "/huong-dan-su-dung" },
  { label: "Câu hỏi thường gặp", to: "/cau-hoi-thuong-gap" },
  { label: "Liên hệ", to: "/lien-he" },
];

const LEARN_LINKS = [
  { label: "Bảng chữ cái", to: "/hoc-tap/bang-chu-cai" },
  { label: "Bài học", to: "/hoc-tap" },
  { label: "Luyện nói", to: "/hoc-tap/luyen-noi" },
  { label: "Bảng xếp hạng", to: "/bang-xep-hang" },
];

const POLICY_LINKS = [
  { label: "Điều khoản sử dụng", to: "/dieu-khoan-su-dung" },
  { label: "Chính sách bảo mật", to: "/chinh-sach-bao-mat" },
];

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; to: string }[];
}) {
  return (
    <div>
      <h4 className="mb-4 font-display text-sm font-extrabold text-white">{title}</h4>
      <ul className="flex flex-col gap-2.5">
        {links.map(({ label, to }) => (
          <li key={label}>
            <Link
              to={to}
              className="text-sm text-gold-soft/80 transition-colors hover:text-gold"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-maroon-deep text-gold-soft/80">
      <div className="py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-4 sm:px-6 lg:grid-cols-5">
          <div className="col-span-2 flex flex-col gap-4">
            <Logo size="sm" light />
            <p className="max-w-sm text-sm leading-relaxed text-gold-soft/80">
              Nền tảng học tiếng Việt dành cho trẻ em Việt Nam ở trong và ngoài nước.
            </p>
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-gold-soft transition-colors hover:border-gold hover:bg-gold hover:text-maroon-deep"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <img
                src={boLogo}
                alt="Bộ Ngoại giao"
                className="h-16 w-auto rounded-md bg-white/90 object-contain p-1 shadow-sm"
              />
              <img
                src={cvcecLogo}
                alt="CVCEC"
                className="h-16 w-auto rounded-md bg-white/90 object-contain p-1 shadow-sm"
              />
            </div>
          </div>

          <LinkColumn title="Về chúng tôi" links={ABOUT_LINKS} />
          <LinkColumn title="Học tập" links={LEARN_LINKS} />
          <LinkColumn title="Chính sách" links={POLICY_LINKS} />
        </div>
      </div>

      <div className="border-t border-white/15 py-5">
        <div className="mx-auto flex max-w-7xl px-4 sm:px-6">
          <p className="w-full text-center text-xs text-gold-soft/70">
            © {COPYRIGHT_YEAR} Trường Tiếng Việt Của Em. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
