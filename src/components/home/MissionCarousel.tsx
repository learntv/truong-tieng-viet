import pei1 from "@/assets/mission/pei-1.webp";
import pei2 from "@/assets/mission/pei-2.webp";
import pei3 from "@/assets/mission/pei-3.webp";
import pei4 from "@/assets/mission/pei-4.webp";
import toronto1 from "@/assets/mission/toronto-1.webp";
import toronto2 from "@/assets/mission/toronto-2.webp";
import toronto3 from "@/assets/mission/toronto-3.webp";
import toronto4 from "@/assets/mission/toronto-4.webp";
import toronto5 from "@/assets/mission/toronto-5.webp";
import toronto6 from "@/assets/mission/toronto-6.webp";
import toronto7 from "@/assets/mission/toronto-7.webp";

/* The project's class photos, as the classes posted them: each is already a
   framed square carrying the class name and the site's address, so they are
   shown whole rather than cropped. */
const SLIDES = [
  { src: pei1, alt: "Lớp Cô Hà, PEI, Canada: các em làm bài tập tiếng Việt quanh bàn" },
  { src: pei2, alt: "Lớp Cô Hà, PEI, Canada: các em chăm chú viết bài" },
  { src: pei3, alt: "Lớp Cô Hà, PEI, Canada: cả lớp ngồi học quanh bàn dài" },
  { src: pei4, alt: "Lớp Cô Hà, PEI, Canada: giày dép của các em xếp ở cửa lớp" },
  { src: toronto1, alt: "Lớp Cô Trang, Toronto, Canada: cô giáo và các em mặc áo dài trong lớp" },
  { src: toronto2, alt: "Lớp Cô Trang, Toronto, Canada: các em chơi ghép thẻ “Đây là”" },
  { src: toronto3, alt: "Lớp Cô Trang, Toronto, Canada: các em tìm thẻ hình trên bàn" },
  {
    src: toronto4,
    alt: "Lớp Cô Trang, Toronto, Canada: cô giáo, tình nguyện viên và các em chụp ảnh chung",
  },
  { src: toronto5, alt: "Lớp Cô Trang, Toronto, Canada: thẻ từ vựng “Đây là” và lá cờ Việt Nam" },
  { src: toronto6, alt: "Lớp Cô Trang, Toronto, Canada: buổi học tiếng Việt tương tác" },
  { src: toronto7, alt: "Lớp Cô Trang, Toronto, Canada: em bé giơ cao thẻ cờ Việt Nam" },
];

/**
 * A strip of class photos drifting left at a steady pace, forever, like a
 * ticker. The photos are rendered twice in one track and the track slides by
 * half its width (the shared animate-marquee, also behind InfoCarousel), so the
 * end of the first set runs straight into the start of the second with no
 * jump. It never stops, not even on hover. This strip is longer than
 * InfoCarousel's, so it takes its own, slower lap time to drift at a calm pace.
 *
 * The second set is a visual copy only, hidden from screen readers. For people
 * who ask for reduced motion the strip stands still and scrolls by hand.
 *
 * Every tile carries its gap on its right edge (pr) rather than using flex
 * gap, so both halves are exactly the same width and the loop lands on the
 * pixel. The images load eagerly: lazy loading can't see tiles that are
 * clipped off to the side, and they would slide in blank.
 */
export function MissionCarousel() {
  return (
    <div className="overflow-hidden motion-reduce:overflow-x-auto">
      <div className="flex w-max animate-marquee [animation-duration:70s]">
        {[false, true].map((copy) => (
          <ul key={String(copy)} aria-hidden={copy || undefined} className="flex">
            {SLIDES.map((s) => (
              <li key={s.src} className="w-60 shrink-0 pr-3 sm:w-64 sm:pr-4 lg:w-72">
                <img
                  src={s.src}
                  alt={copy ? "" : s.alt}
                  width={720}
                  height={720}
                  decoding="async"
                  className="aspect-square w-full rounded-xl border-[3px] border-white object-cover"
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
