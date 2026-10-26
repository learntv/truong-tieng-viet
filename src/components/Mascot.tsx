import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import cheer from "@/assets/mascot/cheer.png";
import crying from "@/assets/mascot/crying.png";
import flying from "@/assets/mascot/flying.png";
import hiking from "@/assets/mascot/hiking.png";
import listening from "@/assets/mascot/listening.png";
import peeking from "@/assets/mascot/peeking.png";
import reading from "@/assets/mascot/reading.png";
import readingSitting from "@/assets/mascot/reading-sitting.png";
import peekingOver from "@/assets/mascot/peeking-over.png";
import thinking from "@/assets/mascot/thinking.png";
import thumbsUp from "@/assets/mascot/thumbs-up.png";
import wave from "@/assets/mascot/wave.png";

// Trâu con, the school mascot. Each pose carries its own alt text so screen
// readers hear what he is doing, not just that he exists.
const POSES = {
  cheer: { src: cheer, alt: m.learn_mascot_cheer },
  crying: { src: crying, alt: m.learn_mascot_crying },
  flying: { src: flying, alt: m.learn_mascot_flying },
  hiking: { src: hiking, alt: m.learn_mascot_hiking },
  listening: { src: listening, alt: m.learn_mascot_listening },
  peeking: { src: peeking, alt: m.learn_mascot_peeking },
  // Cropped flat at the bottom — sits on an edge, so pair it with a container
  // border rather than floating it in open space.
  "peeking-over": { src: peekingOver, alt: m.learn_mascot_peeking_over },
  reading: { src: reading, alt: m.learn_mascot_reading },
  "reading-sitting": { src: readingSitting, alt: m.learn_mascot_reading_sitting },
  thinking: { src: thinking, alt: m.learn_mascot_thinking },
  "thumbs-up": { src: thumbsUp, alt: m.learn_mascot_thumbs_up },
  wave: { src: wave, alt: m.learn_mascot_wave },
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
      alt={decorative ? "" : alt()}
      aria-hidden={decorative || undefined}
      className={cn("w-auto shrink-0 object-contain", SIZES[size], bob && "animate-bob", className)}
    />
  );
}
