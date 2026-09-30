import kmdCover from "@/assets/hoc-tap-thumb-khai-minh-duc-cutout.webp";

/**
 * Every lesson shares one preview image for now (the CMS has no per-bài artwork
 * yet), so the lessons are told apart by the tone behind it, cycled by the
 * lesson's position. The list and the lesson page both key off that position,
 * so a lesson keeps its colour when you open it.
 */
const THUMB_BG = [
  "bg-box-pink",
  "bg-box-mint",
  "bg-box-ice",
  "bg-box-peach",
  "bg-box-lavender",
  "bg-box-cream",
] as const;

export function KmdThumb({ index, className = "" }: { index: number; className?: string }) {
  return (
    <div
      className={[
        "aspect-[600/385] shrink-0 overflow-hidden rounded-xl",
        THUMB_BG[index % THUMB_BG.length],
        className,
      ].join(" ")}
    >
      <img
        src={kmdCover}
        alt=""
        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
      />
    </div>
  );
}
