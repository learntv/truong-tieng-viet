import type { CSSProperties, ReactNode } from "react";

/**
 * One painted scene per idiom, drawing the words at face value: the frog
 * really is at the bottom of the well, the duck really is getting a ladle of
 * water on its head. The joke of the literal picture is what makes the real
 * meaning stick.
 *
 * Every scene shares a 240×160 canvas and is painted flat: no outlines, only
 * fills. Where two shapes of a character overlap, a shade apart keeps them
 * apart (the far legs a step darker, the head a step lighter than the body),
 * and only the faces are drawn in ink. A few small loops from the
 * animate-idiom-* utilities in styles.css bring each one to life. Looping
 * pieces use negative delays, so a scene held still on its card (see
 * `idiom-card`) still shows its notes and drops mid-flight rather than not at all.
 */

const INK = "#24364a";

type AnimStyle = CSSProperties & { "--dx"?: string; "--fall"?: string };

export function IdiomArt({
  id,
  label,
  className,
}: {
  id: string;
  /** Set when the picture should be announced; left out it is decorative. */
  label?: string;
  className?: string;
}) {
  const Scene = SCENES[id];
  if (!Scene) return null;
  return (
    <svg
      viewBox="0 0 240 160"
      preserveAspectRatio="xMidYMid slice"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
    >
      <Scene />
    </svg>
  );
}

/* ── Shared pieces ─────────────────────────────────────────────────────── */

function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#fff">
      <circle cx="-12" cy="2" r="8" />
      <circle cx="0" cy="-3" r="11" />
      <circle cx="13" cy="2" r="8" />
      <rect x="-20" y="2" width="41" height="8" rx="4" />
    </g>
  );
}

function Tree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-2.5" y="0" width="5" height="14" rx="1.5" fill="#8b5a2b" />
      <circle cx="0" cy="-4" r="11" fill="#4fae5a" />
      <circle cx="-6" cy="2" r="7" fill="#5fc06a" />
      <circle cx="6" cy="1" r="7" fill="#46a052" />
    </g>
  );
}

/** Five round petals around a centre, like PageBanner's meadow flowers. */
function Blossom({
  x,
  y,
  r = 4,
  petal,
  heart = "#f28c28",
}: {
  x: number;
  y: number;
  r?: number;
  petal: string;
  heart?: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((deg) => (
        <circle key={deg} cx="0" cy={-r} r={r * 0.85} fill={petal} transform={`rotate(${deg})`} />
      ))}
      <circle r={r * 0.6} fill={heart} />
    </g>
  );
}

/** A four-pointed sparkle that twinkles in place. */
function Sparkle({
  x,
  y,
  s = 1,
  fill = "#ffd23f",
  delay = 0,
}: {
  x: number;
  y: number;
  s?: number;
  fill?: string;
  delay?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M0 -7 L1.8 -1.8 L7 0 L1.8 1.8 L0 7 L-1.8 1.8 L-7 0 L-1.8 -1.8 Z"
        fill={fill}
        className="animate-idiom-twinkle"
        style={{ animationDelay: `${delay}s` }}
      />
    </g>
  );
}

/** A water drop, point up, centred on its round end. */
const DROP = "M0 -6 C 2.5 -2 4 0 4 2 A 4 4 0 0 1 -4 2 C -4 0 -2.5 -2 0 -6 Z";

/** A limb, tail or trunk: one thick round-capped stroke. */
function Limb({ d, fill, width = 7 }: { d: string; fill: string; width?: number }) {
  return <path d={d} fill="none" stroke={fill} strokeWidth={width} strokeLinecap="round" />;
}

/** Something that floats up and away: a note, a bubble, a heart, a wisp of steam. */
function Rise({
  x,
  y,
  delay,
  dx = "6px",
  children,
}: {
  x: number;
  y: number;
  delay: number;
  dx?: string;
  children: ReactNode;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g
        className="animate-idiom-rise origin-center"
        style={{ animationDelay: `${delay}s`, "--dx": dx } as AnimStyle}
      >
        {children}
      </g>
    </g>
  );
}

function Drip({
  x,
  y,
  delay,
  fall = "22px",
  fill = "#4aa3df",
  s = 1,
}: {
  x: number;
  y: number;
  delay: number;
  fall?: string;
  fill?: string;
  s?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d={DROP}
        fill={fill}
        className="animate-idiom-drip"
        style={{ animationDelay: `${delay}s`, "--fall": fall } as AnimStyle}
      />
    </g>
  );
}

const NOTE = "M0 0 V-12 L8 -14 V-3";

function Note({ fill }: { fill: string }) {
  return (
    <g>
      <path d={NOTE} fill="none" stroke={fill} strokeWidth="2" strokeLinejoin="round" />
      <ellipse cx="-2" cy="0" rx="3" ry="2.3" fill={fill} />
      <ellipse cx="6" cy="-3" rx="3" ry="2.3" fill={fill} />
    </g>
  );
}

const HEART = "M0 4 C -6 -1 -7 -5 -4 -7 C -2 -8.5 0 -7 0 -5 C 0 -7 2 -8.5 4 -7 C 7 -5 6 -1 0 4 Z";

function Blush({ x, y, r = 2.6 }: { x: number; y: number; r?: number }) {
  return <ellipse cx={x} cy={y} rx={r} ry={r * 0.7} fill="#ff8fb3" opacity="0.75" />;
}

