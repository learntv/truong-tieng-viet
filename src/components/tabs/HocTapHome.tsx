import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import quyen1Cover from "@/assets/quyen_1_cover.jpg";
import quyen2Cover from "@/assets/quyen_2_cover.jpg";
import thumbBangChuCai from "@/assets/hoc-tap-thumb-bang-chu-cai.jpg";
import thumbKhaiMinhDuc from "@/assets/hoc-tap-thumb-khai-minh-duc.jpg";
import thumbLuyenNoi from "@/assets/hoc-tap-thumb-luyen-noi.jpg";
import thumbTapViet from "@/assets/hoc-tap-thumb-tap-viet.jpg";
import { Mascot } from "@/components/Mascot";
import { PageBanner } from "@/components/site/PageBanner";
import type { SkyBoxTone } from "@/components/ui/sky-box";

/** The SkyBox tones, plus a pastel yellow livelier than cream. */
type Tone = Exclude<SkyBoxTone, "white" | "red"> | "sun";

/** `outline` is the hover rim: a deeper, more saturated shade of the card's own tone. */
const TONES: Record<Tone, { light: string; deep: string; outline: string }> = {
  lavender: { light: "bg-box-lavender", deep: "bg-box-lavender-deep", outline: "hover:outline-[#8b74f0]" },
  peach: { light: "bg-box-peach", deep: "bg-box-peach-deep", outline: "hover:outline-[#e8903a]" },
  ice: { light: "bg-box-ice", deep: "bg-box-ice-deep", outline: "hover:outline-[#3fa9e6]" },
  pink: { light: "bg-box-pink", deep: "bg-box-pink-deep", outline: "hover:outline-[#e8629a]" },
  mint: { light: "bg-box-mint", deep: "bg-box-mint-deep", outline: "hover:outline-[#3fa561]" },
  cream: { light: "bg-box-cream", deep: "bg-box-cream-deep", outline: "hover:outline-[#b8962e]" },
  // Same lightness and saturation as peach, turned to yellow.
  sun: { light: "bg-[#f9d77e]", deep: "bg-[#f6cd62]", outline: "hover:outline-[#e0a820]" },
};

type Book = {
  quyenNumber: string;
  title: string;
  body: string;
  cover: string;
  tone: Tone;
};

const books: Book[] = [
  {
    quyenNumber: "1",
    title: "Quyển 1",
    body: "Vui học Tiếng Việt, quyển 1, NXB ĐH Sư Phạm TP Hồ Chí Minh",
    cover: quyen1Cover,
    tone: "lavender",
  },
  {
    quyenNumber: "2",
    title: "Quyển 2",
    body: "Vui học Tiếng Việt, quyển 2, NXB ĐH Sư Phạm TP Hồ Chí Minh",
    cover: quyen2Cover,
    tone: "peach",
  },
];

type Practice = {
  to: "/hoc-tap/bang-chu-cai" | "/hoc-tap/luyen-noi" | "/hoc-tap/khai-minh-duc" | "/hoc-tap/tap-viet";
  title: string;
  body: string;
  tone: Tone;
  /** A landscape illustration painted on the card's own tone, filling the art window. */
  image: string;
};

const practices: Practice[] = [
  {
    to: "/hoc-tap/tap-viet",
    title: "Tập viết",
    body: "Tô chữ theo nét trên trang vở.",
    tone: "ice",
    image: thumbTapViet,
  },
  {
    to: "/hoc-tap/khai-minh-duc",
    title: "Khai Minh Đức",
    body: "Đánh vần từng âm, từng vần.",
    tone: "pink",
    image: thumbKhaiMinhDuc,
  },
  {
    to: "/hoc-tap/luyen-noi",
    title: "Luyện nói",
    body: "Nghe cô đọc mẫu rồi nói theo nhé.",
    tone: "mint",
    image: thumbLuyenNoi,
  },
  {
    to: "/hoc-tap/bang-chu-cai",
    title: "Bảng chữ cái",
    body: "Gặp bạn thú và nghe cách đọc từng chữ.",
    tone: "sun",
    image: thumbBangChuCai,
  },
];

