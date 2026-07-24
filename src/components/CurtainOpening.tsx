import { useEffect, useState } from "react";

/**
 * Grand-opening theatrical curtain. Two full-screen velvet panels start closed
 * over the homepage; the visitor clicks to part them to the sides, then the
 * overlay unmounts so it never blocks pointer events afterwards. Shown on every
 * visit — a deliberate "open the curtain" ceremony for the launch.
 *
 * The velvet look is pure CSS: a base maroon gradient plus a repeating vertical
 * gradient for the fabric folds, and a gold gradient valance/hem so the reveal
 * reads as a stage curtain rather than two sliding blocks.
 */
export function CurtainOpening() {
  const [phase, setPhase] = useState<"hidden" | "closed" | "open">("hidden");

  useEffect(() => {
    // Private one-shot gate: the curtain shows only on a visit carrying
    // ?curtain=1. It is not persisted — reloading without the param shows
    // nothing, and no other visitor ever sees it. To view it again, add
    // ?curtain=1 to the URL again.
    const params = new URLSearchParams(window.location.search);
    const show = params.get("curtain") === "1";

    // Wipe the ?curtain param from the address bar / history immediately so it
    // never lingers in the URL for anyone to see.
    if (params.has("curtain")) {
      params.delete("curtain");
      const query = params.toString();
      window.history.replaceState(
        {},
        "",
        window.location.pathname + (query ? `?${query}` : "") + window.location.hash,
      );
    }

    if (!show) return;

    // ?curtain=1 also re-arms the learning-map tutorial: clearing its "seen"
    // flag makes the three-step overlay show again next time the map opens.
    try {
      localStorage.removeItem("vui-hoc-map-tutorial-seen");
    } catch {
      // localStorage unavailable — nothing to clear
    }

    // Mount closed after hydration so the server renders nothing (no flash) and
    // the closed→open transition is driven purely by the click.
    setPhase("closed");
  }, []);

  if (phase === "hidden") return null;

  const isOpen = phase === "open";

  return (
    <div
      className="fixed inset-0 z-[9999] flex overflow-hidden"
      style={{ pointerEvents: isOpen ? "none" : "auto", cursor: isOpen ? "default" : "pointer" }}
      role="button"
      tabIndex={isOpen ? -1 : 0}
      aria-label="Vén màn khai trương"
      onClick={() => setPhase("open")}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setPhase("open");
        }
      }}
      // Remove from the DOM once the curtains have fully slid away.
      onTransitionEnd={() => {
        if (isOpen) setPhase("hidden");
      }}
    >
      <CurtainPanel side="left" open={isOpen} />
      <CurtainPanel side="right" open={isOpen} />
      {!isOpen && (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-6 text-center">
          {/* gold ornamental rule above the title */}
          <span
            className="h-px w-40 md:w-56"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--gold), transparent)",
            }}
          />
          <h1
            className="font-bold leading-tight tracking-wide"
            style={{
              fontSize: "clamp(2.25rem, 7vw, 5rem)",
              color: "var(--gold-soft)",
              backgroundImage:
                "linear-gradient(180deg, var(--gold-soft) 0%, var(--gold) 55%, #b8860b 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 2px 18px rgba(0,0,0,0.55)",
              filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.5))",
            }}
          >
            Trường Tiếng Việt
            <br />
            Của Em
          </h1>
          <span
            className="h-px w-40 md:w-56"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--gold), transparent)",
            }}
          />
          <span
            className="mt-2 animate-pulse text-base font-medium tracking-widest md:text-lg"
            style={{ color: "var(--gold)", opacity: 0.9 }}
          >
            CHẠM ĐỂ VÉN MÀN
          </span>
        </div>
      )}
    </div>
  );
}

function CurtainPanel({ side, open }: { side: "left" | "right"; open: boolean }) {
  const isLeft = side === "left";

  // Soft vertical pleats: a triangle-wave repeating gradient makes each pleat
  // brighten toward its crest and fall into a dark valley, with no hard seams.
  // A second, wider gradient adds gentle bunching so the folds aren't uniform.
  const pleats = `
    repeating-linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.55) 0px,
      rgba(0, 0, 0, 0.10) 26px,
      rgba(255, 180, 150, 0.22) 52px,
      rgba(0, 0, 0, 0.10) 78px,
      rgba(0, 0, 0, 0.55) 104px
    )`;
  const bunching = `
    repeating-linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.18) 0px,
      rgba(0, 0, 0, 0) 160px,
      rgba(0, 0, 0, 0.18) 320px
    )`;
  const sheen = `
    linear-gradient(
      ${isLeft ? "100deg" : "260deg"},
      rgba(0, 0, 0, 0.35) 0%,
      rgba(0, 0, 0, 0) 40%,
      rgba(255, 120, 120, 0.10) 78%,
      rgba(0, 0, 0, 0.28) 100%
    )`;
  const base = `
    linear-gradient(
      180deg,
      #7a0000 0%,
      #9a0004 30%,
      #b60006 60%,
      #7c0000 100%
    )`;

  return (
    <div
      className="relative h-full w-1/2"
      style={{
        transform: open
          ? `translateX(${isLeft ? "-100%" : "100%"})`
          : "translateX(0)",
        transition: "transform 1900ms cubic-bezier(0.66, 0, 0.24, 1)",
        backgroundColor: "#8a0003",
        backgroundImage: `${sheen}, ${pleats}, ${bunching}, ${base}`,
        backgroundBlendMode: "overlay, soft-light, multiply, normal",
        boxShadow: isLeft
          ? "inset -60px 0 90px rgba(0,0,0,0.5)"
          : "inset 60px 0 90px rgba(0,0,0,0.5)",
      }}
    >
      {/* draped scalloped valance with a gold hem */}
      <div className="absolute inset-x-0 top-0 h-20 md:h-28" style={{ overflow: "hidden" }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `${pleats}, ${base}`,
            backgroundBlendMode: "soft-light, normal",
            boxShadow: "inset 0 -18px 30px rgba(0,0,0,0.55)",
            // scalloped bottom edge
            maskImage:
              "radial-gradient(28px 22px at 28px 100%, transparent 98%, black 100%)",
            WebkitMaskImage:
              "radial-gradient(28px 22px at 28px 100%, transparent 98%, black 100%)",
            maskRepeat: "repeat-x",
            WebkitMaskRepeat: "repeat-x",
            maskSize: "56px 100%",
            WebkitMaskSize: "56px 100%",
          }}
        />
        {/* gold trim line across the valance */}
        <div
          className="absolute inset-x-0 top-0 h-2"
          style={{
            backgroundImage:
              "linear-gradient(180deg, var(--gold-soft), var(--gold))",
            boxShadow: "0 1px 6px rgba(255,212,0,0.5)",
          }}
        />
      </div>

      {/* darker gather where the two panels meet in the middle */}
      <div
        className={`absolute top-0 ${isLeft ? "right-0" : "left-0"} h-full w-24`}
        style={{
          backgroundImage: `linear-gradient(${
            isLeft ? "270deg" : "90deg"
          }, rgba(0,0,0,0.6), rgba(0,0,0,0))`,
        }}
      />
    </div>
  );
}
