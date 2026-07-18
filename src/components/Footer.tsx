import boLogo from "@/assets/uy-ban.png";
import cvcecLogo from "@/assets/cvcec.jpg";
import { Logo } from "@/components/Logo";

const COPYRIGHT_YEAR = 2026;

export function Footer() {
  return (
    <footer className="mt-8 bg-navy text-white/70">
      <div className="py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            <Logo size="sm" light />
            <p className="text-sm leading-relaxed text-white/60">
              Nền tảng học tiếng Việt dành cho trẻ em Việt Nam tiểu học ở trong và ngoài nước.
            </p>
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
