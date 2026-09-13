import { useState } from "react";
import {
  ArrowRight,
  BookOpenText,
  Check,
  ChevronDown,
  Copy,
  Copyright,
  Heart,
  Mail,
  MessageCircle,
  Network,
  Volume2,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { SkyBackdrop } from "./SkyBackdrop";
import { PressVideo } from "./PressVideo";
import { SkyBox, SkyCard } from "@/components/ui/sky-box";
import { skyButton } from "@/components/ui/sky-button";
import { InfoCarousel } from "@/components/tabs/InfoCarousel";
import congVienChuCai from "@/assets/cong-vien-chu-cai.jpg";
import quyen1Cover from "@/assets/quyen_1_cover.jpg";
import quyen2Cover from "@/assets/quyen_2_cover.jpg";
import kidsAoDai from "@/assets/kids-aodai.jpg";
import bangSoLieu from "@/assets/bang-so-lieu.png";
import chimLac from "@/assets/symbols/chim-lac.png";
import hoaSen from "@/assets/symbols/hoa-sen.png";
import buffalo from "@/assets/buffalo-icon.png";

/* ── Hero: the three entry tiles ──────────────────────────────────────── */

const TILES = [
  {
    label: "Bảng chữ cái",
    /* Each title takes one of the stage accents so the row reads as three
       different places to go, not three copies of the same card. */
    titleClass: "text-stage-3",
    img: congVienChuCai,
    alt: "Công viên chữ cái tiếng Việt",
    to: "/hoc-tap/bang-chu-cai" as const,
    params: undefined,
  },
  {
    label: "Quyển 1",
    titleClass: "text-stage-1",
    img: quyen1Cover,
    alt: "Bìa sách Vui học Tiếng Việt quyển 1",
    to: "/hoc-tap/quyen-{$quyenNumber}" as const,
    params: { quyenNumber: "1" },
  },
  {
    label: "Quyển 2",
    titleClass: "text-stage-4",
    img: quyen2Cover,
    alt: "Bìa sách Vui học Tiếng Việt quyển 2",
    to: "/hoc-tap/quyen-{$quyenNumber}" as const,
    params: { quyenNumber: "2" },
  },
];

function HeroTiles() {
  return (
    // Content-sized columns spread with space-between, not three equal thirds:
    // equal columns centre each tile inside its third, so the outer two never
    // reach the edge no matter how wide the gap gets. Auto columns + space-
    // between pins the first tile to the left edge and the last to the right.
    <div className="grid grid-cols-1 justify-items-center gap-6 sm:auto-cols-max sm:grid-flow-col sm:grid-cols-none sm:justify-between sm:gap-4">
      {TILES.map((t) => (
        <Link
          key={t.label}
          // The union of route paths here is narrower than Link's generic
          // inference can follow through the array, so params is spread.
          to={t.to}
          {...(t.params ? { params: t.params } : {})}
          className="group flex flex-col items-center gap-3"
        >
          {/* White stroke around the letterform, drawn behind the fill —
            the reference's outlined arcade lettering. */}
          <span
            className={[
              "font-display text-2xl font-extrabold sm:text-[1.6rem] lg:text-3xl",
              "[-webkit-text-stroke:4px_white] [paint-order:stroke_fill]",
              t.titleClass,
            ].join(" ")}
          >
            {t.label}
          </span>
          {/* Explicit width rather than w-full + max-w: inside an auto-sized
            grid column a percentage width would be circular. */}
          <span className="block w-40 overflow-hidden rounded-[1.25rem] border-[6px] border-white transition-transform duration-200 group-hover:-translate-y-1 group-hover:scale-[1.02] sm:w-44 sm:rounded-[1.5rem] lg:w-52">
            <img
              src={t.img}
              alt={t.alt}
              className="aspect-square w-full object-cover"
              loading="eager"
            />
          </span>
        </Link>
      ))}
    </div>
  );
}

/* ── The stat ribbon under the tagline ────────────────────────────────── */

/**
 * Artwork, not markup: the banner already carries its own red-and-gold frame,
 * the three figures and the nón lá / Khuê Văn Các vignettes, so it is placed
 * flat on the sky rather than inside a SkyBox — a white-bordered box around it
 * would frame an illustration that is already framed. The source PNG shipped
 * with an opaque white background; it has been chroma-keyed to transparency
 * (border-connected white only, so the cream panel and book pages survive).
 *
 * It is the only place those three numbers appear, so the alt text has to
 * carry them; it is content, not decoration.
 */
function StatRibbon() {
  return (
    <img
      src={bangSoLieu}
      alt="40+ bài học tiếng Việt · 8 chủ đề · 100% miễn phí"
      width={1995}
      height={361}
      className="mx-auto block h-auto w-full max-w-2xl"
      loading="eager"
    />
  );
}

/* ── Mission box: the four steps of the journey ───────────────────────── */

const STEPS = [
  {
    title: "Bảng chữ cái",
    img: congVienChuCai,
    body: "Làm quen với bảng chữ cái tiếng Việt qua hình ảnh, âm thanh và trò chơi.",
  },
  {
    title: "Quyển 1",
    img: quyen1Cover,
    body: "Bốn chủ đề đầu tiên: gia đình, trường lớp và những người bạn quanh em.",
  },
  {
    title: "Quyển 2",
    img: quyen2Cover,
    body: "Bốn chủ đề tiếp theo: quê hương, thiên nhiên và văn hóa Việt Nam.",
  },
  {
    title: "Luyện nói",
    img: kidsAoDai,
    body: "Nghe, nhắc lại và ghi âm để nói tiếng Việt tự tin, rõ ràng hơn mỗi ngày.",
  },
];

function MissionBox() {
  return (
    <SkyBox
      tone="lavender"
      ribbon="Sứ mệnh của dự án"
      title={
        <>
          {/* --indigo, not --primary, for every accent that sits straight on a
            box tone: the tones carry enough chroma now that --primary only
            reaches 2.8:1 on them, while --indigo clears 5:1. */}
          Giúp mọi trẻ em kiều bào <span className="text-indigo">giữ tiếng Việt</span> — miễn phí
        </>
      }
      lede={
        <>
          Trường Tiếng Việt Của Em số hóa bộ sách <strong>Vui học Tiếng Việt</strong> thành một hành
          trình bốn bước: chữ cái, quyển 1, quyển 2 và luyện nói. Miễn phí, trọn đời, cho mọi em
          nhỏ.
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <SkyCard key={s.title} className="relative flex flex-col">
            <span className="absolute -top-3 -left-3 grid h-9 w-9 place-items-center rounded-full border-[3px] border-white bg-primary font-display text-sm font-extrabold text-primary-foreground">
              {i + 1}
            </span>
            <h3 className="text-center font-display text-base font-extrabold text-sky-ink">
              {s.title}
            </h3>
            <span className="mt-3 block overflow-hidden rounded-xl border-[3px] border-white">
              <img src={s.img} alt="" className="aspect-4/3 w-full object-cover" loading="lazy" />
            </span>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-sky-ink-soft">{s.body}</p>
          </SkyCard>
        ))}
      </div>
    </SkyBox>
  );
}

