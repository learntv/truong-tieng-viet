import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Icon } from "@iconify/react";
import roundPlace from "@iconify-icons/ic/round-place";
import phanThiQuynhTrang from "@/assets/teachers/phan-thi-quynh-trang.webp";
import ngoNguyenNgocDieuAnh from "@/assets/teachers/ngo-nguyen-ngoc-dieu-anh.webp";
import nguyenThiThanhBinh from "@/assets/teachers/nguyen-thi-thanh-binh.webp";
import hoangMinhHa from "@/assets/teachers/hoang-minh-ha.webp";
import doThiPhuongMai from "@/assets/teachers/do-thi-phuong-mai.webp";
import cvcecEmblem from "@/assets/cvcec-emblem.webp";
import hikingMascot from "@/assets/mascot/hiking.png";
import cheerMascot from "@/assets/mascot/cheer.png";
import { m } from "@/paraglide/messages";

/** Role, place and bio are message functions, read at render time so they
    follow the visitor's language. Names stay as they are. */
type Teacher = {
  name: string;
  photo: string;
  role: () => string;
  place: () => string;
  bio: () => string;
};

const TEACHERS: Teacher[] = [
  {
    name: "Phan Thị Quỳnh Trang",
    photo: phanThiQuynhTrang,
    role: m.home_teacher_role_president,
    place: m.home_teacher_place_canada,
    bio: m.home_teacher_bio_trang,
  },
  {
    name: "Hoàng Minh Hà",
    photo: hoangMinhHa,
    role: m.home_teacher_role_academic_director,
    place: m.home_teacher_place_pei,
    bio: m.home_teacher_bio_ha,
  },
  {
    name: "Đỗ Thị Phương Mai",
    photo: doThiPhuongMai,
    role: m.home_teacher_role_academic_advisor,
    place: m.home_teacher_place_finland,
    bio: m.home_teacher_bio_mai,
  },
  {
    name: "Nguyễn Thị Thanh Bình",
    photo: nguyenThiThanhBinh,
    role: m.home_teacher_role_teacher,
    place: m.home_teacher_place_pei,
    bio: m.home_teacher_bio_binh,
  },
  {
    name: "Ngô Nguyễn Ngọc Diệu Anh",
    photo: ngoNguyenNgocDieuAnh,
    role: m.home_teacher_role_teacher,
    place: m.home_teacher_place_manitoba,
    bio: m.home_teacher_bio_dieu_anh,
  },
];

/**
 * A footpath winding down the lawn past each teacher, like the Vui Học
 * overworld map turned on its side: the visitor walks down and meets every
 * teacher in turn. Nothing to click, every card shows its full bio.
 *
 * On wide screens the cards zigzag in two staggered columns, with the path
 * weaving behind them from one to the next. Every card spans two grid rows,
 * starting one row below the card before it, so each one sits half a card
 * lower than its neighbour whatever their heights, and never overlaps the
 * card above it. On phones the cards stack and the path runs down the left
 * gutter.
 *
 * A stop is marked with CSS on each card, then everything else is drawn
 * around wherever the cards land: the path through the stops, and
 * the scenery (the buffalo, a pond, trees) in the lawn left between them.
 */