/** A small curved line in ink: a closed eye, a smile, a brow. */
function Stroke({ d, width = 1.8 }: { d: string; width?: number }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={INK}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

/* ── Ếch ngồi đáy giếng ─────────────────────────────────────────────────── */

function EchNgoiDayGieng() {
  return (
    <>
      <rect width="240" height="160" fill="#bfe6ff" />
      <circle cx="208" cy="24" r="13" fill="#ffd23f" />
      <Cloud x={44} y={24} />
      <Cloud x={176} y={46} s={0.75} />
      {/* The wide world up top: grass, trees, and the soil the well is dug into. */}
      <path d="M0 60 C 40 52 70 58 100 59 C 140 60 180 50 240 57 V160 H0 Z" fill="#8fd16a" />
      <path d="M0 72 C 60 68 180 70 240 70 V160 H0 Z" fill="#d9b48b" />
      {[
        [24, 96],
        [48, 128],
        [30, 146],
        [200, 92],
        [214, 124],
        [190, 146],
        [58, 104],
      ].map(([x, y]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="4" ry="2.5" fill="#c49a6c" />
      ))}
      <Tree x={28} y={48} />
      <Tree x={52} y={52} s={0.7} />
      <Tree x={214} y={46} s={0.9} />

      {/* The well, cut away: dark inside, brick walls, a beam of light from the mouth. */}
      <rect x="94" y="56" width="52" height="104" fill="#2f4f72" />
      <path d="M96 56 H144 L134 146 H106 Z" fill="#fff" opacity="0.1" />
      {[78, 146].map((x) => (
        <g key={x}>
          <rect x={x} y="56" width="16" height="104" fill="#d98b5f" />
          {[72, 88, 104, 120, 136, 152].map((y, i) => (
            <g key={y} stroke="#c47548" strokeWidth="1.5">
              <line x1={x} y1={y} x2={x + 16} y2={y} />
              <line x1={x + (i % 2 ? 5 : 11)} y1={y - 16} x2={x + (i % 2 ? 5 : 11)} y2={y} />
            </g>
          ))}
        </g>
      ))}
      {[72, 140].map((x) => (
        <g key={x}>
          <rect x={x} y="48" width="28" height="12" rx="3" fill="#8f9bab" />
          <rect x={x} y="48" width="28" height="6" rx="3" fill="#b4bfcc" />
        </g>
      ))}
      <rect x="94" y="146" width="52" height="14" fill="#4aa3df" />
      <path
        d="M100 152 h10 M124 154 h14"
        stroke="#bfe6ff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <ellipse cx="120" cy="146" rx="15" ry="5" fill="#8d96a3" />

      {/* The frog, gazing up at its little coin of sky. */}
      <ellipse cx="108" cy="141" rx="6.5" ry="4" fill="#4f9a36" />
      <ellipse cx="132" cy="141" rx="6.5" ry="4" fill="#4f9a36" />
      <ellipse cx="120" cy="131" rx="14" ry="11" fill="#6cc04a" />
      <ellipse cx="120" cy="135" rx="8" ry="6" fill="#d4f0a8" />
      <circle cx="112" cy="120" r="6.5" fill="#6cc04a" />
      <circle cx="128" cy="120" r="6.5" fill="#6cc04a" />
      <g className="animate-idiom-blink origin-center">
        <circle cx="112" cy="119.5" r="4.2" fill="#fff" />
        <circle cx="128" cy="119.5" r="4.2" fill="#fff" />
        <circle cx="112.5" cy="117.8" r="2.1" fill={INK} />
        <circle cx="128.5" cy="117.8" r="2.1" fill={INK} />
      </g>
      <Stroke d="M113 128 Q120 133 127 128" />
      <Blush x={109} y={129} />
      <Blush x={131} y={129} />

      {/* What it thinks the sky is: a tiny round of blue. */}
      <circle cx="127" cy="104" r="1.8" fill="#fff" />
      <circle cx="124" cy="97" r="2.6" fill="#fff" />
      <circle cx="120" cy="80" r="13" fill="#fff" />
      <circle cx="120" cy="80" r="8.5" fill="#8fd3ff" />
      <circle cx="123" cy="77" r="2.5" fill="#ffd23f" />
    </>
  );
}

/* ── Đàn gảy tai trâu ───────────────────────────────────────────────────── */

const BUFFALO = "#6b7d8f";
const BUFFALO_FAR = "#56687a";
const BUFFALO_HEAD = "#7b8da0";
const SKIN = "#f6cba3";

function DanGayTaiTrau() {
  return (
    <>
      <rect width="240" height="160" fill="#ffe1b3" />
      <circle cx="40" cy="36" r="16" fill="#ffb347" />
      <Cloud x={120} y={26} s={0.8} />
      <path d="M0 108 C 50 88 100 96 140 102 C 180 108 210 92 240 98 V160 H0 Z" fill="#a6d977" />
      <path d="M0 124 C 60 116 160 120 240 118 V160 H0 Z" fill="#7cc95a" />

      {/* The musician under a nón lá, lost in the tune. */}
      <ellipse cx="56" cy="132" rx="24" ry="7" fill="#2f5d8a" />
      <path d="M38 130 L44 94 Q56 86 68 94 L74 130 Z" fill="#3fa9e6" />
      <path d="M56 90 Q 62 90 68 94 L74 130 L60 130 Z" fill="#3497d0" />
      <circle cx="56" cy="78" r="13" fill={SKIN} />
      <Stroke d="M49 79 Q52 76 55 79 M58 79 Q61 76 64 79" width={1.6} />
      <Stroke d="M52 85 Q56 88 60 85" width={1.6} />
      <Blush x={48} y={84} r={2.2} />
      <path d="M34 72 L56 50 L78 72 Z" fill="#f1d58a" />
      <path d="M56 50 L78 72 L60 72 Z" fill="#e2c26c" />
      {/* Đàn nguyệt, the moon lute: round body, long neck. */}
      <Limb d="M80 104 L114 70" fill="#8b5a2b" width={4} />
      <rect
        x="110"
        y="64"
        width="9"
        height="5"
        rx="1.5"
        fill="#6b4220"
        transform="rotate(-45 114 66)"
      />
      <circle cx="76" cy="110" r="12" fill="#e0a050" />
      <circle cx="76" cy="110" r="3.2" fill="#8b5a2b" />
      <Limb d="M64 98 L74 108" fill={SKIN} width={5} />
      <Limb d="M66 96 L98 86" fill={SKIN} width={5} />

      {/* The tune drifts toward the buffalo's ear. */}
      <Rise x={102} y={84} delay={-0.4} dx="22px">
        <Note fill="#e8629a" />
      </Rise>
      <Rise x={110} y={76} delay={-1.2} dx="26px">
        <Note fill="#8b74f0" />
      </Rise>
      <Rise x={104} y={92} delay={-2} dx="24px">
        <Note fill="#3fa9e6" />
      </Rise>

      {/* The buffalo, unimpressed, still chewing. */}
      <g className="animate-idiom-sway origin-top" style={{ animationDuration: "3.4s" }}>
        <Limb d="M224 106 C 232 112 232 124 230 132" fill={BUFFALO} width={3} />
        <ellipse cx="230" cy="134" rx="3.5" ry="4.5" fill={BUFFALO_FAR} />
      </g>
      {[172, 210].map((x) => (
        <rect key={x} x={x} y="124" width="9" height="24" rx="3" fill={BUFFALO_FAR} />
      ))}
      <ellipse cx="188" cy="114" rx="40" ry="22" fill={BUFFALO} />
      <ellipse cx="192" cy="122" rx="30" ry="10" fill={BUFFALO_FAR} opacity="0.35" />
      {[160, 198].map((x) => (
        <rect key={x} x={x} y="124" width="9" height="24" rx="3" fill={BUFFALO} />
      ))}
      <path
        d="M144 88 C 130 86 118 76 122 62 C 128 72 138 78 150 82 Z M158 86 C 172 84 182 72 178 60 C 172 70 164 76 152 80 Z"
        fill="#f3ead8"
      />
      <ellipse cx="132" cy="94" rx="9" ry="5" fill={BUFFALO_HEAD} transform="rotate(-20 132 94)" />
      <ellipse cx="132" cy="94" rx="5" ry="2.4" fill="#f2a5b8" transform="rotate(-20 132 94)" />
      <ellipse cx="151" cy="98" rx="17" ry="15" fill={BUFFALO_HEAD} />
      <ellipse cx="142" cy="109" rx="11" ry="8" fill="#a5b3c0" />
      <ellipse cx="138" cy="108" rx="1.6" ry="2.2" fill={INK} />
      <ellipse cx="146" cy="108" rx="1.6" ry="2.2" fill={INK} />
      {/* Half-shut eyes: heard it, doesn't care. */}
      <Stroke d="M143 95 h7 M154 95 h7" />
      <path d="M144 95 a3 3 0 0 0 5 0 M155 95 a3 3 0 0 0 5 0" fill={INK} />
      <g className="animate-idiom-sway origin-right" style={{ animationDuration: "1.4s" }}>
        <path
          d="M134 113 L122 118 M134 114 L124 124 M136 115 L130 126"
          stroke="#3f9a3c"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    </>
  );
}

/* ── Nước đổ đầu vịt ────────────────────────────────────────────────────── */

const DUCK = "#fff6df";

function NuocDoDauVit() {
  return (
    <>
      <rect width="240" height="160" fill="#d6f1ff" />
      <Cloud x={196} y={26} />
      <ellipse cx="120" cy="152" rx="120" ry="20" fill="#8fd3ff" />
      <path
        d="M40 150 h18 M150 156 h22 M190 146 h14"
        stroke="#d6f1ff"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Reeds at the pond's edge. */}
      {[12, 22, 214, 226].map((x, i) => (
        <g key={x}>
          <path
            d={`M${x} 160 Q ${x + (i % 2 ? 4 : -4)} 120 ${x + 2} 96`}
            fill="none"
            stroke="#4fae5a"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <rect x={x - 1} y={100} width="6" height="16" rx="3" fill="#8b5a2b" />
        </g>
      ))}

      {/* A gáo dừa, the coconut-shell ladle, tipping water over. */}
      <g transform="rotate(40 92 22)">
        <Limb d="M74 22 L42 22" fill="#c9a46a" width={4} />
        <path d="M74 22 A 18 18 0 0 0 110 22 Z" fill="#8b5a2b" />
        <path d="M80 30 Q 92 36 104 30" fill="none" stroke="#a8743f" strokeWidth="1.5" />
      </g>
      <Limb d="M104 33 C 112 40 112 52 113 64" fill="#4aa3df" width={7} />
      <path
        d="M104 33 C 112 40 112 52 113 64"
        fill="none"
        stroke="#d6f1ff"
        strokeWidth="2"
        strokeDasharray="4 8"
        strokeLinecap="round"
        className="animate-idiom-flow"
      />

      {/* The duck, eyes closed, not bothered one bit. */}
      <path d="M118 128 l-6 6 h12 Z M142 128 l-6 6 h12 Z" fill="#ff9a3c" />
      <path d="M160 104 L178 94 L170 114 Z" fill="#f1e1bd" />
      <ellipse cx="134" cy="112" rx="34" ry="20" fill={DUCK} />
      <path d="M104 116 Q 134 136 166 116 Q 160 132 134 132 Q 110 132 104 116 Z" fill="#f1e1bd" />
      <path d="M126 106 Q 142 96 158 108 Q 144 120 126 112 Z" fill="#ead6aa" />
      <circle cx="114" cy="82" r="16" fill={DUCK} />
      <path d="M100 82 Q 86 84 90 91 Q 97 92 102 89 Z" fill="#ff9a3c" />
      <Stroke d="M108 79 Q 112 75.5 116 79" />
      <Blush x={117} y={87} />
      {/* The water slides right off. */}
      <Drip x={100} y={70} delay={-0.3} fall="26px" />
      <Drip x={128} y={70} delay={-0.9} fall="24px" />
      <Drip x={98} y={96} delay={-1.3} fall="30px" s={0.8} />
      <Drip x={170} y={112} delay={-0.6} fall="22px" s={0.8} />
      <Drip x={134} y={66} delay={-1.5} fall="20px" s={0.7} />
    </>
  );
}

/* ── Đầu voi đuôi chuột ─────────────────────────────────────────────────── */

const ELEPHANT = "#9fadbf";
const ELEPHANT_FAR = "#8494aa";
const ELEPHANT_HEAD = "#acb9ca";
const MOUSE = "#c4b3a2";

function DauVoiDuoiChuot() {
  return (
    <>
      <rect width="240" height="160" fill="#e9e1ff" />
      {[
        [20, 20, "#ff9cc4"],
        [60, 14, "#ffd23f"],
        [210, 24, "#8fd3ff"],
        [150, 18, "#a6e39a"],
        [226, 66, "#ffd23f"],
        [12, 60, "#8fd3ff"],
        [104, 30, "#ff9cc4"],
      ].map(([x, y, c]) => (
        <circle key={`${x}-${y}`} cx={x as number} cy={y as number} r="3.5" fill={c as string} />
      ))}
      <ellipse cx="128" cy="150" rx="96" ry="7" fill="#cdbff5" />

      {/* Big elephant legs at the front, tiny mouse legs at the back. */}
      <rect x="128" y="120" width="15" height="30" rx="5" fill={ELEPHANT_FAR} />
      <rect x="190" y="122" width="5" height="26" rx="2" fill="#a8988a" />
      {/* One body, elephant at the shoulders, mouse by the rump. */}
      <path
        d="M100 70 C 140 64 170 92 194 98 C 206 102 206 124 194 126 C 168 128 140 132 100 130 Z"
        fill={ELEPHANT}
      />
      <path
        d="M168 89 C 178 94 188 97 194 98 C 206 102 206 124 194 126 C 186 127 176 127 168 128 Z"
        fill={MOUSE}
      />
      <path d="M168 89 L168 128" stroke="#a8988a" strokeWidth="1.5" strokeDasharray="3 3" />
      <rect x="104" y="118" width="17" height="32" rx="5" fill={ELEPHANT} />
      <path d="M107 146 h4 M115 146 h4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <rect x="180" y="122" width="5" height="26" rx="2" fill={MOUSE} />
      <g className="animate-idiom-sway origin-left">
        <path
          d="M203 110 C 216 108 216 94 228 98 C 236 101 233 110 227 108"
          fill="none"
          stroke="#f2a5b8"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* The elephant head: huge flapping ear, curled trunk. */}
      <g className="animate-idiom-sway origin-left" style={{ animationDuration: "2s" }}>
        <ellipse cx="100" cy="76" rx="22" ry="30" fill={ELEPHANT_FAR} />
        <ellipse cx="102" cy="78" rx="14" ry="21" fill="#f6c1cf" />
      </g>
      <circle cx="76" cy="78" r="28" fill={ELEPHANT_HEAD} />
      <Limb
        d="M58 92 C 44 100 40 120 50 132 C 56 140 66 136 63 128"
        fill={ELEPHANT_HEAD}
        width={12}
      />
      <Limb d="M66 100 Q 60 110 68 114" fill="#fffaf0" width={3.5} />
      <circle cx="68" cy="72" r="3.4" fill={INK} />
      <circle cx="69.2" cy="70.8" r="1.1" fill="#fff" />
      <Stroke d="M63 64 Q 68 61 73 64" width={1.6} />
      <Blush x={80} y={86} r={3.4} />
    </>
  );
}

