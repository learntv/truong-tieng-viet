import { Facebook, Youtube, Twitter, Music2, Send } from "lucide-react";
import boLogo from "@/assets/uy-ban.png";
import cvcecLogo from "@/assets/cvcec.jpg";

const COPYRIGHT_YEAR = 2026;

export function Footer() {
  return (
    <footer className="mt-8 bg-navy text-white/70">
      <div className="airmail-stripe h-1.5 w-full" aria-hidden />
      <div className="py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-white shadow-card">
                <span className="text-lg">★</span>
              </div>
              <div className="leading-tight">
                <div className="font-display text-sm font-extrabold text-white leading-none">
                  Trường Tiếng Việt
                </div>
                <div className="font-display text-sm font-extrabold text-white/85 leading-none">
                  Của Em
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/60">
              Nền tảng học tiếng Việt dành cho trẻ em Việt Nam tiểu học ở trong và ngoài nước.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/80 transition-transform hover:scale-110 hover:bg-white/20"
              >
                <Facebook className="h-4 w-4" strokeWidth={2} />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/80 transition-transform hover:scale-110 hover:bg-white/20"
              >
                <Youtube className="h-4 w-4" strokeWidth={2} />
              </a>
              <a
                href="#"
                aria-label="Twitter/X"
                className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/80 transition-transform hover:scale-110 hover:bg-white/20"
              >
                <Twitter className="h-4 w-4" strokeWidth={2} />
              </a>
              <a
                href="#"
                aria-label="TikTok"
                className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/80 transition-transform hover:scale-110 hover:bg-white/20"
              >
                <Music2 className="h-4 w-4" strokeWidth={2} />
              </a>
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
                  <a href="#" className="text-sm text-white/60 transition-colors hover:text-white">
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
                  <a href="#" className="text-sm text-white/60 transition-colors hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-display text-sm font-extrabold text-white">
              Kết nối với chúng tôi
            </h4>
            <p className="mb-4 text-sm text-white/60">
              Nhận tin tức và tài liệu mới nhất cho bé yêu của bạn.
            </p>
            <div className="flex flex-col gap-2 lg:flex-row">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none lg:flex-1"
              />
              <button className="flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white transition-all hover:bg-primary/90">
                <Send className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span>Đăng ký</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 sm:px-6">
          <p className="text-center text-xs text-white/50">
            © {COPYRIGHT_YEAR} Trường Tiếng Việt Của Em · Embassy of Vietnam in Canada. Tất cả quyền
            được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