export function TeachersTab() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const stopRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [scene, setScene] = useState<Scene | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const list = listRef.current;
    if (!wrap || !list) return;
    const measure = () => {
      const box = wrap.getBoundingClientRect();
      const rel = (el: Element): Box => {
        const r = el.getBoundingClientRect();
        return { x: r.left - box.left, y: r.top - box.top, w: r.width, h: r.height };
      };
      const cards = cardRefs.current.flatMap((el) => (el ? [rel(el)] : []));
      const stops = stopRefs.current.flatMap((el) => (el ? [rel(el)] : []));
      setScene({
        cards,
        stops,
        gap: parseFloat(getComputedStyle(list).rowGap) || 0,
        wide: cards.length > 1 && cards[1].x > cards[0].x + 20,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div ref={wrapRef} className="relative">
        {scene && <TrailMap scene={scene} />}
        <ol
          ref={listRef}
          className="grid grid-cols-1 gap-y-10 pl-9 md:grid-cols-2 md:gap-x-8 md:pl-0"
        >
          {TEACHERS.map((t, i) => {
            const left = i % 2 === 0;
            return (
              <li
                key={t.name}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                style={{ "--row": `${i + 1} / span 2` } as CSSProperties}
                className={`relative self-start md:[grid-row:var(--row)] ${left ? "md:col-start-1" : "md:col-start-2"}`}
              >
                {/* Zero-size mark the path is drawn through: beside the photo in the
                    phone gutter, the card's middle on wide screens. */}
                <span
                  ref={(el) => {
                    stopRefs.current[i] = el;
                  }}
                  aria-hidden
                  className="absolute -left-4.5 top-20 md:left-1/2 md:top-1/2"
                />
                <TeacherCard teacher={t} />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ── The map around the cards ───────────────────────────────────────────── */

type Point = { x: number; y: number };
type Box = Point & { w: number; h: number };
/** Where the cards and stops landed, in pixels from the list's top left. */
type Scene = { cards: Box[]; stops: Point[]; gap: number; wide: boolean };
type Placed = { kind: PropKind; x: number; y: number; s: number };
type Walker = { pose: keyof typeof WALKERS; x: number; y: number; h: number };

const WALKERS = {
  hiking: { src: hikingMascot, ratio: 300 / 360 },
  cheer: { src: cheerMascot, ratio: 318 / 384 },
};

/**
 * Works out the route and the scenery from where the cards landed. On wide
 * screens the two gaps the stagger leaves, above the first right-hand card
 * and beside the last card, get a scene each: the buffalo setting off by a
 * pond at the top, and cheering at the end of the path at the bottom. Phones
 * get the path alone.
 */
function layOut({ cards, stops, gap, wide }: Scene) {
  const props: Placed[] = [];
  const walkers: Walker[] = [];
  // The path comes in from the banner above, straight down to the first stop.
  const route = stops.length ? [{ x: stops[0].x, y: -36 }, ...stops] : [];

  if (!wide) return { route, props, walkers };

  // The start: above the first right-hand card, where the path comes down
  // into it. The buffalo walks it, with a pond off to the side.
  const top = { x: cards[1].x, y: 0, w: cards[1].w, h: cards[1].y - 8 };
  if (top.h > 80) {
    const ground = top.y + top.h - 6;
    const h = Math.min(110, top.h - 10);
    walkers.push({ pose: "hiking", x: stops[1].x - h * WALKERS.hiking.ratio - 14, y: ground, h });
    const pondS = Math.min(1.1, (top.w * 0.17) / 60, (top.h * 0.3) / 22);
    props.push({ kind: "pond", x: top.x + top.w * 0.82, y: top.y + top.h * 0.72, s: pondS });
    props.push({ kind: "tree", x: top.x + top.w - 26, y: top.y + top.h * 0.45, s: 1.2 });
  }

  // The end: beside the last card, below the last one in the other column.
  const last = cards.length - 1;
  const other = cards[last - 1];
  const endTop = other.y + other.h + gap;
  const end = { x: other.x, y: endTop, w: other.w, h: cards[last].y + cards[last].h - endTop };
  if (end.h > 80) {
    // Measured in from the edge facing the path, so it mirrors on either side.
    const lastLeft = last % 2 === 0;
    const at = (d: number) => (lastLeft ? end.x + d : end.x + end.w - d);
    const ground = end.y + end.h - 6;
    const h = Math.min(110, end.h - 10);
    const w = h * WALKERS.cheer.ratio;
    route.push({ x: at(36), y: ground - 8 });
    walkers.push({ pose: "cheer", x: lastLeft ? at(56) : at(56) - w, y: ground, h });
    props.push({ kind: "bamboo", x: at(end.w * 0.62), y: ground - 6, s: 1.2 });
    props.push({ kind: "tree", x: at(end.w - 40), y: ground, s: 1.3 });
  }

  return { route, props, walkers };
}

/**
 * The path through every stop in order, with the scenery around it, all
 * drawn under the cards. On wide screens each stop is a card's middle, so the
 * path runs behind one card, out across the lawn, and in behind the next.
 * On phones, where the stops line up in the gutter, it bows alternately left
 * and right so it still meanders; opposite bows give matching tangents at
 * each stop, so it reads as one smooth line. Scenery is drawn back to front,
 * so a thing lower on the lawn stands in front of one above it.
 */
function TrailMap({ scene }: { scene: Scene }) {
  const { route, props, walkers } = layOut(scene);
  const d = route
    .map((q, i) => {
      if (i === 0) return `M ${q.x} ${q.y}`;
      const p = route[i - 1];
      if (Math.abs(q.x - p.x) < 4) {
        const my = (p.y + q.y) / 2;
        const bow = i % 2 ? 14 : -14;
        return `C ${p.x + bow} ${my} ${q.x + bow} ${my} ${q.x} ${q.y}`;
      }
      // Across the columns: straight down out of one card, over the lawn,
      // and down into the next from above.
      const k = (q.y - p.y) * 0.55;
      return `C ${p.x} ${p.y + k} ${q.x} ${q.y - k} ${q.x} ${q.y}`;
    })
    .join(" ");
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
    >
      {/* A sandy track with footstep dashes along its middle. */}
      <path d={d} fill="none" stroke="#efe2bf" strokeWidth={16} strokeLinecap="round" />
      <path
        d={d}
        fill="none"
        stroke="#c8ad72"
        strokeWidth={3}
        strokeDasharray="3 9"
        strokeLinecap="round"
      />
      {props
        .sort((a, b) => a.y - b.y)
        .map((p, i) => {
          const Prop = PROPS[p.kind];
          return (
            <g key={i} transform={`translate(${p.x} ${p.y}) scale(${p.s})`}>
              <Prop />
            </g>
          );
        })}
      {walkers.map((w) => (
        <image
          key={w.pose}
          href={WALKERS[w.pose].src}
          x={w.x}
          y={w.y - w.h}
          height={w.h}
          width={w.h * WALKERS[w.pose].ratio}
        />
      ))}
    </svg>
  );
}

/* ── Scenery ────────────────────────────────────────────────────────────────
 * Painted flat like the Thành ngữ scenes: fills only, a shade apart where two
 * shapes overlap. Each one stands on the ground at 0,0 and grows upward,
 * except the pond, which lies centred on it.
 */

const LEAF = "#5fc06a";
const LEAF_MID = "#4fae5a";
const LEAF_DARK = "#46a052";
const BARK = "#8b5a2b";

const PROPS = {
  tree: () => (
    <>
      <ellipse rx="14" ry="3.5" fill="#000" opacity="0.08" />
      <rect x="-3" y="-18" width="6" height="18" rx="2" fill={BARK} />
      <circle cy="-30" r="15" fill={LEAF_MID} />
      <circle cx="-9" cy="-22" r="9" fill={LEAF} />
      <circle cx="9" cy="-23" r="9" fill={LEAF_DARK} />
    </>
  ),
  bamboo: () => (
    <>
      {[
        { x: -7, h: 44 },
        { x: 0, h: 54 },
        { x: 7, h: 40 },
      ].map(({ x, h }) => (
        <g key={x}>
          <rect x={x - 2} y={-h} width="4" height={h} rx="2" fill="#7cc35b" />
          {Array.from({ length: Math.floor(h / 12) }, (_, n) => (
            <rect key={n} x={x - 2} y={-12 * (n + 1)} width="4" height="1.5" fill="#5a9e3f" />
          ))}
          <ellipse
            cx={x + 6}
            cy={-h + 4}
            rx="6"
            ry="2"
            fill={LEAF_DARK}
            transform={`rotate(-25 ${x + 6} ${-h + 4})`}
          />
        </g>
      ))}
    </>
  ),
  pond: () => (
    <>
      <ellipse rx="60" ry="22" fill="#8fd3f4" />
      <ellipse cx="-6" cy="-3" rx="44" ry="13" fill="#b4e4fa" />
      <path d="M-28 4 m-7 0 a7 5 0 1 0 14 0 L-28 4 Z" fill={LEAF} />
      <circle cx="22" cy="-4" r="7" fill={LEAF_MID} />
      <circle cx="36" cy="7" r="5" fill={LEAF} />
      <g transform="translate(22 -7)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cy="-3"
            rx="2.2"
            ry="3.6"
            fill="#ff9cc4"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="1.8" fill="#ffd23f" />
      </g>
    </>
  ),
};

type PropKind = keyof typeof PROPS;

function TeacherCard({ teacher: t }: { teacher: Teacher }) {
  return (
    <article className="rounded-3xl bg-card p-5 shadow-card sm:p-7">
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="relative w-28 shrink-0 sm:w-44">
          <img
            src={t.photo}
            alt={t.name}
            loading="lazy"
            className="aspect-square w-full rounded-2xl object-cover object-top"
          />
          <img
            src={cvcecEmblem}
            alt="CVCEC"
            loading="lazy"
            className="absolute -bottom-2 -left-2 h-10 w-10 rounded-full bg-white p-1 shadow-md ring-4 ring-card sm:h-12 sm:w-12"
          />
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-xl font-bold leading-snug text-foreground sm:text-2xl">
            {t.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">{t.role()}</p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground sm:text-base">
            <Icon icon={roundPlace} className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden />
            {t.place()}
          </p>
        </div>
      </div>
      <p className="mt-5 text-base leading-relaxed text-foreground sm:text-lg">{t.bio()}</p>
    </article>
  );
}
