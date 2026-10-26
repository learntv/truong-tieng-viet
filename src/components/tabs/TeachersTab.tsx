import { Fragment, useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import roundChevronLeft from "@iconify-icons/ic/round-chevron-left";
import roundChevronRight from "@iconify-icons/ic/round-chevron-right";
import roundPlace from "@iconify-icons/ic/round-place";
import roundClose from "@iconify-icons/ic/round-close";
import phanThiQuynhTrang from "@/assets/teachers/phan-thi-quynh-trang.webp";
import ngoNguyenNgocDieuAnh from "@/assets/teachers/ngo-nguyen-ngoc-dieu-anh.webp";
import nguyenThiThanhBinh from "@/assets/teachers/nguyen-thi-thanh-binh.webp";
import hoangMinhHa from "@/assets/teachers/hoang-minh-ha.webp";
import doThiPhuongMai from "@/assets/teachers/do-thi-phuong-mai.webp";
import cvcecEmblem from "@/assets/cvcec-emblem.webp";
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
 * Five equal cards. A six-column grid with every card spanning two lets the
 * second row of two start at column 2, so it sits centred under the three.
 * At two columns the odd last card spans both and is held to half width.
 *
 * Clicking a card opens its bio in a full-width panel inserted right after
 * that card's row (before it, for the last row), with a notch pointing at
 * the card. Clicking another
 * card swaps the panel's content in place, so there is nothing to close.
 */
export function TeachersTab() {
  const [selected, setSelected] = useState<number | null>(null);
  const layout = useLayout();
  const panelRef = useRef<HTMLLIElement>(null);

  const rows = ROWS[layout];
  const selectedRow = selected === null ? -1 : rows.findIndex((r) => r.includes(selected));
  // The last row opens the panel above itself, so it never trails off the
  // bottom of the grid; every other row opens it below.
  const above = selectedRow > 0 && selectedRow === rows.length - 1;
  const anchor = selectedRow === -1 ? -1 : above ? rows[selectedRow][0] : rows[selectedRow].at(-1)!;

  useEffect(() => {
    if (selected === null) return;
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const step = (delta: number) =>
    setSelected((i) => (i === null ? i : (i + delta + TEACHERS.length) % TEACHERS.length));

  const panel = selected !== null && (
    <li
      ref={panelRef}
      key={`panel-${selectedRow}`}
      className={`col-span-full animate-in fade-in duration-300 ${above ? "-mb-4 slide-in-from-bottom-3" : "-mt-4 slide-in-from-top-3"}`}
    >
      <BioPanel
        teacher={TEACHERS[selected]}
        notchLeft={NOTCH[layout][selected]}
        notchBelow={above}
        onClose={() => setSelected(null)}
        onPrev={() => step(-1)}
        onNext={() => step(1)}
      />
    </li>
  );

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <ul className="grid gap-x-8 gap-y-10 px-3 sm:grid-cols-2 lg:grid-cols-6">
        {TEACHERS.map((t, i) => (
          <Fragment key={t.name}>
            {above && i === anchor && panel}
            <li className={CARD_CLASS[i] ?? "lg:col-span-2"}>
              <TeacherCard
                teacher={t}
                active={selected === i}
                dimmed={selected !== null && selected !== i}
                onClick={() => setSelected(selected === i ? null : i)}
              />
            </li>
            {!above && i === anchor && panel}
          </Fragment>
        ))}
      </ul>
    </section>
  );
}

/**
 * Placement by index rather than nth-child, since the bio panel is its own
 * list item and would shift the count.
 */
const CARD_CLASS: Record<number, string> = {
  3: "lg:col-span-2 lg:col-start-2",
  4: "sm:col-span-2 sm:mx-auto sm:w-1/2 lg:mx-0 lg:w-auto",
};

type Layout = "one" | "two" | "three";

/** Card indexes per visual row, matching the grid classes above. */
const ROWS: Record<Layout, number[][]> = {
  one: [[0], [1], [2], [3], [4]],
  two: [[0, 1], [2, 3], [4]],
  three: [
    [0, 1, 2],
    [3, 4],
  ],
};

/** Horizontal centre of each card, as a share of the grid width, for the notch. */
const NOTCH: Record<Layout, string[]> = {
  one: ["50%", "50%", "50%", "50%", "50%"],
  two: ["25%", "75%", "25%", "75%", "50%"],
  three: ["16.67%", "50%", "83.33%", "33.33%", "66.67%"],
};

function useLayout(): Layout {
  const [layout, setLayout] = useState<Layout>("three");
  useEffect(() => {
    const lg = window.matchMedia("(min-width: 1024px)");
    const sm = window.matchMedia("(min-width: 640px)");
    const update = () => setLayout(lg.matches ? "three" : sm.matches ? "two" : "one");
    update();
    lg.addEventListener("change", update);
    sm.addEventListener("change", update);
    return () => {
      lg.removeEventListener("change", update);
      sm.removeEventListener("change", update);
    };
  }, []);
  return layout;
}

function BioPanel({
  teacher: t,
  notchLeft,
  notchBelow,
  onClose,
  onPrev,
  onNext,
}: {
  teacher: Teacher;
  notchLeft: string;
  notchBelow: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="relative rounded-3xl bg-muted p-6 sm:p-8">
      <span
        aria-hidden
        className={`absolute ${notchBelow ? "-bottom-2" : "-top-2"} h-4 w-4 -translate-x-1/2 rotate-45 bg-muted transition-[left] duration-300 ease-out`}
        style={{ left: notchLeft }}
      />
      <button
        type="button"
        onClick={onClose}
        aria-label={m.home_teachers_close()}
        className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
      >
        <Icon icon={roundClose} className="h-5 w-5" aria-hidden />
      </button>

      {/* Keyed by teacher so switching cards fades the new bio in. */}
      <div key={t.name} className="animate-in fade-in slide-in-from-bottom-1 duration-300">
        <h3 className="pr-8 font-display text-xl font-bold leading-snug text-foreground">
          {t.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{t.role()}</p>
        <Place place={t.place()} className="mt-2" />
        <p className="mt-4 text-base leading-relaxed text-foreground">{t.bio()}</p>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={onPrev}
          aria-label={m.home_teachers_prev()}
          className="rounded-full bg-background p-2 text-foreground transition-colors hover:text-primary"
        >
          <Icon icon={roundChevronLeft} className="h-5 w-5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label={m.home_teachers_next()}
          className="rounded-full bg-background p-2 text-foreground transition-colors hover:text-primary"
        >
          <Icon icon={roundChevronRight} className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}

function TeacherCard({
  teacher: t,
  active,
  dimmed,
  onClick,
}: {
  teacher: Teacher;
  active: boolean;
  dimmed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={active}
      className={`group flex h-full w-full cursor-pointer flex-col text-center transition-opacity duration-300 ${dimmed ? "opacity-50 hover:opacity-100" : ""}`}
    >
      <div className="relative">
        <img
          src={t.photo}
          alt={t.name}
          loading="lazy"
          className={`aspect-square w-full rounded-3xl object-cover object-top ring-offset-4 ring-offset-background transition-shadow duration-300 ${active ? "ring-4 ring-primary" : ""}`}
        />
        <img
          src={cvcecEmblem}
          alt="CVCEC"
          loading="lazy"
          className="absolute -bottom-3 -left-3 h-14 w-14 rounded-full bg-white p-1.5 shadow-md ring-4 ring-background"
        />
      </div>
      <span
        className={`mt-5 px-2 font-display text-lg font-bold leading-snug group-hover:text-primary ${active ? "text-primary" : "text-foreground"}`}
      >
        {t.name}
      </span>
      <span className="mt-0.5 px-2 text-sm text-muted-foreground">{t.role()}</span>
      <span className="px-2 text-sm text-muted-foreground">{t.place()}</span>
    </button>
  );
}

function Place({ place, className }: { place: string; className: string }) {
  return (
    <span className={`${className} inline-flex items-center gap-1.5 text-sm text-muted-foreground`}>
      <Icon icon={roundPlace} className="h-4 w-4 shrink-0" aria-hidden />
      {place}
    </span>
  );
}
