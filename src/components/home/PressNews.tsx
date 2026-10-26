import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Icon } from "@iconify/react";
import roundOpenInNew from "@iconify-icons/ic/round-open-in-new";
import roundArrowBack from "@iconify-icons/ic/round-arrow-back";
import roundArrowForward from "@iconify-icons/ic/round-arrow-forward";
import { SkyBox } from "@/components/ui/sky-box";
import { cn } from "@/lib/utils";
import { PressVideo } from "./PressVideo";
import { RichMessage } from "./RichMessage";
import { formatPressDate } from "./pressDate";
import daiDoanKetCover from "@/assets/press/dai-doan-ket-cover.webp";
import daiDoanKetLogo from "@/assets/press/dai-doan-ket-logo.png";
import baoAnhVietNamCover from "@/assets/press/bao-anh-viet-nam-cover.webp";
import baoAnhVietNamLogo from "@/assets/press/bao-anh-viet-nam-logo.svg";
import vietnamPlusCover from "@/assets/press/vietnamplus-cover.webp";
import vietnamPlusLogo from "@/assets/press/vietnamplus-logo.png";
import ketNoiCongDongCover from "@/assets/press/ket-noi-cong-dong-cover.webp";
import scovLogo from "@/assets/press/scov-logo.png";
import baoTinTucCover from "@/assets/press/bao-tin-tuc-cover.webp";
import baoTinTucLogo from "@/assets/press/bao-tin-tuc-logo.png";
import { m } from "@/paraglide/messages";

/**
 * The homepage's one press box: the VNA television report up top as the
 * featured piece (played in place, see PressVideo), then newspaper articles
 * about CVCEC's work in Canada, newest first.
 *
 * Covers and mastheads are copied into the repo rather than hotlinked: the
 * papers' CDNs are free to rename or block them, and a card with a broken
 * image is worse than no card. Headlines and excerpts are the articles' own
 * (og:title / og:description), verbatim, including their spelling.
 *
 * Each masthead carries its own height class because the logos have very
 * different proportions — Báo ảnh Việt Nam and Tin tức are two-line blocks,
 * the others are long single-line wordmarks, the SCOV one longest of all — and
 * one shared height would make the blocks look half the size of the others.
 *
 * The SCOV piece is a reprint of a Vietnam+ article, so its cover is that
 * article's.
 */
const ARTICLES = [
  {
    press: "Báo Tin tức và Dân tộc (TTXVN)",
    logo: baoTinTucLogo,
    logoClass: "h-8",
    cover: baoTinTucCover,
    date: "2026-10-26",
    title: "Kết nối cộng đồng gìn giữ tiếng Việt cho thế hệ trẻ tại Canada",
    excerpt:
      "Trong bối cảnh nhiều trẻ em gốc Việt tại Canada lớn lên với tiếng Anh hoặc tiếng Pháp là ngôn ngữ chính, việc duy trì tiếng mẹ đẻ đang đòi hỏi sự phối hợp chặt chẽ giữa gia đình, giáo viên và các tổ chức cộng đồng.",
    url: "https://baotintuc.vn/ket-noi-cong-dong-gin-giu-tieng-viet-cho-the-he-tre-tai-canada-post1397316.html",
  },
  {
    press: "Ủy ban Nhà nước về người Việt Nam ở nước ngoài",
    logo: scovLogo,
    logoClass: "h-4",
    cover: ketNoiCongDongCover,
    date: "2026-10-26",
    title: "Kết nối cộng đồng người Việt ở Canada để gìn giữ tiếng Việt",
    excerpt:
      "Hội đồng Văn hóa và Giáo dục Canada-Việt Nam (CVCEC) đang từng bước mở rộng mạng lưới dạy tiếng Việt tại nhiều tỉnh bang, góp phần gìn giữ ngôn ngữ và bản sắc văn hóa dân tộc cho thế hệ trẻ.",
    url: "https://scov.gov.vn/dong-bao-vnon/tin-cong-dong/ket-noi-cong-dong-nguoi-viet-o-canada-de-gin-giu-tieng-viet.html",
  },
  {
    press: "Vietnam+ (TTXVN)",
    logo: vietnamPlusLogo,
    logoClass: "h-5",
    cover: vietnamPlusCover,
    date: "2026-09-07",
    title: "Gìn giữ tiếng Việt trong thế hệ trẻ tại Canada",
    excerpt:
      "Thay vì chỉ nói theo khẩu hiệu “phải gìn giữ tiếng Việt,” các bạn trẻ đã tự tạo ra không gian để có thể trao đổi bằng tiếng Việt thông qua buổi gặp gỡ, chia sẻ kinh nghiệm trong học tập và cuộc sống.",
    url: "https://www.vietnamplus.vn/gin-giu-tieng-viet-trong-the-he-tre-tai-canada-post1134607.vnp",
  },
  {
    press: "Báo Đại Đoàn Kết",
    logo: daiDoanKetLogo,
    logoClass: "h-6",
    cover: daiDoanKetCover,
    date: "2026-07-27",
    title: "Một lớp tiếng Việt kiểu truyền thống do CVCEC tổ chức tại Toronto, Canada",
    excerpt:
      "Một nền tảng học tiếng Việt trực tuyến dành riêng cho con em người Việt ở nước ngoài vừa được ra mắt tại Canada.",
    url: "https://daidoanket.vn/mot-lop-tieng-viet-kieu-truyen-thong-do-cvcec-to-chuc-tai-toronto-canada.html",
  },
  {
    press: "Báo ảnh Việt Nam",
    logo: baoAnhVietNamLogo,
    logoClass: "h-8",
    cover: baoAnhVietNamCover,
    date: "2026-04-19",
    title: "Tôn vinh tiếng Việt: Bồi đắp cội nguồn cho thế hệ trẻ người Việt tại Canada",
    excerpt:
      "Nhân dịp Giỗ tổ Hùng Vương, Hội đồng Văn hóa Giáo dục Canada-Việt Nam (CVCEC) đã chính thức ra mắt Nhóm Tuổi trẻ Việt (Viet Youth Readiness Hub), đồng thời khai mạc Lớp tiếng Việt cộng đồng cho trẻ em và giới thiệu Tủ sách tiếng Việt tại Canada.",
    url: "https://vietnam.vnanet.vn/vietnamese/tin-van/ton-vinh-tieng-viet-boi-dap-coi-nguon-cho-the-he-tre-nguoi-viet-tai-canada-441338.html",
  },
];

