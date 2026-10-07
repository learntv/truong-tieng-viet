import { useState } from "react";
import {
  ArrowRight,
  BookOpenText,
  Check,
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
import { PressNews } from "./PressNews";
import { MissionCarousel } from "./MissionCarousel";
import { SkyBox, SkyCard } from "@/components/ui/sky-box";
import { skyButton } from "@/components/ui/sky-button";
import chimLac from "@/assets/symbols/chim-lac.png";
import hoaSen from "@/assets/symbols/hoa-sen.png";
import buffalo from "@/assets/buffalo-icon.png";
import logoWordmark from "@/assets/logo-wordmark.png";
import mascotRunning from "@/assets/mascot/running.png";
import mascotWave from "@/assets/mascot/wave.png";
import mascotReading from "@/assets/mascot/reading.png";
import mascotFlag from "@/assets/mascot/flag.png";
import mascotEatingPho from "@/assets/mascot/eating-pho.png";
import mascotThumbsUp from "@/assets/mascot/thumbs-up.png";
import mascotThinking from "@/assets/mascot/thinking.png";
import mascotCheer from "@/assets/mascot/cheer.png";
import mascotPointing from "@/assets/mascot/pointing.png";

/* ── Hero: the logo, centred on the sky ───────────────────────────────── */

/* A thin white sticker outline around the wordmark, so the red and navy
   brush lettering holds up on the blue sky. Each drop-shadow copies the
   result of the one before, so four offsets make a 2px outline all round. */
const LOGO_OUTLINE =
  "[filter:drop-shadow(2px_0_0_white)_drop-shadow(-2px_0_0_white)_drop-shadow(0_2px_0_white)_drop-shadow(0_-2px_0_white)]";

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative px-4 pt-12 sm:px-6 sm:pt-16 lg:pt-20">
      <div className="relative mx-auto w-full max-w-[30rem] text-center">
        <h1 id="hero-title">
          <img
            src={logoWordmark}
            alt="Trường Tiếng Việt Của Em"
            width={1462}
            height={589}
            fetchPriority="high"
            className={["block h-auto w-full", LOGO_OUTLINE].join(" ")}
          />
        </h1>
      </div>
    </section>
  );
}

/* ── Divider: a row of Trâu con poses ───────────────────────────────── */

/* Nine full-body poses — crying and the two peeking crops don't stand on a
   line. */
const PARADE = [
  mascotRunning,
  mascotWave,
  mascotReading,
  mascotFlag,
  mascotEatingPho,
  mascotThumbsUp,
  mascotThinking,
  mascotCheer,
  mascotPointing,
];

/**
 * Divider between the hero and the content boxes: Trâu con in all his
 * poses, standing in one still row spread across the content width. Phones
 * only have room for the first six. Decorative.
 */
function BuffaloParade() {
  return (
    <div aria-hidden="true" className="my-6 flex items-end justify-between sm:my-8">
      {PARADE.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className={["h-12 w-auto sm:h-14 lg:h-16", i >= 6 ? "hidden sm:block" : ""].join(" ")}
        />
      ))}
    </div>
  );
}

/* ── Mission box: the classes the project serves ─────────────────────── */

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
          Giúp mọi trẻ em kiều bào <span className="text-indigo">giữ tiếng Việt</span>, miễn phí
        </>
      }
    >
      <MissionCarousel />
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
        Số hóa các ấn phẩm bao gồm sách của <strong>NXB Đại học Sư phạm TP. Hồ Chí Minh</strong>,
        trong khuôn khổ Chương trình Tôn vinh tiếng Việt trong cộng đồng người Việt Nam ở nước ngoài
        do <strong>UBNVONN – Bộ Ngoại giao</strong> phát động; và giáo trình của hệ thống giáo dục{" "}
        <strong>Khai Minh Đức</strong> (với tôn chỉ &quot;Tiên học lễ, hậu học văn&quot;).
      </>
    ),
  },
  {
    Icon: Network,
    heading: "Hệ sinh thái",
    body: (
      <>
        Dự án thuộc sáng kiến <strong>Viet Youth Readiness Hub</strong> của Hội đồng Văn hóa Giáo
        dục Canada Việt Nam (CVCEC).
        <span className="mt-2 block">
          Đồng thời, chúng tôi là thành viên tích cực của Mạng lưới giảng dạy tiếng Việt và văn hóa
          Việt Nam toàn cầu (<strong>VIETLANGNET</strong>), đang tích cực đóng góp vào dự án
          &ldquo;Xây dựng bản đồ lớp học tiếng Việt toàn cầu&rdquo; từ tháng 6 đến tháng 9 năm 2025,
          nhằm tạo ra một bản đồ tương tác hiển thị hệ thống các lớp học tiếng Việt dành cho người
          Việt Nam ở nước ngoài trên toàn thế giới.
        </span>
      </>
    ),
  },
  {
    Icon: Copyright,
    heading: "Bản quyền",
    body: (
      <>
        Quyền sở hữu và bản quyền của platform được bảo hộ bản quyền bởi các đồng tác giả: Phan Thị
        Quỳnh Trang, Nguyễn Trần Thanh Hải, Đỗ Thị Phương Mai, Trần Thanh Phúc, Trần Văn Nhật.
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
            Ban quản lý dự án
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

      <Hero />

      {/* pb clears the grass band at the bottom of the backdrop, so the last
        box never overlaps the hills. */}
      <div className="relative w-full px-4 pt-8 pb-44 sm:px-6 sm:pt-10 sm:pb-56">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-9 sm:gap-12">
          <BuffaloParade />

          <div id="su-menh" className="scroll-mt-24">
            <MissionBox />
          </div>

          <div id="tin-tuc" className="scroll-mt-24">
            <PressNews />
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
