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
import { useT, type Messages } from "@/i18n";

/* The project's class photos, as the classes posted them: each is already a
   framed square carrying the class name and the site's address, so they are
   shown whole rather than cropped. */
const SLIDES: { src: string; alt: keyof Messages["home"]["mission"]["slides"] }[] = [
  { src: pei1, alt: "pei1" },
  { src: pei2, alt: "pei2" },
  { src: pei3, alt: "pei3" },
  { src: pei4, alt: "pei4" },
  { src: toronto1, alt: "toronto1" },
  { src: toronto2, alt: "toronto2" },
  { src: toronto3, alt: "toronto3" },
  { src: toronto4, alt: "toronto4" },
  { src: toronto5, alt: "toronto5" },
  { src: toronto6, alt: "toronto6" },
  { src: toronto7, alt: "toronto7" },
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
  const t = useT();
  return (
    <div className="overflow-hidden motion-reduce:overflow-x-auto">
      <div className="flex w-max animate-marquee [animation-duration:70s]">
        {[false, true].map((copy) => (
          <ul key={String(copy)} aria-hidden={copy || undefined} className="flex">
            {SLIDES.map((s) => (
              <li key={s.src} className="w-60 shrink-0 pr-3 sm:w-64 sm:pr-4 lg:w-72">
                <img
                  src={s.src}
                  alt={copy ? "" : t.home.mission.slides[s.alt]}
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
