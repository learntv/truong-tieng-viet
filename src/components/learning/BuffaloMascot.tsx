import { Mascot } from "@/components/Mascot";

export function BuffaloMascot({ xPercent, yPercent }: { xPercent: number; yPercent: number }) {
  return (
    <div
      className="pointer-events-none absolute z-20 -translate-x-1/2 transition-all duration-700 ease-in-out"
      style={{
        left: `${xPercent}%`,
        top: `calc(${yPercent}% - 95px)`,
      }}
    >
      <div className="relative flex flex-col items-center animate-bob">
        <Mascot
          pose="wave"
          size="lg"
          className="drop-shadow-[0_10px_16px_rgba(0,0,0,0.35)]"
        />
      </div>
    </div>
  );
}