/* ── Mèo mù vớ cá rán ───────────────────────────────────────────────────── */

const CAT = "#eb9748";
const CAT_HEAD = "#f4a95e";

function MeoMuVoCaRan() {
  return (
    <>
      <rect width="240" height="160" fill="#fff1d6" />
      {/* Kitchen wall tiles. */}
      <g stroke="#f6dfb4" strokeWidth="1.5">
        {[24, 48, 72, 96, 120].map((y) => (
          <line key={y} x1="0" y1={y} x2="240" y2={y} />
        ))}
        {[30, 60, 90, 120, 150, 180, 210].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="128" />
        ))}
      </g>
      <rect x="0" y="128" width="240" height="32" fill="#c98a54" />
      <rect x="0" y="126" width="240" height="6" fill="#b0703e" />

      {/* The cat, blindfolded, tail wagging behind. */}
      <g className="animate-idiom-sway origin-bottom-right" style={{ animationDuration: "1.8s" }}>
        <Limb d="M52 132 C 26 128 22 104 36 96" fill="#d9803a" width={7} />
      </g>
      <ellipse cx="76" cy="110" rx="26" ry="24" fill={CAT} />
      <path
        d="M60 100 q 4 4 0 8 M66 96 q 4 5 0 10 M86 120 q 6 2 10 0"
        fill="none"
        stroke="#d9803a"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <ellipse cx="76" cy="118" rx="12" ry="10" fill="#ffe2bf" />
      {/* Head tilted, sniffing out the fish. */}
      <g className="animate-idiom-sway origin-bottom" style={{ animationDuration: "3s" }}>
        <path d="M60 58 L62 34 L78 50 Z M100 58 L98 34 L82 50 Z" fill={CAT_HEAD} />
        <path d="M64 50 L65 40 L72 47 Z M96 50 L95 40 L88 47 Z" fill="#f6a7b8" />
        <circle cx="80" cy="70" r="24" fill={CAT_HEAD} />
        <path d="M57 63 Q 80 57 103 63 L 103 73 Q 80 67 57 73 Z" fill="#e8505b" />
        <g className="animate-idiom-sway origin-left">
          <path d="M103 66 L 116 60 L 113 68 Z M103 68 L 115 76 L 108 74 Z" fill="#d43f4a" />
        </g>
        <path d="M77 78 h6 l-3 3.5 Z" fill="#f2899c" />
        <Stroke d="M74 84 Q 77 87.5 80 84 Q 83 87.5 86 84" width={1.6} />
        <path
          d="M68 80 l-12 -2 M68 83 l-12 2 M92 80 l12 -2 M92 83 l12 2"
          stroke="#c9692a"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <Blush x={67} y={87} />
        <Blush x={93} y={87} />
      </g>
      {/* The paw, patting the find. */}
      <g className="animate-idiom-bob" style={{ animationDuration: "0.8s" }}>
        <Limb d="M96 102 L 134 118" fill={CAT_HEAD} width={11} />
        <circle cx="137" cy="119" r="7" fill={CAT_HEAD} />
        <circle cx="138" cy="120" r="2.6" fill="#f6a7b8" />
      </g>

      {/* The prize: a golden fried fish, still steaming. */}
      <ellipse cx="174" cy="130" rx="44" ry="9" fill="#e6dccb" />
      <ellipse cx="174" cy="128" rx="44" ry="9" fill="#fff" />
      <path d="M198 119 L 214 108 L 211 130 Z" fill="#c97f22" />
      <path d="M142 121 Q 170 102 198 119 Q 170 134 142 121 Z" fill="#e2a03c" />
      <path
        d="M160 112 l6 14 M172 110 l6 15 M184 112 l5 12"
        stroke="#b87326"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="150" cy="118" r="2" fill={INK} />
      {[
        [164, 102, -0.3],
        [176, 100, -1.1],
        [188, 104, -1.9],
      ].map(([x, y, delay]) => (
        <Rise key={x} x={x} y={y} delay={delay} dx="3px">
          <path
            d="M0 0 q -3 -4 0 -8 q 3 -4 0 -8"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </Rise>
      ))}
      <Sparkle x={150} y={92} delay={-0.2} />
      <Sparkle x={210} y={94} s={0.8} delay={-0.9} />
      <Sparkle x={222} y={130} s={0.6} delay={-1.4} />
      <Sparkle x={128} y={98} s={0.6} delay={-0.6} />
    </>
  );
}

/* ── Cưỡi ngựa xem hoa ──────────────────────────────────────────────────── */

const HORSE = "#b0703e";
const HORSE_FAR = "#8e562c";

function CuoiNguaXemHoa() {
  return (
    <>
      <rect width="240" height="160" fill="#cdeffd" />
      <circle cx="206" cy="26" r="12" fill="#ffd23f" />
      <Cloud x={70} y={26} s={0.8} />
      <path d="M0 104 C 50 84 100 92 150 98 C 190 102 220 88 240 92 V160 H0 Z" fill="#a6d977" />
      <path d="M0 126 C 80 118 160 122 240 120 V160 H0 Z" fill="#7cc95a" />
      {/* Speed lines: no time to stop and look. */}
      <path
        d="M8 70 h40 M18 86 h30 M4 102 h34"
        stroke="#fff"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      <g className="animate-idiom-bob">
        <g className="animate-idiom-sway origin-right" style={{ animationDuration: "0.9s" }}>
          <path d="M98 84 C 84 80 72 86 62 80 C 72 92 84 96 98 92 Z" fill="#5b3416" />
        </g>
        <Limb d="M112 102 L 104 132" fill={HORSE_FAR} />
        <Limb d="M150 100 L 172 112 L 178 124" fill={HORSE_FAR} />
        <ellipse cx="126" cy="92" rx="32" ry="16" fill={HORSE} />
        <Limb d="M104 100 L 86 126" fill={HORSE} />
        <Limb d="M144 102 L 158 128" fill={HORSE} />
        <path d="M146 84 L 164 54 L 180 60 L 160 98 Z" fill={HORSE} />
        <path d="M150 82 L 166 54 L 158 52 L 144 78 Z" fill="#5b3416" />
        <path d="M168 52 l 2 -9 l 5 8 Z" fill={HORSE_FAR} />
        <ellipse cx="182" cy="62" rx="15" ry="8" fill={HORSE} transform="rotate(30 182 62)" />
        <ellipse cx="189" cy="67" rx="7" ry="5" fill="#c98a5a" transform="rotate(30 189 67)" />
        <circle cx="176" cy="56" r="1.9" fill={INK} />
        <circle cx="191" cy="69" r="1.2" fill={INK} />
        {/* The rider, leaning into the gallop. */}
        <Limb d="M128 82 L 134 100" fill="#3f6fb5" width={6} />
        <path d="M116 80 L 122 56 L 138 56 L 140 80 Z" fill="#e8505b" />
        <Limb d="M136 62 L 156 70" fill={SKIN} width={4} />
        <circle cx="130" cy="46" r="10" fill={SKIN} />
        <path d="M120 44 Q 124 32 136 36 Q 142 40 140 46 Q 132 40 120 44 Z" fill="#2b2b2b" />
        <Stroke d="M133 49 q 2 2 4 0" width={1.5} />
        <circle cx="135" cy="45" r="1.4" fill={INK} />
      </g>

      {/* The flowers whizzing past, unseen. */}
      {[
        [10, 140, "#ff9cc4"],
        [30, 150, "#ffd23f"],
        [52, 138, "#c9a8ff"],
        [74, 152, "#ff8a7a"],
        [96, 142, "#fff"],
        [120, 152, "#ffd23f"],
        [142, 140, "#ff9cc4"],
        [166, 150, "#c9a8ff"],
        [190, 140, "#ff8a7a"],
        [212, 152, "#ffd23f"],
        [232, 140, "#fff"],
      ].map(([x, y, c]) => (
        <g key={`${x}`}>
          <line
            x1={x as number}
            y1={(y as number) + 4}
            x2={x as number}
            y2="160"
            stroke="#3f9a3c"
            strokeWidth="2"
          />
          <Blossom
            x={x as number}
            y={y as number}
            r={4.5}
            petal={c as string}
            heart={c === "#ffd23f" ? "#f28c28" : "#ffd23f"}
          />
        </g>
      ))}
    </>
  );
}

/* ── Như cá gặp nước ────────────────────────────────────────────────────── */

