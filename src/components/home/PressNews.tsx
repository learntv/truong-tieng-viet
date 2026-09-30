import { ExternalLink } from "lucide-react";
import { useTranslations } from "use-intl";
import { SkyBox } from "@/components/ui/sky-box";
import { richTags } from "@/i18n/rich";
import { PressVideo } from "./PressVideo";
import daiDoanKetCover from "@/assets/press/dai-doan-ket-cover.webp";
import daiDoanKetLogo from "@/assets/press/dai-doan-ket-logo.png";
import baoAnhVietNamCover from "@/assets/press/bao-anh-viet-nam-cover.webp";
import baoAnhVietNamLogo from "@/assets/press/bao-anh-viet-nam-logo.svg";
import vietnamPlusCover from "@/assets/press/vietnamplus-cover.webp";
import vietnamPlusLogo from "@/assets/press/vietnamplus-logo.png";

/**
 * The homepage's one press box: the VNA television report up top as the
 * featured piece (played in place, see PressVideo), then newspaper articles
 * about CVCEC's work in Canada, newest first.
 *
 * Covers and mastheads are copied into the repo rather than hotlinked: the
 * papers' CDNs are free to rename or block them, and a card with a broken
 * image is worse than no card. Headlines and excerpts are the articles' own
 * (og:title / og:description), verbatim, including their spelling, so they
 * stay in Vietnamese (marked lang="vi") whatever the page's language.
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
  const t = useTranslations("home.press");
  return (
    <SkyBox tone="cream" ribbon={t("ribbon")} title={t("title")} lede={t.rich("lede", richTags)}>
      <PressVideo />

      {/* Three across only from lg, where each card still gets ~17rem. Between
        sm and lg a third of the box is too narrow for a headline, so each card
        lies on its side instead — photo left, text right — rather than
        stacking three full-width photos one above the other. */}
      <ul className="mt-4 grid gap-4 lg:grid-cols-3">
        {ARTICLES.map((a) => (
          <li key={a.url} className="flex">
            <a
              href={a.url}
              target="_blank"
              rel="noreferrer"
              className="group flex w-full flex-col overflow-hidden rounded-2xl border-[3px] border-white bg-white transition-transform duration-200 hover:-translate-y-1 sm:max-lg:flex-row"
            >
              <span className="relative block aspect-video shrink-0 overflow-hidden bg-box-cream-deep sm:max-lg:aspect-auto sm:max-lg:w-2/5">
                <img
                  src={a.cover}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </span>

              <span className="flex flex-1 flex-col p-4">
                {/* The masthead is the source line, so its alt is the paper's name. */}
                <span className="flex min-h-8 items-center justify-between gap-3">
                  <img src={a.logo} alt={a.press} className={`${a.logoClass} w-auto`} />
                  <time
                    dateTime={a.date}
                    className="shrink-0 font-display text-xs font-bold text-sky-ink-soft"
                  >
                    {formatDate(a.date)}
                  </time>
                </span>

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
                  {t("readArticle")}
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </SkyBox>
  );
}
