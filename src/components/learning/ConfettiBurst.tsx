import { useEffect } from "react";

type Particle = {
  dx: string;
  dy: string;
  color: string;
  delay: string;
  rounded: string;
  size: string;
};

const COLORS = [
  "oklch(0.52 0.22 22)",  // primary
  "oklch(0.87 0.16 75)",  // yellow
  "oklch(0.75 0.17 5)",   // pink
  "oklch(0.68 0.13 295)", // purple
  "oklch(0.72 0.17 150)", // green
  "oklch(0.65 0.18 220)", // sky
];

const PARTICLES: Particle[] = Array.from({ length: 28 }, (_, i) => {
  const angle = (i / 28) * 360 + (i % 3) * 15;
  const radius = 90 + (i % 5) * 22;
  const rad = (angle * Math.PI) / 180;
  const dx = Math.round(radius * Math.cos(rad));
  const dy = Math.round(radius * Math.sin(rad));
  return {
    dx: `${dx}px`,
    dy: `${dy}px`,
    color: COLORS[i % COLORS.length],
    delay: `${Math.round((i % 7) * 30)}ms`,
    rounded: i % 3 === 0 ? "rounded-full" : "rounded-sm",
    size: i % 2 === 0 ? "h-2 w-2" : "h-1.5 w-3",
  };
});

export function ConfettiBurst({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1700);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className={`absolute animate-confetti ${p.rounded} ${p.size}`}
          style={
            {
              left: "50%",
              top: "50%",
              background: p.color,
              "--dx": p.dx,
              "--dy": p.dy,
              animationDelay: p.delay,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
