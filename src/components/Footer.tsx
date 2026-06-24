import { Facebook, Youtube, Twitter, Music2, Send } from "lucide-react";
import boLogo from "@/assets/uy-ban.png";
import cvcecLogo from "@/assets/cvcec.jpg";

const COPYRIGHT_YEAR = 2026;

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="bg-[oklch(0.98_0.008_75)] py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary shadow-card">
                <span className="text-lg">📖</span>
              </div>
              <div className="leading-tight">
                <div className="font-display text-sm font-extrabold text-primary leading-none">Trường Tiếng Việt</div>
                <div className="font-display text-sm font-extrabold text-navy leading-none">Của Em</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Nền tảng học tiếng Việt dành cho trẻ em Việt Nam tiêu học ở trong và ngoài nước.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="Facebook" className="grid h-8 w-8 place-items-center rounded-full bg-white shadow-card transition-transform hover:scale-110 hover:shadow-md text-[#1877F2]">
                <Facebook className="h-4 w-4" strokeWidth={2} />
              </a>
              <a href="#" aria-label="YouTube" className="grid h-8 w-8 place-items-center rounded-full bg-white shadow-card transition-transform hover:scale-110 hover:shadow-md text-[#FF0000]">
                <Youtube className="h-4 w-4" strokeWidth={2} />
              </a>
              <a href="#" aria-label="Twitter/X" className="grid h-8 w-8 place-items-center rounded-full bg-white shadow-card transition-transform hover:scale-110 hover:shadow-md text-foreground">
                <Twitter className="h-4 w-4" strokeWidth={2} />
              </a>
              <a href="#" aria-label="TikTok" className="grid h-8 w-8 place-items-center rounded-full bg-white shadow-card transition-transform hover:scale-110 hover:shadow-md text-foreground">
                <Music2 className="h-4 w-4" strokeWidth={2} />
              </a>
            </div>
            <div className="flex items-center gap-3">
              <img src={boLogo} alt="Bộ Ngoại giao" className="h-16 w-auto rounded-md object-contain shadow-sm" />
              <img src={cvcecLogo} alt="CVCEC" className="h-16 w-auto rounded-md object-contain shadow-sm" />
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-extrabold text-navy">Về chúng tôi</h4>
            <ul className="flex flex-col gap-2.5">
              {["Giới thiệu", "Hướng dẫn sử dụng", "Câu hỏi thường gặp", "Liên hệ"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-extrabold text-navy">Chính sách</h4>
            <ul className="flex flex-col gap-2.5">
              {["Điều khoản sử dụng", "Chính sách bảo mật", "Chính sách nội dung"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-display text-sm font-extrabold text-navy">Kết nối với chúng tôi</h4>
            <p className="mb-4 text-sm text-muted-foreground">
              Nhận tin tức và tài liệu mới nhất cho bé yêu của bạn.
            </p>
            <div className="flex flex-col gap-2 lg:flex-row">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="w-full rounded-full border border-border bg-white px-4 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none lg:flex-1"
              />
              <button className="flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white transition-all hover:bg-primary/90">
                <Send className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span>Đăng ký</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 sm:px-6">
          <p className="text-center text-xs text-muted-foreground">
            © {COPYRIGHT_YEAR} Trường Tiếng Việt Của Em. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