/* ── About box ────────────────────────────────────────────────────────── */

const ROWS = [
  {
    Icon: BookOpenText,
    heading: "Dự án số hóa",
    body: (
      <>
        Số hóa hai cuốn sách của <strong>NXB ĐH Sư Phạm TP Hồ Chí Minh</strong>, trong khuôn khổ
        Chương trình Tôn vinh tiếng Việt trong cộng đồng người Việt Nam ở nước ngoài do{" "}
        <strong>UBNVONN – Bộ Ngoại giao</strong> phát động.
      </>
    ),
  },
  {
    Icon: Network,
    heading: "Hệ sinh thái",
    body: (
      <>
        Dự án là thành viên tích cực của{" "}
        <strong>Mạng lưới các cơ sở giảng dạy tiếng Việt và văn hóa Việt Nam ở nước ngoài</strong>.
      </>
    ),
  },
  {
    Icon: Copyright,
    heading: "Bản quyền",
    body: (
      <>
        Được bảo hộ bản quyền bởi đồng tác giả: Phan Thị Quỳnh Trang, Nguyễn Trần Thanh Hải, Đỗ Thị
        Phương Mai, Trần Thanh Phúc, Trần Văn Nhật.
      </>
    ),
  },
];

function AboutBox() {
  return (
    <SkyBox tone="ice" title="Giới thiệu">
      {/* The sponsorship is the trust signal, so it leads on its own card
        above the plain trio. The symbol PNG carries a white matte fringe from
        how it was cut out, so it sits on a white disc where the fringe
        disappears rather than being fought. */}
      <SkyCard className="flex flex-col items-center gap-4 text-center sm:flex-row sm:gap-6 sm:text-left">
        <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-white sm:h-24 sm:w-24">
          <img src={chimLac} alt="" className="h-14 w-14 object-contain sm:h-16 sm:w-16" />
        </span>
        <span>
          <span className="block font-display text-lg font-extrabold text-sky-ink">
            Đồng hành chuyên môn
          </span>
          <span className="mt-1 block text-sm leading-relaxed text-sky-ink-soft sm:text-base">
            Dự án thực hiện dưới sự đồng hành và ủng hộ của{" "}
            <strong className="text-indigo">
              Ủy ban Nhà nước về người Việt Nam ở nước ngoài – Bộ Ngoại giao
            </strong>
            .
          </span>
        </span>
      </SkyCard>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {ROWS.map((r) => (
          <SkyCard key={r.heading}>
            <r.Icon className="h-6 w-6 text-primary" strokeWidth={2.5} aria-hidden />
            <h3 className="mt-3 font-display text-base font-extrabold text-sky-ink">{r.heading}</h3>
            <p className="mt-2 text-sm leading-relaxed text-sky-ink-soft">{r.body}</p>
          </SkyCard>
        ))}
      </div>
    </SkyBox>
  );
}

