import { Link, useCanGoBack, useNavigate, useRouter, useSearch } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import roundArrowForward from "@iconify-icons/ic/round-arrow-forward";
import roundClose from "@iconify-icons/ic/round-close";
import quyen1Cover from "@/assets/quyen_1_cover.jpg";
import quyen2Cover from "@/assets/quyen_2_cover.jpg";
import thumbBangChuCai from "@/assets/hoc-tap-thumb-bang-chu-cai.jpg";
import kmdArt from "@/assets/hoc-tap-thumb-khai-minh-duc-cutout.webp";
import trongDong from "@/assets/symbols/trong-dong.svg";
import thumbLuyenNoi from "@/assets/hoc-tap-thumb-luyen-noi.jpg";
import thumbTapViet from "@/assets/hoc-tap-thumb-tap-viet.jpg";
import { Mascot } from "@/components/Mascot";
import { PageBanner } from "@/components/site/PageBanner";
import { BOX_TONES as TONES, type BoxTone as Tone } from "@/components/learning/boxTones";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

/** The Vui Học Tiếng Việt books, each opening its own quyển. */
const books = [
  { quyenNumber: "1", cover: quyen1Cover },
  { quyenNumber: "2", cover: quyen2Cover },
];

type Practice = {
  to: "/hoc-tap/bang-chu-cai" | "/hoc-tap/luyen-noi" | "/hoc-tap/tap-viet";
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
 * from Trâu con, then the two programs as the main path, then the practice
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
          <Mascot
            pose="reading-sitting"
            decorative
            className="relative h-24 -scale-x-100 sm:h-36"
          />
        }
      />

      <section className="mt-10 px-4 sm:mt-12 sm:px-8">
        <SectionHeading title="Chương trình học" />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 sm:gap-5">
          <VuiHocCard />
          <KmdCard />
        </div>
      </section>

      <section className="mt-10 px-4 sm:mt-12 sm:px-8">
        <SectionHeading title="Luyện thêm" />
        <div className="mt-5 grid gap-3 sm:grid-cols-3 sm:gap-4">
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
      <h2 className="shrink-0 font-display text-xl font-bold leading-tight text-sky-ink sm:text-2xl">
        {title}
      </h2>
      <div aria-hidden="true" className="h-px flex-1 bg-sky-ink/15" />
    </div>
  );
}

/** A program card's frame; hovering grows it slightly in place and draws its outline. */
function programCardClass(tone: Tone) {
  return [
    "relative flex items-center gap-4 rounded-[1.5rem] p-4 shadow-[0_6px_20px_rgba(12,58,110,0.14)] outline-4 outline-offset-0 outline-transparent transition-[outline-color,scale] duration-150 hover:z-10 hover:scale-[1.02] sm:gap-5 sm:p-5",
    TONES[tone].light,
    TONES[tone].outline,
  ].join(" ");
}

const BOOK_COVER =
  "aspect-[900/1270] rounded-r-lg rounded-l-sm border-l-[5px] border-black/15 object-cover shadow-[4px_8px_16px_rgba(12,58,110,0.3)]";

/**
 * The round arrow that marks a whole card as the link. It is a cue, not a
 * button: the card itself is the one thing to click.
 */
function CardArrow({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={[
        "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/80 text-sky-ink",
        className,
      ].join(" ")}
    >
      <Icon icon={roundArrowForward} className="h-4 w-4" />
    </span>
  );
}

/** A program card's title, optional line of detail, and the arrow. */
function ProgramCardText({ title, body }: { title: string; body?: string }) {
  return (
    <>
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-xl font-bold text-sky-ink sm:text-2xl">{title}</h3>
        {body && <p className="mt-1.5 text-sm leading-relaxed text-sky-ink-soft">{body}</p>}
      </div>
      <CardArrow className="self-end" />
    </>
  );
}

/**
 * Vui Học Tiếng Việt: both quyển lying on the tone like they were set down on a
 * desk, fanned a little. The card opens the book menu rather than a book.
 *
 * The menu lives in the URL (`?sach=vui-hoc`), so opening it is a history
 * entry: Back closes it, and coming Back from a quyển lands on the menu again.
 * The page keeps its scroll position either way.
 */