function NhuCaGapNuoc() {
  return (
    <>
      <rect width="240" height="160" fill="#3fa9e6" />
      <path d="M0 0 H240 V30 C 200 38 170 24 120 32 C 70 40 40 26 0 34 Z" fill="#7cc8f2" />
      <path
        d="M40 0 L 70 0 L 40 160 L 20 160 Z M120 0 L 140 0 L 130 160 L 108 160 Z M190 0 L 214 0 L 230 160 L 200 160 Z"
        fill="#fff"
        opacity="0.08"
      />
      <path d="M0 142 C 40 134 80 140 120 138 C 170 136 200 132 240 138 V160 H0 Z" fill="#f3d9a4" />
      <ellipse cx="60" cy="146" rx="7" ry="4" fill="#d9b47a" />
      <ellipse cx="180" cy="148" rx="9" ry="4.5" fill="#d9b47a" />
      {/* Seaweed swaying from the sand. */}
      {[
        [24, "#4fae5a", "2.8s"],
        [36, "#3f9a3c", "3.4s"],
        [206, "#4fae5a", "3s"],
        [220, "#6cc04a", "2.4s"],
      ].map(([x, c, dur]) => (
        <g
          key={x as number}
          className="animate-idiom-sway origin-bottom"
          style={{ animationDuration: dur as string }}
        >
          <path
            d={`M${x} 146 C ${(x as number) - 10} 126 ${(x as number) + 10} 110 ${x} 88`}
            fill="none"
            stroke={c as string}
            strokeWidth="6"
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* A small yellow friend swimming along. */}
      <g
        className="animate-idiom-swim"
        style={{ animationDuration: "3.6s", animationDelay: "-1s" }}
      >
        <path d="M204 50 L 214 44 L 214 56 Z" fill="#f2b81a" />
        <path d="M176 50 Q 190 40 204 50 Q 190 60 176 50 Z" fill="#ffd23f" />
        <circle cx="182" cy="49" r="1.5" fill={INK} />
      </g>

      {/* The happy koi, right where it belongs. */}
      <g className="animate-idiom-swim">
        <g className="animate-idiom-sway origin-right" style={{ animationDuration: "0.8s" }}>
          <path d="M160 82 L 186 64 L 180 82 L 186 100 Z" fill="#f2622f" />
        </g>
        <path d="M110 66 Q 124 48 140 64 Z" fill="#f2622f" />
        <path d="M80 82 Q 120 46 162 82 Q 120 116 80 82 Z" fill="#ff8a3d" />
        <path d="M84 86 Q 120 112 158 86 Q 120 104 84 86 Z" fill="#ffb066" />
        <ellipse cx="124" cy="74" rx="9" ry="6" fill="#fff4e6" />
        <ellipse cx="140" cy="88" rx="7" ry="4" fill="#fff4e6" />
        <path d="M116 92 Q 124 104 132 94 Z" fill="#f2622f" />
        <circle cx="96" cy="78" r="5" fill="#fff" />
        <circle cx="95" cy="77" r="2.5" fill={INK} />
        <Stroke d="M86 88 Q 90 92 95 89" />
        <Blush x={102} y={88} />
      </g>

      {/* Bubbles, and a little heart: pure joy. */}
      {[
        [80, 74, -0.2, "-6px", 3],
        [76, 66, -0.9, "-4px", 2],
        [82, 70, -1.6, "-8px", 2.5],
      ].map(([x, y, delay, dx, r]) => (
        <Rise
          key={delay as number}
          x={x as number}
          y={y as number}
          delay={delay as number}
          dx={dx as string}
        >
          <circle r={r as number} fill="#fff" fillOpacity="0.55" />
        </Rise>
      ))}
      <Rise x={112} y={50} delay={-1.2} dx="4px">
        <path d={HEART} fill="#ff8fb3" />
      </Rise>
    </>
  );
}

/* ── Chậm như rùa ───────────────────────────────────────────────────────── */

function ChamNhuRua() {
  return (
    <>
      <rect width="240" height="160" fill="#d8f0ff" />
      <Cloud x={50} y={28} />
      <Cloud x={150} y={20} s={0.7} />
      <path d="M0 96 C 60 86 120 92 180 88 C 210 86 230 92 240 92 V160 H0 Z" fill="#9ad46c" />
      <path d="M0 120 C 60 112 180 114 240 110 V140 C 180 144 60 146 0 148 Z" fill="#ecd29e" />

      {/* The finish line, far, far away. */}
      <Limb d="M222 118 L222 66" fill="#5b6b7c" width={2.5} />
      <g className="animate-idiom-sway origin-left" style={{ animationDuration: "2s" }}>
        <rect x="223" y="66" width="16" height="12" fill="#fff" />
        <path
          d="M223 66 h4 v4 h-4 Z M231 66 h4 v4 h-4 Z M227 70 h4 v4 h-4 Z M235 70 h4 v4 h-4 Z M223 74 h4 v4 h-4 Z M231 74 h4 v4 h-4 Z"
          fill={INK}
        />
      </g>

      {/* A snail, cheerfully overtaking. */}
      <path d="M176 128 Q 172 120 180 120 L 204 120 Q 210 120 208 128 Z" fill="#c9e88a" />
      <path
        d="M200 120 l 2 -10 M204 120 l 5 -9"
        stroke="#a9cc6a"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="202" cy="109" r="1.8" fill={INK} />
      <circle cx="209" cy="110" r="1.8" fill={INK} />
      <circle cx="188" cy="112" r="11" fill="#f4a259" />
      <path
        d="M188 112 m 0 -6 a 6 6 0 1 1 -5 9 a 3.5 3.5 0 1 1 4 -4"
        fill="none"
        stroke="#c9692a"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* The trail behind the turtle: it's been at this a while. */}
      <path
        d="M8 132 h8 M24 131 h8 M40 130 h8"
        stroke="#c9a86a"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <g className="animate-idiom-bob" style={{ animationDuration: "2.4s" }}>
        <ellipse cx="68" cy="128" rx="7" ry="5" fill="#8fc456" />
        <ellipse cx="112" cy="128" rx="7" ry="5" fill="#8fc456" />
        <path d="M54 122 L 46 126 L 54 126 Z" fill="#8fc456" />
        <circle cx="132" cy="110" r="11" fill="#a8d86a" />
        <Stroke d="M130 108 q 3 2 6 0" />
        <Stroke d="M134 116 q 3 2 5 -1" width={1.5} />
        <Blush x={138} y={112} r={2} />
        <path d="M52 124 Q 56 76 90 74 Q 124 76 126 124 Z" fill="#5fb85a" />
        <path d="M90 74 Q 124 76 126 124 L 104 124 Q 108 90 90 74 Z" fill="#53a84f" />
        <path d="M76 86 L 90 80 L 104 86 L 104 102 L 90 108 L 76 102 Z" fill="#7fcd6a" />
        <path
          d="M76 102 L 64 108 M104 102 L 116 108 M90 108 L 90 122 M76 86 L 66 90 M104 86 L 114 90"
          stroke="#46954a"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <rect x="50" y="120" width="78" height="6" rx="3" fill="#e8d07a" />
      </g>
      <Drip x={140} y={96} delay={-0.4} fall="12px" s={0.7} fill="#8fd3ff" />
    </>
  );
}

/* ── Vui như Tết ────────────────────────────────────────────────────────── */

function VuiNhuTet() {
  return (
    <>
      <rect width="240" height="160" fill="#b4232c" />
      <circle cx="120" cy="80" r="90" fill="#c8323a" />
      {/* Fireworks. */}
      {[
        [64, 26, "#ffd23f", 1, -0.2],
        [118, 16, "#ff9cc4", 0.8, -0.8],
        [176, 34, "#ffe9a0", 0.9, -1.3],
        [214, 96, "#ffd23f", 0.7, -0.5],
        [140, 62, "#ffe9a0", 0.6, -1],
      ].map(([x, y, c, s, delay]) => (
        <g key={`${x}`}>
          <g transform={`translate(${x} ${y}) scale(${s})`}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={deg}
                x1="0"
                y1="-6"
                x2="0"
                y2="-13"
                stroke={c as string}
                strokeWidth="2.5"
                strokeLinecap="round"
                transform={`rotate(${deg})`}
              />
            ))}
          </g>
          <Sparkle
            x={x as number}
            y={y as number}
            s={(s as number) * 0.7}
            fill={c as string}
            delay={delay as number}
          />
        </g>
      ))}

      {/* A hoa mai branch reaching in from the corner. */}
      <path
        d="M-4 18 C 20 24 40 40 58 44 C 76 48 88 60 96 72 M40 38 C 44 26 52 20 60 16 M70 50 C 78 46 86 38 96 36"
        fill="none"
        stroke="#6b3b1f"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {[
        [14, 22],
        [34, 34],
        [56, 42],
        [60, 16],
        [80, 54],
        [96, 72],
        [94, 36],
        [48, 22],
      ].map(([x, y], i) => (
        <Blossom key={i} x={x} y={y} r={5} petal="#ffd23f" heart="#e8742a" />
      ))}

      {/* Two lanterns swinging on their strings. */}
      {[
        [186, "2.8s", 16],
        [214, "3.4s", 30],
      ].map(([x, dur, drop]) => (
        <g
          key={x as number}
          className="animate-idiom-sway origin-top"
          style={{ animationDuration: dur as string }}
        >
          <line
            x1={x as number}
            y1="0"
            x2={x as number}
            y2={drop as number}
            stroke="#ffd23f"
            strokeWidth="1.5"
          />
          <g transform={`translate(${x} ${(drop as number) + 16})`}>
            <rect x="-6" y="-18" width="12" height="4" rx="1" fill="#ffd23f" />
            <ellipse rx="16" ry="15" fill="#ff4b4b" />
            <path d="M0 -15 A 16 15 0 0 1 0 15 A 9 15 0 0 0 0 -15 Z" fill="#ff6a6a" />
            <path
              d="M-9 -12 Q -14 0 -9 12 M0 -15 V15 M9 -12 Q 14 0 9 12"
              fill="none"
              stroke="#ffd23f"
              strokeWidth="1.2"
            />
            <rect x="-6" y="14" width="12" height="4" rx="1" fill="#ffd23f" />
            <path
              d="M-3 18 v12 M0 18 v14 M3 18 v12"
              stroke="#ffd23f"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
        </g>
      ))}

      {/* Bánh chưng, wrapped and tied. */}
      <g transform="rotate(-6 48 124)">
        <rect x="22" y="98" width="52" height="52" rx="5" fill="#3f8a30" />
        <rect x="26" y="102" width="44" height="44" rx="3" fill="#5fae48" />
        <path
          d="M22 116 H74 M22 132 H74 M40 98 V150 M56 98 V150"
          stroke="#f3e2a6"
          strokeWidth="3"
        />
      </g>
      {/* Watermelon, red to the rind. */}
      <path d="M86 150 A 28 28 0 0 1 142 150 Z" fill="#3f9a3c" />
      <path d="M89 150 A 25 25 0 0 1 139 150 Z" fill="#d8f0b0" />
      <path d="M92 150 A 22 22 0 0 1 136 150 Z" fill="#ff5a6a" />
      {[
        [104, 141],
        [114, 135],
        [124, 141],
        [114, 145],
      ].map(([x, y]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="1.6" ry="2.4" fill={INK} />
      ))}
      {/* A lì xì envelope. */}
      <g transform="rotate(10 186 124)">
        <rect x="164" y="96" width="44" height="58" rx="4" fill="#ff4b4b" />
        <path
          d="M164 100 Q 164 96 168 96 H 204 Q 208 96 208 100 V 108 L 186 122 L 164 108 Z"
          fill="#e83a3f"
        />
        <Blossom x={186} y={136} r={5} petal="#ffd23f" heart="#ff4b4b" />
      </g>
    </>
  );
}

