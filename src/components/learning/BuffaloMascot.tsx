import trauConAsset from "@/assets/trau-con.png";

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
        <img
          src={trauConAsset}
          alt="Trâu con đội nón lá"
          className="h-36 w-36 object-contain drop-shadow-[0_10px_16px_rgba(0,0,0,0.35)]"
        />
      </div>
    </div>
  );
}