const ARROW_BUTTON =
  "grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white text-indigo-deep shadow-btn transition-[colors,transform,box-shadow,opacity] hover:bg-box-white-deep active:translate-y-[1px] active:shadow-btn-active disabled:cursor-default disabled:opacity-40 disabled:shadow-none";

export function PressNews() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" });
  const [snaps, setSnaps] = useState<number[]>([]);
  const [selected, setSelected] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  // Snap points change with the breakpoint (one, two or three cards a page),
  // so they are re-read on reInit as well as on select.
  const sync = useCallback(() => {
    if (!emblaApi) return;
    setSnaps(emblaApi.scrollSnapList());
    setSelected(emblaApi.selectedScrollSnap());
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    sync();
    emblaApi.on("select", sync).on("reInit", sync);
    return () => {
      emblaApi.off("select", sync).off("reInit", sync);
    };
  }, [emblaApi, sync]);

  return (
    <SkyBox
      tone="cream"
      ribbon={m.home_press_ribbon()}
      title={m.home_press_title()}
      lede={
        <RichMessage parts={m.home_press_lede.parts()} tags={{ b: (c) => <strong>{c}</strong> }} />
      }
    >
      <PressVideo />

      {/* One card a page on phones, two from sm, three from lg. The viewport
        gets a little top padding so the hover lift isn't clipped by its
        overflow-hidden. */}
      <div ref={emblaRef} className="mt-3 overflow-hidden pt-1">
        <ul className="-ml-4 flex">
          {ARTICLES.map((a) => (
            <li
              key={a.url}
              className="flex min-w-0 shrink-0 grow-0 basis-full pl-4 sm:basis-1/2 lg:basis-1/3"
            >
              <a
                href={a.url}
                target="_blank"
                rel="noreferrer"
                className="group flex w-full flex-col overflow-hidden rounded-2xl border-[3px] border-white bg-white transition-transform duration-200 hover:-translate-y-1"
              >
                <span className="relative block aspect-video shrink-0 overflow-hidden bg-box-cream-deep">
                  <img
                    src={a.cover}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </span>

                <span className="flex flex-1 flex-col p-4">
                  {/* The masthead is the source line, so its alt is the paper's
                    name. It may shrink (min-w-0) so the long SCOV wordmark
                    never pushes the date out of a narrow card. */}
                  <span className="flex min-h-8 items-center justify-between gap-3">
                    <img
                      src={a.logo}
                      alt={a.press}
                      className={`${a.logoClass} w-auto min-w-0 object-contain object-left`}
                    />
                    <time
                      dateTime={a.date}
                      className="shrink-0 font-display text-xs font-bold text-sky-ink-soft"
                    >
                      {formatPressDate(a.date)}
                    </time>
                  </span>

                  {/* The papers' own words, so they stay Vietnamese in every UI language. */}
                  <span
                    lang="vi"
                    className="mt-3 font-display text-base leading-snug font-extrabold text-sky-ink group-hover:text-indigo-deep"
                  >
                    {a.title}
                  </span>
                  <span
                    lang="vi"
                    className="mt-2 line-clamp-3 text-sm leading-relaxed text-sky-ink-soft"
                  >
                    {a.excerpt}
                  </span>

                  <span className="mt-auto inline-flex items-center gap-1.5 pt-3 font-display text-sm font-extrabold text-indigo">
                    {m.home_press_read()}
                    <Icon icon={roundOpenInNew} className="h-4 w-4" aria-hidden />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {snaps.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={m.home_press_goto({ n: i + 1 })}
              aria-current={i === selected}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "h-2.5 cursor-pointer rounded-full transition-[width,background-color]",
                i === selected ? "w-6 bg-indigo" : "w-2.5 bg-white hover:bg-box-white-deep",
              )}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label={m.home_press_prev()}
            disabled={!canPrev}
            onClick={() => emblaApi?.scrollPrev()}
            className={ARROW_BUTTON}
          >
            <Icon icon={roundArrowBack} className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            aria-label={m.home_press_next()}
            disabled={!canNext}
            onClick={() => emblaApi?.scrollNext()}
            className={ARROW_BUTTON}
          >
            <Icon icon={roundArrowForward} className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>
    </SkyBox>
  );
}