/**
 * The học tập landing page, laid out for SkyPage's white card: a greeting
 * from Trâu con, then the two books as the main path, then the practice
 * corners as a row of smaller cards. On white, the tones carry the cards on
 * their own — no white keylines, just a soft shadow and a deeper tone rim.
 */
export function HocTapHome() {
  return (
    <div className="pb-10 sm:pb-12">
      <PageBanner
        title="Em muốn học gì hôm nay?"
        crumb="Học tập"
        art={
          // Mirrored so he faces into the banner, toward the heading.
          <Mascot pose="reading-sitting" decorative className="relative h-24 -scale-x-100 sm:h-36" />
        }
      />

      <section className="mt-10 px-4 sm:mt-12 sm:px-8">
        <SectionHeading title="Học theo sách" />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 sm:gap-5">
          {books.map((book) => (
            <BookCard key={book.quyenNumber} book={book} />
          ))}
        </div>
      </section>

      <section className="mt-10 px-4 sm:mt-12 sm:px-8">
        <SectionHeading title="Luyện thêm" />
        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {practices.map((practice) => (
            <PracticeCard key={practice.to} practice={practice} />
          ))}
        </div>
      </section>
    </div>
  );
}

/** A section title followed by a hairline running to the card's edge. */
function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="shrink-0 font-display text-xl font-bold leading-tight text-sky-ink sm:text-2xl">{title}</h2>
      <div aria-hidden="true" className="h-px flex-1 bg-sky-ink/15" />
    </div>
  );
}


/**
 * A book lying on its tone like it was set down on a desk, the cover tilted a
 * little. Hovering grows the card slightly in place and draws its outline.
 */
function BookCard({ book }: { book: Book }) {
  const tone = TONES[book.tone];
  return (
    <Link
      to="/hoc-tap/quyen-{$quyenNumber}"
      params={{ quyenNumber: book.quyenNumber }}
      className={[
        "relative flex items-center gap-4 rounded-[1.5rem] p-4 shadow-[0_6px_20px_rgba(12,58,110,0.14)] outline-4 outline-offset-0 outline-transparent transition-[outline-color,scale] duration-150 hover:z-10 hover:scale-[1.02] sm:gap-5 sm:p-5",
        tone.light,
        tone.outline,
      ].join(" ")}
    >

      <div className="w-24 shrink-0 sm:w-32">
        <img
          src={book.cover}
          alt=""
          className="aspect-[900/1270] w-full -rotate-3 rounded-r-lg rounded-l-sm border-l-[5px] border-black/15 object-cover shadow-[4px_8px_16px_rgba(12,58,110,0.3)]"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-display text-xl font-bold text-sky-ink sm:text-2xl">{book.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-sky-ink-soft">{book.body}</p>
        <span
          className={[
            "mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-sky-ink",
            tone.deep,
          ].join(" ")}
        >
          Vào học
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </span>
      </div>
    </Link>
  );
}

/**
 * A practice corner: an art window in the light tone, framed by the deeper
 * tone that also holds the title and a one-line hint.
 */
function PracticeCard({ practice }: { practice: Practice }) {
  const tone = TONES[practice.tone];
  return (
    <Link
      to={practice.to}
      className={[
        "relative flex flex-col rounded-[1.25rem] p-2 shadow-[0_6px_20px_rgba(12,58,110,0.14)] outline-4 outline-offset-0 outline-transparent transition-[outline-color,scale] duration-150 hover:z-10 hover:scale-[1.04] sm:rounded-[1.5rem]",
        tone.deep,
        tone.outline,
      ].join(" ")}
    >
      {/* The window keeps the illustrations' own shape, so none of them gets cropped. */}
      <div
        className={[
          "aspect-[600/385] overflow-hidden rounded-[0.9rem] sm:rounded-[1.1rem]",
          tone.light,
        ].join(" ")}
      >
        <img src={practice.image} alt="" className="h-full w-full object-cover" />
      </div>

      <div className="flex flex-1 items-end gap-2 px-2 pb-1.5 pt-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base font-bold leading-tight text-sky-ink sm:text-lg">{practice.title}</h3>
          <p className="mt-0.5 text-xs leading-snug text-sky-ink-soft sm:text-sm">{practice.body}</p>
        </div>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/80 text-sky-ink">
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </span>
      </div>
    </Link>
  );
}
