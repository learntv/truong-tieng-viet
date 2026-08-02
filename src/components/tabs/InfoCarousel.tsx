import banDoVietNam from "@/assets/ban-do-viet-nam.jpg";
import congVienChuCai from "@/assets/cong-vien-chu-cai.jpg";
import kidsAoDai from "@/assets/kids-aodai.jpg";
import heroStudents from "@/assets/hero-students-fullwidth.jpg";

/**
 * Slides: the two illustrations first — the journey map and the alphabet park —
 * then the photographs of children.
 */
const SLIDES = [
  {
    src: banDoVietNam,
    alt: "Bản đồ Việt Nam với Trâu con đội nón lá và các điểm đến Hà Nội, Vịnh Hạ Long, Hội An, Nha Trang, TP. Hồ Chí Minh",
  },
  {
    src: congVienChuCai,
    alt: "Công viên chữ cái: các chữ cái tiếng Việt vui chơi bên chùa, ruộng lúa và rồng giấy",
  },
  { src: kidsAoDai, alt: "Trẻ em Việt Nam trong tà áo dài cùng đọc sách Tiếng Việt" },
  { src: heroStudents, alt: "Học sinh Trường Tiếng Việt Của Em trong giờ học" },];

/**
 * Auto-scrolling picture strip under the hero.
 *
 * CSS-only: the track holds the slides twice and animates to -50%, so the
 * second copy arrives exactly where the first started and the loop is
 * seamless — no JS, no timers, nothing to clean up. `animate-marquee` (in
 * styles.css) drops the animation entirely under prefers-reduced-motion.
 */
export function InfoCarousel() {
  return (
    <section
      id="hinh-anh"
      aria-label="Hình ảnh Việt Nam và các bạn nhỏ"
      // pt keeps the slides clear of the fold: the hero's bottom edge sits just
      // above it, and without this padding the top of the strip peeks through.
      className="w-full overflow-hidden pt-8 pb-8 sm:pb-12"
    >
      {/* Fades the strip into the page background at both edges so slides
        enter and leave rather than being cut off mid-frame. */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent sm:w-24"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent sm:w-24"
        />

        <div className="flex w-max animate-marquee gap-4 sm:gap-5">
          {/* Second pass is presentational duplication — hidden from the
            accessibility tree so the images aren't announced twice. */}
          {[false, true].map((isClone) =>
            SLIDES.map((slide, i) => (
              <figure
                key={`${isClone ? "clone" : "orig"}-${i}`}
                aria-hidden={isClone || undefined}
                className="relative h-48 w-72 shrink-0 overflow-hidden rounded-none border border-border/60 shadow-card sm:h-64 sm:w-[26rem]"
              >
                <img
                  src={slide.src}
                  alt={isClone ? "" : slide.alt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </figure>
            )),
          )}
        </div>
      </div>
    </section>
  );
}