/* ── Uống nước nhớ nguồn ────────────────────────────────────────────────── */

const STREAM = "M152 40 C 140 62 176 74 156 96 C 138 114 96 112 74 134 C 66 142 60 152 56 160";

function UongNuocNhoNguon() {
  return (
    <>
      <rect width="240" height="160" fill="#d4efff" />
      <Cloud x={46} y={24} s={0.9} />
      <Cloud x={214} y={20} s={0.7} />
      <path d="M100 160 L 160 30 L 240 140 V160 Z" fill="#4f9a6e" />
      <path d="M0 160 V 100 L 60 54 L 130 160 Z" fill="#6bb38a" />
      <path d="M140 72 L 160 30 L 176 54 L 166 50 L 158 62 L 150 56 Z" fill="#8fcfa2" />
      <Tree x={196} y={100} s={0.8} />
      <Tree x={214} y={116} s={0.9} />
      <Tree x={34} y={92} s={0.7} />
      {/* The spring, high on the mountain, and the stream it sends down. */}
      <ellipse cx="152" cy="40" rx="10" ry="4" fill="#4aa3df" />
      <path d={STREAM} fill="none" stroke="#4aa3df" strokeWidth="8" strokeLinecap="round" />
      <path
        d={STREAM}
        fill="none"
        stroke="#e8f7ff"
        strokeWidth="2"
        strokeDasharray="6 14"
        strokeLinecap="round"
        className="animate-idiom-flow"
      />
      <Sparkle x={164} y={30} delay={-0.3} />
      <Sparkle x={140} y={34} s={0.6} delay={-1} />

      {/* A child sipping from a cup, sending thanks back up the mountain. */}
      <path d="M16 160 L 22 124 Q 36 114 50 124 L 56 160 Z" fill="#8b74f0" />
      <circle cx="36" cy="106" r="14" fill={SKIN} />
      <path
        d="M22 104 Q 22 88 38 90 Q 52 92 50 104 Q 44 96 34 98 Q 26 98 22 104 Z"
        fill="#2b2b2b"
      />
      <Stroke d="M30 106 q 2.5 2 5 0" width={1.6} />
      <Blush x={29} y={112} r={2.2} />
      <Limb d="M48 136 L 54 120" fill={SKIN} width={5} />
      <path d="M46 110 h14 l -2 14 h-10 Z" fill="#fff" />
      <rect x="47.5" y="112" width="11" height="4" fill="#4aa3df" />
      <Rise x={66} y={92} delay={-0.4} dx="18px">
        <path d={HEART} fill="#ff6b8b" />
      </Rise>
      <Rise x={74} y={86} delay={-1.6} dx="22px">
        <path d={HEART} fill="#ff9cc4" transform="scale(0.8)" />
      </Rise>
    </>
  );
}

/* ── Nước chảy đá mòn ───────────────────────────────────────────────────── */

