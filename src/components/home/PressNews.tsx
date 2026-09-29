import { ExternalLink } from "lucide-react";
import { Section, SectionHeading } from "@/components/layout/Section";
import { PressVideo } from "./PressVideo";
import daiDoanKetCover from "@/assets/press/dai-doan-ket-cover.webp";
import daiDoanKetLogo from "@/assets/press/dai-doan-ket-logo.png";
import baoAnhVietNamCover from "@/assets/press/bao-anh-viet-nam-cover.webp";
import baoAnhVietNamLogo from "@/assets/press/bao-anh-viet-nam-logo.svg";
import vietnamPlusCover from "@/assets/press/vietnamplus-cover.webp";
import vietnamPlusLogo from "@/assets/press/vietnamplus-logo.png";

/**
 * The homepage's press section: the VNA television report up top as the
 * featured piece (played in place, see PressVideo), then newspaper articles
 * about CVCEC's work in Canada, newest first.
 *
 * Covers and mastheads are copied into the repo rather than hotlinked: the
 * papers' CDNs are free to rename or block them, and a card with a broken
 * image is worse than no card. Headlines and excerpts are the articles' own
 * (og:title / og:description), verbatim, including their spelling.
 *
 * Each masthead carries its own height class because the three logos have very
 * different proportions — Báo ảnh Việt Nam is a two-line block, the other two
 * are long single-line wordmarks — and one shared height would make the block
 * look half the size of the others.
 */
const ARTICLES = [
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

/** "2026-09-07" → "07-09-2026", the day-first form the featured report's dateline uses too. */
const formatDate = (iso: string) => iso.split("-").reverse().join("-");

export function PressNews() {
  return (
    <Section space="loose">
      <SectionHeading
        title="Báo chí viết về chúng tôi"
        lede={
          <>
            Nền tảng học tiếng Việt, các lớp học, tủ sách và hoạt động của Hội đồng Văn hóa Giáo dục
            Canada–Việt Nam qua góc nhìn của báo chí trong nước.
          </>
        }
      />

      <PressVideo />

      {/* Three across from lg; between sm and lg each card lies on its side —
        photo left, text right — instead of three full-width photos stacked. */}
      <ul className="mt-5 grid gap-5 lg:grid-cols-3">
        {ARTICLES.map((a) => (
          <li key={a.url} className="flex">
            <a
              href={a.url}
              target="_blank"
              rel="noreferrer"
              className="group flex w-full flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-xs transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:shadow-lg sm:max-lg:flex-row"
            >
              <span className="relative block aspect-video shrink-0 overflow-hidden bg-ink-100 sm:max-lg:aspect-auto sm:max-lg:w-2/5">
                <img
                  src={a.cover}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </span>

              <span className="flex flex-1 flex-col p-5 sm:p-6">
                {/* The masthead is the source line, so its alt is the paper's name. */}
                <span className="flex min-h-8 items-center justify-between gap-3">
                  <img src={a.logo} alt={a.press} className={`${a.logoClass} w-auto`} />
                  <time
                    dateTime={a.date}
                    className="shrink-0 text-caption font-medium text-ink-500"
                  >
                    {formatDate(a.date)}
                  </time>
                </span>

                <span className="mt-4 text-h3 text-ink-900 transition-colors group-hover:text-brand-700">
                  {a.title}
                </span>
                <span className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-600">
                  {a.excerpt}
                </span>

                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-brand-600">
                  Đọc bài
                  <ExternalLink className="size-4" aria-hidden />
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