/* ── Thank-you box ────────────────────────────────────────────────────── */

function ThanksBox() {
  return (
    <div className="relative">
      {/* Hoa sen nhô lên góc trên như trái tim của hộp đồng hành — cũng phải là
        anh em của SkyBox vì SkyBox cắt phần tràn. */}
      <img
        src={hoaSen}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -top-4 right-4 z-10 h-20 w-20 object-contain sm:-top-5 sm:right-8 sm:h-24 sm:w-24"
        style={{ filter: "drop-shadow(0 5px 4px oklch(0.28 0.045 260 / 0.28))" }}
      />
      <SkyBox tone="pink" title="Lời cảm ơn">
        <SkyCard className="mx-auto max-w-2xl">
          <p className="text-sm leading-relaxed text-sky-ink-soft sm:text-base">
            Ban quản lý dự án xin được gửi lời cảm ơn chân thành tới{" "}
            <strong className="text-indigo">
              Ủy ban Nhà nước về người Việt Nam ở nước ngoài – Bộ Ngoại giao
            </strong>{" "}
            nước Cộng hòa xã hội chủ nghĩa Việt Nam đã luôn đồng hành và định hướng. Chúng tôi xin
            gửi lời tri ân sâu sắc tới các Đại sứ quán, các cơ quan ban ngành tại Việt Nam và
            Canada, cùng Mạng lưới giảng dạy tiếng Việt đã tạo điều kiện và hỗ trợ quý báu để dự án{" "}
            <strong className="text-indigo">&quot;Trường Tiếng Việt Của Em&quot;</strong> được hoàn
            thiện và đi vào vận hành. Sự đồng hành của quý vị là nguồn động lực to lớn giúp chúng
            tôi gìn giữ và lan tỏa ngôn ngữ, văn hóa Việt đến với thế hệ trẻ tại Canada nói riêng và
            trên toàn thế giới nói chung.
          </p>
          <p className="mt-4 text-right font-display text-sm font-extrabold text-indigo">
            — Ban quản lý dự án
          </p>
        </SkyCard>
      </SkyBox>
    </div>
  );
}

