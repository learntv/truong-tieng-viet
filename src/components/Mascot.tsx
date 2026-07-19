import { cn } from "@/lib/utils";
import cheer from "@/assets/mascot/cheer.png";
import crying from "@/assets/mascot/crying.png";
import listening from "@/assets/mascot/listening.png";
import peeking from "@/assets/mascot/peeking.png";
import reading from "@/assets/mascot/reading.png";
import peekingOver from "@/assets/mascot/peeking-over.png";
import thinking from "@/assets/mascot/thinking.png";
import thumbsUp from "@/assets/mascot/thumbs-up.png";
import wave from "@/assets/mascot/wave.png";

// Trâu con, the school mascot. Each pose carries its own alt text so screen
// readers hear what he is doing, not just that he exists.
const POSES = {
  cheer: { src: cheer, alt: "Trâu con reo mừng" },
  crying: { src: crying, alt: "Trâu con đang khóc" },
  listening: { src: listening, alt: "Trâu con đang lắng nghe" },
  peeking: { src: peeking, alt: "Trâu con ló đầu ra" },
  // Cropped flat at the bottom — sits on an edge, so pair it with a container
  // border rather than floating it in open space.
  "peeking-over": { src: peekingOver, alt: "Trâu con ló đầu lên nhìn" },
  reading: { src: reading, alt: "Trâu con đang đọc sách" },
  thinking: { src: thinking, alt: "Trâu con đang suy nghĩ" },
  "thumbs-up": { src: thumbsUp, alt: "Trâu con giơ ngón tay cái" },
  wave: { src: wave, alt: "Trâu con vẫy tay chào" },
} as const;

export type MascotPose = keyof typeof POSES;

const SIZES = {
  sm: "h-16",
  md: "h-24",
  lg: "h-36",
};

export function Mascot({
  pose,
  size = "md",
  bob = false,
  decorative = false,
  className,
}: {
  pose: MascotPose;
  size?: keyof typeof SIZES;
  bob?: boolean;
  /** Set when nearby text already says what the mascot conveys. */
  decorative?: boolean;
  className?: string;
}) {
  const { src, alt } = POSES[pose];
  return (
    <img
      src={src}
      alt={decorative ? "" : alt}
      aria-hidden={decorative || undefined}
      className={cn("w-auto shrink-0 object-contain", SIZES[size], bob && "animate-bob", className)}
    />
  );
}