function NuocChayDaMon() {
  return (
    <>
      <rect width="240" height="160" fill="#d6f2e4" />
      {/* Ferns on either side. */}
      {[
        [16, 160, -18],
        [34, 160, -8],
        [222, 160, 16],
        [206, 160, 6],
      ].map(([x, y, tilt]) => (
        <g key={x} transform={`translate(${x} ${y}) rotate(${tilt})`}>
          <path d="M0 0 C 0 -30 2 -50 0 -70" fill="none" stroke="#3f9a3c" strokeWidth="2.5" />
          {[-12, -24, -36, -48, -60].map((yy) => (
            <g key={yy}>
              <ellipse
                cx="-7"
                cy={yy}
                rx="8"
                ry="3"
                fill="#5fc06a"
                transform={`rotate(-20 -7 ${yy})`}
              />
              <ellipse
                cx="7"
                cy={yy}
                rx="8"
                ry="3"
                fill="#4fae5a"
                transform={`rotate(20 7 ${yy})`}
              />
            </g>
          ))}
        </g>
      ))}
      {/* The ledge and leaf the water drips from. */}
      <path d="M60 0 H180 V8 C 160 14 140 10 120 14 C 100 10 80 14 60 8 Z" fill="#7d8b99" />
      <path d="M120 12 C 108 16 108 28 120 34 C 132 28 132 16 120 12 Z" fill="#6cc04a" />
      <path d="M120 12 C 132 16 132 28 120 34 Z" fill="#5aae3c" />
      <Drip x={120} y={42} delay={-0.1} fall="66px" />
      <Drip x={120} y={42} delay={-0.9} fall="66px" />

      {/* The stone, with a hollow worn into its top. */}
      <path d="M40 160 Q 48 112 120 104 Q 194 112 202 160 Z" fill="#9aa5b1" />
      <path d="M120 104 Q 194 112 202 160 L 150 160 Q 160 124 120 104 Z" fill="#8a96a3" />
      <path
        d="M62 140 q 8 -6 18 -4 M160 132 q 10 0 16 8 M96 148 q 6 -4 12 0"
        fill="none"
        stroke="#b2bcc6"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <ellipse cx="66" cy="132" rx="10" ry="4" fill="#6cc04a" opacity="0.8" />
      <ellipse cx="174" cy="126" rx="8" ry="3" fill="#6cc04a" opacity="0.8" />
      <ellipse cx="120" cy="112" rx="18" ry="5.5" fill="#6f7c8a" />
      <ellipse cx="120" cy="113" rx="12" ry="3.4" fill="#7cc8f2" />
      {[0, -0.8].map((delay) => (
        <ellipse
          key={delay}
          cx="120"
          cy="113"
          rx="10"
          ry="3"
          fill="none"
          stroke="#e8f7ff"
          strokeWidth="1"
          className="animate-idiom-ripple"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
      {/* A ladybug, watching patiently. */}
      <g transform="translate(160 118)">
        <circle cx="-7" cy="0" r="3.5" fill={INK} />
        <ellipse cx="0" cy="0" rx="7" ry="6" fill="#e8505b" />
        <path d="M0 -6 V6" stroke="#b8333d" strokeWidth="1.2" />
        <circle cx="-3" cy="-1" r="1.4" fill={INK} />
        <circle cx="3" cy="2" r="1.4" fill={INK} />
        <circle cx="3" cy="-3" r="1.1" fill={INK} />
      </g>
    </>
  );
}

/* ── Khỏe như voi ───────────────────────────────────────────────────────── */

function KhoeNhuVoi() {
  return (
    <>
      <rect width="240" height="160" fill="#fff0c2" />
      <circle cx="30" cy="28" r="14" fill="#ffd23f" />
      <Cloud x={92} y={22} s={0.8} />
      <path d="M0 124 C 60 116 180 120 240 116 V160 H0 Z" fill="#9ad46c" />
      <Tree x={18} y={104} s={1.1} />

      {[74, 130].map((x) => (
        <rect key={x} x={x} y="112" width="16" height="34" rx="5" fill={ELEPHANT_FAR} />
      ))}
      <Limb d="M54 100 C 44 104 42 114 46 120" fill={ELEPHANT_FAR} width={2.5} />
      <ellipse cx="96" cy="104" rx="46" ry="30" fill={ELEPHANT} />
      {[56, 112].map((x) => (
        <rect key={x} x={x} y="114" width="16" height="32" rx="5" fill={ELEPHANT} />
      ))}
      <circle cx="148" cy="80" r="25" fill={ELEPHANT_HEAD} />

      {/* Trunk and log, lifted together. */}
      <g className="animate-idiom-bob" style={{ animationDuration: "1.6s" }}>
        <Limb d="M164 94 C 182 92 188 72 186 52" fill={ELEPHANT_HEAD} width={12} />
        <g transform="rotate(-8 196 40)">
          <rect x="164" y="32" width="66" height="16" rx="8" fill="#a8743f" />
          <rect x="164" y="40" width="66" height="8" rx="4" fill="#94632f" />
          <path
            d="M176 36 h20 M200 44 h18"
            stroke="#8b5a2b"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <ellipse cx="226" cy="40" rx="5" ry="8" fill="#e0b47a" />
          <ellipse
            cx="226"
            cy="40"
            rx="2"
            ry="3.5"
            fill="none"
            stroke="#a8743f"
            strokeWidth="1.2"
          />
        </g>
      </g>
      <Limb d="M166 96 Q 172 104 178 100" fill="#fffaf0" width={3.5} />
      <g className="animate-idiom-sway origin-right" style={{ animationDuration: "2.2s" }}>
        <ellipse cx="132" cy="84" rx="16" ry="22" fill={ELEPHANT_FAR} />
        <ellipse cx="132" cy="86" rx="10" ry="15" fill="#f6c1cf" />
      </g>
      <circle cx="156" cy="74" r="3.2" fill={INK} />
      <circle cx="157.2" cy="72.8" r="1.1" fill="#fff" />
      <Stroke d="M151 66 Q 156 63 161 66" width={1.6} />
      <Blush x={162} y={86} r={3.4} />
      {/* Effort lines that say "easy". */}
      <path
        d="M200 14 l 4 -8 M214 16 l 6 -6 M188 16 l 0 -9"
        stroke="#e8903a"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <Sparkle x={150} y={36} s={0.8} delay={-0.4} />
    </>
  );
}

/* ── Nhanh như sóc ──────────────────────────────────────────────────────── */

const SQUIRREL = "#d9803a";

function NhanhNhuSoc() {
  return (
    <>
      <rect width="240" height="160" fill="#d8f0ff" />
      <Cloud x={196} y={22} s={0.8} />
      <path d="M0 136 C 80 128 160 132 240 128 V160 H0 Z" fill="#9ad46c" />
      {/* Two trees, a branch from each reaching toward the other. */}
      <rect x="14" y="20" width="22" height="120" fill="#8b5a2b" />
      <Limb d="M34 66 C 54 62 70 66 92 60" fill="#8b5a2b" width={7} />
      <circle cx="20" cy="18" r="30" fill="#4fae5a" />
      <circle cx="50" cy="10" r="20" fill="#5fc06a" />
      <circle cx="80" cy="58" r="10" fill="#5fc06a" />
      <rect x="208" y="40" width="20" height="100" fill="#8b5a2b" />
      <Limb d="M210 98 C 192 94 174 100 156 96" fill="#8b5a2b" width={7} />
      <circle cx="222" cy="36" r="28" fill="#46a052" />
      <circle cx="160" cy="92" r="9" fill="#5fc06a" />
      <ellipse cx="172" cy="91" rx="4" ry="5" fill="#a8743f" />
      <path d="M168 87 Q 172 82 176 87 Z" fill="#6b4220" />
      {/* Speed lines: already gone. */}
      <path
        d="M62 76 h22 M56 86 h24 M66 96 h16"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* The squirrel, mid-leap. */}
      <g className="animate-idiom-bob" style={{ animationDuration: "0.7s" }}>
        <g className="animate-idiom-sway origin-bottom-right" style={{ animationDuration: "1.2s" }}>
          <Limb d="M112 82 C 92 78 86 56 100 46 C 110 40 120 48 114 56" fill="#e8954a" width={14} />
        </g>
        <Limb d="M118 84 L 102 94" fill="#b8692c" width={4.5} />
        <ellipse cx="128" cy="78" rx="17" ry="10" fill={SQUIRREL} transform="rotate(-15 128 78)" />
        <ellipse cx="132" cy="82" rx="9" ry="5" fill="#ffe2bf" transform="rotate(-15 132 82)" />
        <Limb d="M140 82 L 156 86" fill={SQUIRREL} width={4.5} />
        <path d="M141 60 L 146 50 L 150 60 Z" fill={SQUIRREL} />
        <circle cx="147" cy="67" r="10" fill="#e48c44" />
        <circle cx="150" cy="65" r="1.9" fill={INK} />
        <circle cx="157" cy="69" r="1.4" fill={INK} />
        <Blush x={150} y={72} r={2.2} />
      </g>
    </>
  );
}

/* ── Kiến tha lâu cũng đầy tổ ───────────────────────────────────────────── */

const ANT = "#5b3a29";

/** An ant walking right, carrying a crumb on its back. */
function Ant({ x, y, crumb, delay }: { x: number; y: number; crumb: string; delay: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g
        className="animate-idiom-bob"
        style={{ animationDuration: "0.5s", animationDelay: `${delay}s` }}
      >
        <path
          d="M-6 2 l-3 4 M-1 2 l-1 5 M3 2 l2 5"
          stroke={ANT}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M6 -4 q 2 -5 6 -5"
          fill="none"
          stroke={ANT}
          strokeWidth="1"
          strokeLinecap="round"
        />
        <ellipse cx="-7" cy="0" rx="5" ry="3.8" fill={ANT} />
        <circle cx="0" cy="0" r="2.6" fill={ANT} />
        <circle cx="5.5" cy="-1.5" r="3.2" fill={ANT} />
        <circle cx="6.6" cy="-2.2" r="0.9" fill="#fff" />
        <ellipse cx="-2" cy="-7" rx="4.5" ry="3" fill={crumb} />
      </g>
    </g>
  );
}

function KienThaLauCungDayTo() {
  return (
    <>
      <rect width="240" height="160" fill="#d8f0ff" />
      <circle cx="28" cy="22" r="12" fill="#ffd23f" />
      <Cloud x={120} y={20} s={0.8} />
      <path d="M0 52 C 60 46 160 50 240 46 V160 H0 Z" fill="#8fd16a" />
      <path d="M0 62 C 80 58 160 60 240 58 V160 H0 Z" fill="#c49a6c" />
      {/* The anthill, its tunnel, and the chamber below, filling up. */}
      <path d="M168 56 Q 196 26 224 56 Z" fill="#b5865a" />
      <ellipse cx="196" cy="48" rx="5" ry="3" fill="#6b4a33" />
      <Limb d="M196 50 C 196 80 168 84 172 112" fill="#8a6040" width={9} />
      <ellipse cx="176" cy="124" rx="38" ry="20" fill="#8a6040" />
      {[
        [154, 132, "#fff6df"],
        [164, 136, "#ffd23f"],
        [176, 134, "#fff6df"],
        [188, 136, "#f3a64a"],
        [198, 130, "#fff6df"],
        [160, 126, "#f3a64a"],
        [172, 126, "#fff6df"],
        [184, 126, "#ffd23f"],
        [194, 122, "#fff6df"],
        [166, 118, "#ffd23f"],
        [178, 116, "#fff6df"],
      ].map(([x, y, c]) => (
        <ellipse
          key={`${x}-${y}`}
          cx={x as number}
          cy={y as number}
          rx="4.5"
          ry="3"
          fill={c as string}
        />
      ))}
      <Sparkle x={210} y={110} s={0.6} delay={-0.5} />
      {[
        [40, 92],
        [72, 132],
        [112, 100],
        [24, 140],
      ].map(([x, y]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="4" ry="2.5" fill="#b38a5e" />
      ))}

      {/* The ants, one crumb each, marching home. */}
      <Ant x={34} y={52} crumb="#fff6df" delay={0} />
      <Ant x={68} y={51} crumb="#ffd23f" delay={-0.2} />
      <Ant x={102} y={50} crumb="#f3a64a" delay={-0.35} />
      <Ant x={136} y={50} crumb="#fff6df" delay={-0.1} />
      <Ant x={184} y={94} crumb="#ffd23f" delay={-0.25} />
    </>
  );
}

/* ── Lá lành đùm lá rách ────────────────────────────────────────────────── */

function LaLanhDumLaRach() {
  return (
    <>
      <rect width="240" height="160" fill="#dcecf7" />
      <path d="M0 140 C 80 132 160 136 240 132 V160 H0 Z" fill="#a6d977" />
      {/* Rain on the way down. */}
      {[
        [30, 14, -0.2],
        [76, 6, -0.9],
        [120, 10, -0.5],
        [164, 4, -1.2],
        [208, 14, -0.7],
        [52, 40, -1.4],
        [190, 46, -0.1],
      ].map(([x, y, delay]) => (
        <Drip key={`${x}-${y}`} x={x} y={y} delay={delay} fall="34px" fill="#7cc0ea" />
      ))}

      {/* The torn leaf, safe and dry, with a plaster on its tear. */}
      <path d="M104 140 Q 120 128 122 112" fill="none" stroke="#7ba845" strokeWidth="2.5" />
      <path
        d="M98 128 C 94 108 110 96 128 96 C 142 108 140 126 124 134 L 120 128 L 114 134 L 110 128 L 104 134 Z"
        fill="#b8d86a"
      />
      <path d="M104 128 Q 114 112 126 100" fill="none" stroke="#97bb4e" strokeWidth="1.5" />
      <g transform="rotate(-30 128 116)">
        <rect x="120" y="113" width="16" height="7" rx="3" fill="#ffb8a0" />
        <rect x="125" y="113" width="6" height="7" fill="#ffcfbd" />
      </g>
      <circle cx="113" cy="114" r="1.9" fill={INK} />
      <circle cx="122" cy="112" r="1.9" fill={INK} />
      <Stroke d="M115 120 q 3 2 6 -1" width={1.5} />
      <Blush x={110} y={120} r={2} />

      {/* The whole leaf, arched over it like an umbrella. */}
      <Limb d="M178 98 Q 190 118 184 140" fill="#3f9a3c" width={3.5} />
      <g className="animate-idiom-sway origin-right" style={{ animationDuration: "4s" }}>
        <path d="M54 104 Q 120 28 186 104 Q 120 72 54 104 Z" fill="#4fae5a" />
        <path d="M60 102 Q 120 50 180 102" fill="none" stroke="#3f9a3c" strokeWidth="1.8" />
        <path
          d="M84 82 l 8 10 M104 70 l 6 12 M136 70 l -6 12 M156 82 l -8 10"
          stroke="#3f9a3c"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="112" cy="70" r="2" fill={INK} />
        <circle cx="128" cy="70" r="2" fill={INK} />
        <Stroke d="M116 75 q 4 3 8 0" width={1.5} />
      </g>
      {/* Rain rolling off its edges. */}
      <Drip x={54} y={108} delay={-0.4} fall="26px" fill="#7cc0ea" s={0.8} />
      <Drip x={188} y={108} delay={-1.1} fall="26px" fill="#7cc0ea" s={0.8} />
    </>
  );
}

/* ── Tre già măng mọc ───────────────────────────────────────────────────── */

/** A bamboo stalk, segmented, with a tuft of leaves swaying at its top. */
function Bamboo({ x, w, top, fill }: { x: number; w: number; top: number; fill: string }) {
  const nodes: number[] = [];
  for (let y = top + 22; y < 140; y += 24) nodes.push(y);
  return (
    <g>
      <rect x={x} y={top} width={w} height={140 - top} rx="3" fill={fill} />
      {nodes.map((y) => (
        <rect key={y} x={x - 1} y={y} width={w + 2} height="3" rx="1.5" fill="#7a9a3e" />
      ))}
      <g className="animate-idiom-sway origin-left" style={{ animationDuration: "3.2s" }}>
        <ellipse
          cx={x + w + 12}
          cy={top + 14}
          rx="14"
          ry="4"
          fill="#5fae48"
          transform={`rotate(-20 ${x + w + 12} ${top + 14})`}
        />
        <ellipse
          cx={x + w + 10}
          cy={top + 26}
          rx="12"
          ry="3.5"
          fill="#4f9a3c"
          transform={`rotate(15 ${x + w + 10} ${top + 26})`}
        />
      </g>
      <ellipse
        cx={x - 10}
        cy={top + 40}
        rx="12"
        ry="3.5"
        fill="#5fae48"
        transform={`rotate(20 ${x - 10} ${top + 40})`}
      />
    </g>
  );
}

/** A bamboo shoot: a pointed cone wrapped in sheaths. */
function Shoot({ x, h, w }: { x: number; h: number; w: number }) {
  const base = 142;
  return (
    <g>
      <path
        d={`M${x - w} ${base} Q ${x - w * 0.6} ${base - h * 0.7} ${x} ${base - h} Q ${x + w * 0.6} ${base - h * 0.7} ${x + w} ${base} Z`}
        fill="#d9b26a"
      />
      <path
        d={`M${x} ${base - h} Q ${x + w * 0.6} ${base - h * 0.7} ${x + w} ${base} L ${x + w * 0.3} ${base} Q ${x + w * 0.3} ${base - h * 0.5} ${x} ${base - h} Z`}
        fill="#c49a4f"
      />
      <path
        d={`M${x - w * 0.8} ${base - h * 0.3} Q ${x} ${base - h * 0.45} ${x + w * 0.8} ${base - h * 0.3}`}
        fill="none"
        stroke="#a87f3a"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </g>
  );
}

function TreGiaMangMoc() {
  return (
    <>
      <rect width="240" height="160" fill="#e3f4ff" />
      <circle cx="210" cy="24" r="12" fill="#ffd23f" />
      <path d="M0 138 C 80 130 160 134 240 130 V160 H0 Z" fill="#9ad46c" />
      {/* The old bamboo, tall and yellowing. */}
      <Bamboo x={44} w={13} top={6} fill="#b5c167" />
      <Bamboo x={76} w={11} top={22} fill="#a6bd5c" />
      <Bamboo x={190} w={12} top={14} fill="#b5c167" />

      {/* The young shoots coming up at its feet. */}
      <Shoot x={150} h={22} w={8} />
      <Shoot x={100} h={16} w={6} />
      <g className="animate-idiom-bob" style={{ animationDuration: "2s" }}>
        <Shoot x={126} h={46} w={14} />
        <circle cx="121" cy="124" r="1.9" fill={INK} />
        <circle cx="131" cy="124" r="1.9" fill={INK} />
        <Stroke d="M123 130 q 3 2.5 6 0" width={1.5} />
        <Blush x={117} y={129} r={2} />
        <Blush x={135} y={129} r={2} />
      </g>
      <Sparkle x={150} y={100} s={0.7} delay={-0.3} />
      <Sparkle x={98} y={108} s={0.5} delay={-1} />
    </>
  );
}

/* ── Nước đến chân mới nhảy ─────────────────────────────────────────────── */

const WAVE =
  "M-20 120 Q -10 114 0 120 T 20 120 T 40 120 T 60 120 T 80 120 T 100 120 T 120 120 T 140 120 T 160 120 T 180 120 T 200 120 T 220 120 T 240 120 T 260 120 V160 H-20 Z";

function NuocDenChanMoiNhay() {
  return (
    <>
      <rect width="240" height="160" fill="#cdeffd" />
      <Cloud x={40} y={26} />
      <Cloud x={190} y={18} s={0.7} />
      {/* The stool the child was lazing on, already under water. */}
      <rect x="46" y="104" width="30" height="7" rx="2" fill="#b0703e" />
      <rect x="50" y="110" width="4" height="14" fill="#8e562c" />
      <rect x="68" y="110" width="4" height="14" fill="#8e562c" />

      {/* The child, leaping at the last moment. */}
      <g className="animate-idiom-bob" style={{ animationDuration: "0.6s" }}>
        <Limb d="M114 98 L 110 112" fill="#3f6fb5" width={6} />
        <Limb d="M126 98 L 132 110" fill="#3f6fb5" width={6} />
        <Limb d="M110 74 L 96 56" fill={SKIN} width={5} />
        <Limb d="M130 74 L 144 56" fill={SKIN} width={5} />
        <path d="M106 70 L 134 70 L 136 100 L 104 100 Z" fill="#ffd23f" />
        <circle cx="120" cy="56" r="13" fill={SKIN} />
        <path
          d="M107 54 Q 108 40 122 42 Q 134 44 133 54 Q 126 46 116 48 Q 110 50 107 54 Z"
          fill="#2b2b2b"
        />
        <circle cx="115" cy="56" r="2" fill={INK} />
        <circle cx="125" cy="56" r="2" fill={INK} />
        <ellipse cx="120" cy="63" rx="2.6" ry="3" fill={INK} />
        <Drip x={136} y={46} delay={-0.3} fall="10px" s={0.6} fill="#8fd3ff" />
      </g>

      {/* The floodwater, lapping at the child's feet. */}
      <g className="animate-idiom-swim" style={{ animationDuration: "2s" }}>
        <path d={WAVE} fill="#4aa3df" />
        <path
          d="M10 132 h14 M70 140 h18 M150 134 h16 M200 144 h14"
          stroke="#8fd3ff"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
      <Drip x={102} y={110} delay={-0.4} fall="12px" s={0.8} />
      <Drip x={140} y={108} delay={-0.9} fall="12px" s={0.8} />
      {/* A rubber duck floating by, unbothered. */}
      <g className="animate-idiom-bob" style={{ animationDuration: "1.6s" }}>
        <ellipse cx="192" cy="118" rx="11" ry="6" fill="#ffd23f" />
        <circle cx="184" cy="108" r="6" fill="#ffd23f" />
        <path d="M178 108 L 172 110 L 178 112 Z" fill="#ff9a3c" />
        <circle cx="183" cy="106.5" r="1.2" fill={INK} />
      </g>
    </>
  );
}

/* ── Thùng rỗng kêu to ──────────────────────────────────────────────────── */

const WOOD = "#c98a54";
const HOOP = "#8b5a2b";

function ThungRongKeuTo() {
  return (
    <>
      <rect width="240" height="160" fill="#fff1e0" />
      <rect x="0" y="130" width="240" height="30" fill="#e8c79a" />

      {/* The empty barrel, rattling and booming. */}
      <g className="animate-idiom-sway origin-bottom" style={{ animationDuration: "0.5s" }}>
        <rect x="50" y="62" width="58" height="70" rx="16" fill={WOOD} />
        <path d="M79 62 H92 a16 16 0 0 1 16 16 V116 a16 16 0 0 1 -16 16 H79 Z" fill="#b97b46" />
        <rect x="50" y="74" width="58" height="5" fill={HOOP} />
        <rect x="50" y="116" width="58" height="5" fill={HOOP} />
        <ellipse cx="79" cy="64" rx="27" ry="7" fill="#5b3416" />
        <circle cx="70" cy="92" r="2.4" fill={INK} />
        <circle cx="88" cy="92" r="2.4" fill={INK} />
        <ellipse cx="79" cy="104" rx="7" ry="6" fill={INK} />
        <ellipse cx="79" cy="107" rx="4" ry="2.5" fill="#f2899c" />
      </g>
      {/* A drumstick mid-knock, and the noise flying off. */}
      <g className="animate-idiom-bob" style={{ animationDuration: "0.5s" }}>
        <Limb d="M118 54 L 104 66" fill="#a8743f" width={4} />
        <circle cx="120" cy="52" r="4" fill="#8b5a2b" />
      </g>
      <g className="animate-idiom-twinkle">
        <path
          d="M38 72 q -8 12 0 24 M28 64 q -14 20 0 40"
          fill="none"
          stroke="#e8629a"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
      <g className="animate-idiom-twinkle" style={{ animationDelay: "-0.6s" }}>
        <path
          d="M66 44 l -4 -12 M80 40 v -14 M94 44 l 4 -12"
          stroke="#e8903a"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* The full barrel, heaped with rice, quiet and content. */}
      <rect x="146" y="70" width="54" height="62" rx="16" fill={WOOD} />
      <path d="M173 70 H184 a16 16 0 0 1 16 16 V116 a16 16 0 0 1 -16 16 H173 Z" fill="#b97b46" />
      <rect x="146" y="82" width="54" height="5" fill={HOOP} />
      <rect x="146" y="118" width="54" height="5" fill={HOOP} />
      <path d="M148 74 Q 173 48 198 74 Z" fill="#fff6df" />
      {[
        [162, 66],
        [172, 60],
        [182, 66],
        [176, 70],
        [166, 72],
      ].map(([x, y]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="2" ry="1.2" fill="#eadcbc" />
      ))}
      <Stroke d="M162 98 q 3 -3 6 0 M178 98 q 3 -3 6 0" width={1.6} />
      <Stroke d="M169 106 q 4 3 8 0" width={1.5} />
      <Blush x={160} y={104} />
      <Blush x={186} y={104} />
    </>
  );
}

/* ── Ăn quả nhớ kẻ trồng cây ────────────────────────────────────────────── */

function AnQuaNhoKeTrongCay() {
  return (
    <>
      <rect width="240" height="160" fill="#e0f4ff" />
      <Cloud x={204} y={22} s={0.8} />
      <path d="M0 124 C 80 116 160 120 240 116 V160 H0 Z" fill="#9ad46c" />
      {/* The tree, heavy with fruit. */}
      <rect x="112" y="64" width="16" height="62" rx="3" fill="#8b5a2b" />
      <circle cx="98" cy="62" r="24" fill="#5fc06a" />
      <circle cx="144" cy="60" r="24" fill="#46a052" />
      <circle cx="120" cy="44" r="32" fill="#4fae5a" />
      {[
        [100, 40, "#ff7a3d"],
        [132, 32, "#ffb02e"],
        [142, 58, "#ff7a3d"],
        [96, 66, "#ffb02e"],
        [118, 58, "#ff7a3d"],
        [154, 44, "#ffb02e"],
      ].map(([x, y, c]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x as number} cy={y as number} r="5.5" fill={c as string} />
          <ellipse cx={(x as number) + 2} cy={(y as number) - 6} rx="2.5" ry="1.2" fill="#2f7d33" />
        </g>
      ))}

      {/* Ông, who planted it, watering it under his nón lá. */}
      <path d="M30 128 L 34 92 Q 46 84 58 92 L 62 128 Z" fill="#7a8fb0" />
      <circle cx="46" cy="78" r="12" fill={SKIN} />
      <path d="M38 82 Q 46 98 54 82 Q 46 88 38 82 Z" fill="#f4f1ea" />
      <Stroke d="M41 76 q 2 -2 4 0 M48 76 q 2 -2 4 0" width={1.5} />
      <path d="M26 72 L 46 52 L 66 72 Z" fill="#f1d58a" />
      <path d="M46 52 L 66 72 L 50 72 Z" fill="#e2c26c" />
      <Limb d="M56 98 L 70 104" fill={SKIN} width={5} />
      <rect x="66" y="98" width="18" height="14" rx="3" fill="#5fb0d9" />
      <Limb d="M84 102 L 98 94" fill="#5fb0d9" width={3.5} />
      <Drip x={100} y={98} delay={-0.2} fall="20px" s={0.7} />
      <Drip x={103} y={100} delay={-0.8} fall="20px" s={0.6} />

      {/* The child, eating the fruit and sending thanks his way. */}
      <path d="M176 128 L 180 98 Q 192 90 204 98 L 208 128 Z" fill="#ff8fb3" />
      <circle cx="192" cy="82" r="12" fill={SKIN} />
      <path
        d="M180 80 Q 180 66 194 68 Q 206 70 204 80 Q 198 72 190 74 Q 184 74 180 80 Z"
        fill="#2b2b2b"
      />
      <Stroke d="M185 82 q 2 -2 4 0" width={1.5} />
      <Blush x={198} y={88} r={2.2} />
      <Limb d="M182 104 L 178 92" fill={SKIN} width={5} />
      <circle cx="178" cy="88" r="6" fill="#ff7a3d" />
      <Rise x={164} y={74} delay={-0.4} dx="-18px">
        <path d={HEART} fill="#ff6b8b" />
      </Rise>
      <Rise x={170} y={68} delay={-1.5} dx="-24px">
        <path d={HEART} fill="#ff9cc4" transform="scale(0.8)" />
      </Rise>
    </>
  );
}