/* ── Support box ──────────────────────────────────────────────────────── */

/**
 * One line of contact: icon, the address itself, and a copy button. Deliberately
 * not a card — it sits under the support headline, where a boxed card would
 * outweigh the copy it belongs to.
 */
function ContactCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Đã sao chép: " + value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Không thể sao chép");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
      <a href={href} className="group flex min-w-0 items-center gap-2.5">
        {/* Đĩa tròn nhỏ giữ cho icon có cùng trọng lượng với dòng chữ đậm bên
          cạnh — icon trần trông lạc lõng ở cỡ này. */}
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
          <Icon className="h-3.5 w-3.5" aria-hidden />
        </span>
        <span className="text-sm text-sky-ink-soft">{label}:</span>
        <span className="font-display text-sm font-extrabold text-sky-ink group-hover:text-indigo-deep">
          {value}
        </span>
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-md text-sky-ink-soft transition-colors hover:bg-white hover:text-primary"
        aria-label={"Sao chép " + label}
        title={"Sao chép " + label}
      >
        {copied ? (
          <Check className="h-4 w-4 text-nav-green" aria-hidden />
        ) : (
          <Copy className="h-4 w-4" aria-hidden />
        )}
      </button>
    </div>
  );
}

/* Mỗi dòng là một việc mà sự đồng hành trực tiếp nuôi dưỡng — tất cả đều là
   những gì dự án đang làm, không phải lời hứa. */
const SUPPORT_POINTS = [
  {
    heading: "Giữ toàn bộ chương trình miễn phí",
    body: "40+ bài học trải khắp 8 chủ đề, mở cho mọi em nhỏ, trọn đời, không thu phí.",
  },
  {
    heading: "Số hóa thêm nội dung mới",
    body: "Tiếp nối bộ sách Vui học Tiếng Việt của NXB ĐH Sư Phạm TP Hồ Chí Minh.",
  },
  {
    heading: "Nuôi dưỡng phần luyện nói",
    body: "Hình ảnh, âm thanh, trò chơi và ghi âm để các em nói tiếng Việt tự tin hơn.",
  },
];