function VuiHocCard() {
  const { sach } = useSearch({ from: "/hoc-tap/" });
  const navigate = useNavigate();
  const router = useRouter();
  const canGoBack = useCanGoBack();

  const closeMenu = () => {
    // Opened from the card, the entry before this one is the plain page, so step
    // back to it rather than stacking a second copy. Landing here from a pasted
    // link there is nothing to step back to, so drop the param in place.
    if (canGoBack) router.history.back();
    else navigate({ to: "/hoc-tap", search: {}, replace: true, resetScroll: false });
  };

  return (
    <>
      <Link
        to="/hoc-tap"
        search={{ sach: "vui-hoc" }}
        resetScroll={false}
        className={programCardClass("lavender")}
      >
        <div aria-hidden="true" className="relative h-[8.5rem] w-28 shrink-0 sm:h-[11rem] sm:w-36">
          {books.map((book, i) => (
            <img
              key={book.quyenNumber}
              src={book.cover}
              alt=""
              className={[
                "absolute w-20 sm:w-[6.5rem]",
                i === 0 ? "left-0 top-0 -rotate-6" : "right-0 top-3 rotate-3 sm:top-4",
                BOOK_COVER,
              ].join(" ")}
            />
          ))}
        </div>
        <ProgramCardText
          title="Chương trình Vui Học Tiếng Việt"
          body="Vui học Tiếng Việt, quyển 1 và 2, NXB ĐH Sư Phạm TP Hồ Chí Minh"
        />
      </Link>

      <Dialog open={sach === "vui-hoc"} onOpenChange={(o) => !o && closeMenu()}>
        <DialogContent
          hideCloseButton
          className="w-[calc(100%-2rem)] max-w-xl gap-0 rounded-[1.5rem] border-0 bg-box-lavender p-5 sm:rounded-[1.5rem] sm:p-7"
        >
          <DialogClose className="absolute right-3 top-3 z-10 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white/80 text-sky-ink transition-colors hover:bg-white">
            <Icon icon={roundClose} className="h-5 w-5" aria-hidden />
            <span className="sr-only">Đóng</span>
          </DialogClose>
          <DialogTitle className="pr-10 font-display text-xl font-bold text-sky-ink sm:text-2xl">
            Chương trình Vui Học Tiếng Việt
          </DialogTitle>
          <DialogDescription className="sr-only">Chọn quyển em muốn học.</DialogDescription>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5">
            {books.map((book) => (
              <Link
                key={book.quyenNumber}
                to="/hoc-tap/quyen-{$quyenNumber}"
                params={{ quyenNumber: book.quyenNumber }}
                className="group flex flex-col items-center gap-3 rounded-[1.25rem] bg-white/60 p-3 outline-4 outline-offset-0 outline-transparent transition-[outline-color,scale] duration-150 hover:scale-[1.03] hover:outline-[#8b74f0] sm:p-4"
              >
                <img
                  src={book.cover}
                  alt=""
                  className={["w-full max-w-[9rem]", BOOK_COVER].join(" ")}
                />
                <span className="flex w-full items-center justify-between gap-2 px-1">
                  <span className="font-display text-lg font-bold text-sky-ink">
                    Quyển {book.quyenNumber}
                  </span>
                  <CardArrow />
                </span>
              </Link>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Tiếng Việt và Văn Hoá Truyền Thống, taught through Khai Minh Đức: its art
 * stands on the tone in place of a book, centred on a faint Đông Sơn drum face
 * that stays clear of the text and is clipped by the card's edge. `isolate`
 * keeps the drum above the card's fill but under everything else.
 */
function KmdCard() {
  return (
    <Link
      to="/hoc-tap/khai-minh-duc"
      className={[programCardClass("pink"), "isolate overflow-hidden"].join(" ")}
    >
      <div className="relative w-32 shrink-0 sm:w-44">
        <img
          src={trongDong}
          alt=""
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-48 w-48 max-w-none -translate-x-1/2 -translate-y-1/2 opacity-25 sm:h-60 sm:w-60"
        />
        <img src={kmdArt} alt="" className="aspect-[600/382] w-full object-contain" />
      </div>
      <ProgramCardText
        title="Chương trình Tiếng Việt và Văn Hoá Truyền Thống"
        body="Giáo trình Khai Minh Đức, tiên học lễ, hậu học văn"
      />
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
          <h3 className="font-display text-base font-bold leading-tight text-sky-ink sm:text-lg">
            {practice.title}
          </h3>
          <p className="mt-0.5 text-xs leading-snug text-sky-ink-soft sm:text-sm">
            {practice.body}
          </p>
        </div>
        <CardArrow />
      </div>
    </Link>
  );
}