/* ── Chó treo mèo đậy ───────────────────────────────────────────────────── */

const DOG = "#e0b07a";
const GREY_CAT = "#9aa5b1";

function ChoTreoMeoDay() {
  return (
    <>
      <rect width="240" height="160" fill="#fff1d6" />
      <rect x="0" y="0" width="240" height="6" fill="#d9b48b" />
      <rect x="0" y="130" width="240" height="30" fill="#e8c79a" />

      {/* The food basket, hung out of the dog's reach. */}
      <g className="animate-idiom-sway origin-top" style={{ animationDuration: "3s" }}>
        <line x1="70" y1="6" x2="70" y2="34" stroke="#8b5a2b" strokeWidth="1.8" />
        <path d="M76 30 l 8 -10 l 3 12 Z" fill="#e2a03c" />
        <path d="M50 34 Q 70 64 90 34 Z" fill="#d9b26a" />
        <path
          d="M56 40 Q 70 50 84 40 M60 48 Q 70 54 80 48"
          fill="none"
          stroke="#b8904a"
          strokeWidth="1.4"
        />
      </g>

      {/* The dog, hopping for it and never getting there. */}
      <g className="animate-idiom-bob" style={{ animationDuration: "0.8s" }}>
        <g className="animate-idiom-sway origin-left" style={{ animationDuration: "0.5s" }}>
          <Limb d="M96 112 Q 108 104 106 94" fill="#c9955f" width={5} />
        </g>
        <rect x="70" y="116" width="7" height="16" rx="3" fill="#c9955f" />
        <rect x="88" y="116" width="7" height="16" rx="3" fill="#c9955f" />
        <ellipse cx="82" cy="114" rx="20" ry="12" fill={DOG} />
        <ellipse cx="74" cy="118" rx="9" ry="6" fill="#f3d4ad" />
        <circle cx="64" cy="94" r="13" fill="#ecc08f" />
        <ellipse cx="54" cy="94" rx="5" ry="10" fill="#a8743f" transform="rotate(20 54 94)" />
        <ellipse cx="62" cy="102" rx="8" ry="6" fill="#f3d4ad" />
        <circle cx="58" cy="99" r="2.2" fill={INK} />
        <circle cx="66" cy="89" r="2" fill={INK} />
        <circle cx="66.6" cy="88.3" r="0.7" fill="#fff" />
        <ellipse cx="62" cy="108" rx="2.5" ry="3.5" fill="#f2899c" />
      </g>

      {/* The dish under its woven lồng bàn, out of the cat's paws. */}
      <rect x="132" y="104" width="96" height="6" rx="2" fill="#b0703e" />
      <rect x="140" y="110" width="6" height="22" fill="#8e562c" />
      <rect x="214" y="110" width="6" height="22" fill="#8e562c" />
      <path d="M140 104 Q 172 60 204 104 Z" fill="#e8b84a" />
      <path
        d="M150 98 Q 172 80 194 98 M156 88 Q 172 76 188 88 M164 76 L 160 104 M172 70 V 104 M180 76 L 184 104"
        fill="none"
        stroke="#c9952e"
        strokeWidth="1.4"
      />
      <circle cx="172" cy="70" r="3.5" fill="#c9952e" />

      {/* The cat, nose to the cover, wondering. */}
      <path
        d="M232 100 Q 240 86 232 76"
        fill="none"
        stroke={GREY_CAT}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <ellipse cx="222" cy="94" rx="11" ry="10" fill={GREY_CAT} />
      <path d="M204 76 L 206 66 L 212 74 Z M216 76 L 216 66 L 210 72 Z" fill="#aab4bf" />
      <circle cx="210" cy="82" r="9" fill="#aab4bf" />
      <circle cx="206" cy="81" r="1.8" fill={INK} />
      <circle cx="213" cy="81" r="1.8" fill={INK} />
      <path d="M208 86 h3 l-1.5 1.8 Z" fill="#f2899c" />
      <Rise x={214} y={64} delay={-0.6} dx="4px">
        <text
          x="0"
          y="0"
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          fill="#8b74f0"
          fontFamily="Arimo, sans-serif"
        >
          ?
        </text>
      </Rise>
    </>
  );
}