function SupportBox() {
  return (
    <div className="relative">
      {/* SkyBox có overflow-hidden nên trái tim phải là anh em của nó, không
        phải con — nếu không, phần nhô lên trên sẽ bị viền trắng cắt mất. Bóng
        đổ dùng drop-shadow inline vì filter phải bám theo hình trái tim, không
        phải theo ô vuông của icon. */}
      <Heart
        aria-hidden
        className="pointer-events-none absolute -top-6 right-4 z-10 h-20 w-20 rotate-6 fill-stage-5 text-stage-5-deep sm:-top-8 sm:right-8 sm:h-24 sm:w-24"
        strokeWidth={1.5}
        style={{ filter: "drop-shadow(0 5px 4px oklch(0.46 0.12 15 / 0.45))" }}
      />
      <SkyBox tone="peach" title="Kêu gọi hỗ trợ">
        <div className="grid gap-5 sm:grid-cols-2 sm:items-start sm:gap-6">
          {/* Cột trái: lời kêu gọi và hai cách liên hệ. */}
          <div>
            <h3 className="font-display text-2xl font-extrabold text-indigo-deep sm:text-3xl">
              Đồng hành để giữ tiếng Việt cho mọi em nhỏ.
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-sky-ink-soft">
              <strong className="text-indigo">&quot;Trường Tiếng Việt Của Em&quot;</strong> là dự án
              phi lợi nhuận. Dự án luôn rộng mở đón nhận sự đồng hành, đóng góp và tài trợ từ các
              bậc phụ huynh, kiều bào và các mạnh thường quân. Mỗi sự đóng góp – dù là nhỏ nhất –
              đều quý báu.
            </p>

            <div className="mt-5 flex flex-col gap-2">
              <ContactCard
                icon={Mail}
                label="Email"
                value="contact@cvcec.org"
                href="mailto:contact@cvcec.org"
              />
              <ContactCard
                icon={MessageCircle}
                label="Điện thoại"
                value="+1 647 897 2358"
                href="https://wa.me/16478972358"
              />
            </div>
          </div>

          {/* Cột phải: đóng góp đi về đâu. */}
          <SkyCard className="sm:p-5">
            <h4 className="font-display text-xs font-extrabold tracking-[0.12em] text-indigo uppercase sm:text-sm">
              Đóng góp của bạn giúp
            </h4>
            <ul className="mt-4 flex flex-col gap-4">
              {SUPPORT_POINTS.map((point) => (
                <li key={point.heading} className="flex gap-3">
                  <Check
                    className="mt-0.5 h-5 w-5 shrink-0 text-nav-green"
                    strokeWidth={3.5}
                    aria-hidden
                  />
                  <span>
                    <span className="block font-display text-sm font-extrabold text-sky-ink">
                      {point.heading}
                    </span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-sky-ink-soft">
                      {point.body}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-5 font-display text-sm font-extrabold text-indigo">
              Xin chân thành cảm ơn!
            </p>
          </SkyCard>
        </div>
      </SkyBox>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */

export function HomePage() {
  return (
    <div className="relative isolate overflow-hidden">
      <SkyBackdrop />

      {/* pb clears the grass band at the bottom of the backdrop, so the last
        box never overlaps the hills. */}
      <div className="relative w-full px-4 pt-8 pb-44 sm:px-6 sm:pt-10 sm:pb-56">
        <div className="mx-auto w-full max-w-4xl">
          <HeroTiles />

          {/* Tagline pill — the reference's single line of italic copy under the
          tiles, in the same white-bordered language as everything else. */}
          <p className="mx-auto mt-8 w-fit rounded-full border-[4px] border-white bg-white/80 px-5 py-1.5 text-center font-display text-sm font-bold text-sky-ink italic">
            Nơi các em học tiếng Việt thật vui
          </p>

          <div className="mt-6">
            <StatRibbon />
          </div>

          {/* Scroll cue — a bamboo-green disc, the one round accent between the
          hero and the first content box. */}
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              aria-label="Cuộn xuống phần giới thiệu"
              onClick={() => {
                document
                  .getElementById("su-menh")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-nav-green shadow-btn transition-[transform,box-shadow] active:translate-y-[1px] active:shadow-btn-active"
            >
              <ChevronDown className="h-7 w-7 text-white" strokeWidth={3} />
            </button>
          </div>
        </div>

        <div className="mx-auto mt-10 flex w-full max-w-4xl flex-col gap-9 sm:mt-12 sm:gap-12">
          <div id="su-menh" className="scroll-mt-24">
            <MissionBox />
          </div>

          {/* bodyClassName drops the body padding — the strip is meant to run
            edge to edge and bleed past the box's sides. */}
          <SkyBox tone="white" title="Hình ảnh Việt Nam" bodyClassName="px-0 sm:px-0">
            <InfoCarousel />
          </SkyBox>

          <div id="bao-chi" className="scroll-mt-24">
            <PressVideo />
          </div>

          <div id="gioi-thieu" className="scroll-mt-24">
            <AboutBox />
          </div>

          <ThanksBox />

          <div id="dong-hanh" className="scroll-mt-24">
            <SupportBox />
          </div>

          {/* Closing call — the reference's "Take Starfall Anywhere" beat. */}
          <SkyBox
            tone="mint"
            title={
              <>
                <img src={buffalo} alt="" className="mx-auto mb-2 h-16 w-16 object-contain" />
                Học tiếng Việt mọi lúc, mọi nơi
              </>
            }
            lede="Trâu con đội nón lá đã sẵn sàng. Mở bài học đầu tiên và bắt đầu hành trình của em."
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/hoc-tap" className={skyButton("primary", "px-6")}>
                Học ngay
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
              <Link to="/hoc-tap/luyen-noi" className={skyButton("white", "px-6")}>
                <Volume2 className="h-5 w-5" aria-hidden />
                Luyện nói
              </Link>
            </div>
          </SkyBox>
        </div>
      </div>
    </div>
  );
}
