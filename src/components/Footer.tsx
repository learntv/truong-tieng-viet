import { ArrowRight, Facebook, Music2, Twitter, Youtube } from "lucide-react";
import boLogo from "@/assets/uy-ban.png";
import cvcecLogo from "@/assets/cvcec.jpg";
import { Logo } from "@/components/Logo";

const COPYRIGHT_YEAR = 2026;

const SOCIALS = [
  { label: "Facebook", Icon: Facebook },
  { label: "YouTube", Icon: Youtube },
  { label: "Twitter/X", Icon: Twitter },
  { label: "TikTok", Icon: Music2 },
];

export function Footer() {
  return (
    <footer className="bg-maroon-deep text-gold-soft/80">
      <div className="py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Logo size="sm" light />
            <p className="text-sm leading-relaxed text-gold-soft/80">
              Nền tảng học tiếng Việt dành cho trẻ em Việt Nam tiểu học ở trong và ngoài nước.
            </p>
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ label, Icon }) => (
                <a
                  key={label}
                  href="#"
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

          <div>
            <h4 className="mb-4 font-display text-sm font-extrabold text-white">Về chúng tôi</h4>
            <ul className="flex flex-col gap-2.5">
              {["Giới thiệu", "Hướng dẫn sử dụng", "Câu hỏi thường gặp", "Liên hệ"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-gold-soft/80 transition-colors hover:text-gold"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-extrabold text-white">Chính sách</h4>
            <ul className="flex flex-col gap-2.5">
              {["Điều khoản sử dụng", "Chính sách bảo mật", "Chính sách nội dung"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-gold-soft/80 transition-colors hover:text-gold"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-extrabold text-white">
              Kết nối với chúng tôi
            </h4>
            <p className="text-sm leading-relaxed text-gold-soft/80">
              Nhận tin tức và tài liệu mới nhất cho bé yêu của bạn.
            </p>
            <form
              className="mt-4 flex items-center gap-2 rounded-full border border-white/20 py-1 pl-4 pr-1 focus-within:border-gold"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                name="email"
                placeholder="Nhập email của bạn"
                className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-gold-soft/50 focus:outline-none"
              />
              <button
                type="submit"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold text-maroon-deep transition-opacity hover:opacity-90"
              >
                <span className="sr-only">Đăng ký</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 sm:px-6">
          <p className="text-center text-xs text-gold-soft/70">
            © {COPYRIGHT_YEAR} Trường Tiếng Việt Của Em · Embassy of Vietnam in Canada. Tất cả quyền
            được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