const SCENES: Record<string, () => ReactNode> = {
  "ech-ngoi-day-gieng": EchNgoiDayGieng,
  "dan-gay-tai-trau": DanGayTaiTrau,
  "nuoc-do-dau-vit": NuocDoDauVit,
  "dau-voi-duoi-chuot": DauVoiDuoiChuot,
  "meo-mu-vo-ca-ran": MeoMuVoCaRan,
  "cuoi-ngua-xem-hoa": CuoiNguaXemHoa,
  "nhu-ca-gap-nuoc": NhuCaGapNuoc,
  "cham-nhu-rua": ChamNhuRua,
  "vui-nhu-tet": VuiNhuTet,
  "uong-nuoc-nho-nguon": UongNuocNhoNguon,
  "nuoc-chay-da-mon": NuocChayDaMon,
  "khoe-nhu-voi": KhoeNhuVoi,
  "nhanh-nhu-soc": NhanhNhuSoc,
  "kien-tha-lau-cung-day-to": KienThaLauCungDayTo,
  "la-lanh-dum-la-rach": LaLanhDumLaRach,
  "tre-gia-mang-moc": TreGiaMangMoc,
  "nuoc-den-chan-moi-nhay": NuocDenChanMoiNhay,
  "thung-rong-keu-to": ThungRongKeuTo,
  "an-qua-nho-ke-trong-cay": AnQuaNhoKeTrongCay,
  "cho-treo-meo-day": ChoTreoMeoDay,
};
