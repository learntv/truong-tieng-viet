import { useEffect, useRef, useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import { useTranslations } from "use-intl";
import poster from "@/assets/vna-ket-noi-coi-nguon-poster.webp";
import vietnamMediaLogo from "@/assets/press/vietnam-media-logo.png";

/**
 * The VNA television report on the project's launch, played in place.
 *
 * VNA publishes no iframe embed for its video pages — the page runs video.js
 * over a bare HLS playlist — so the stream is attached to our own <video>
 * instead. Their CDN answers with `access-control-allow-origin: *` on the
 * playlists and the segments alike, which is what makes that legal from here;
 * if that ever changes the poster and the "Xem trên VNA" link below still
 * carry the section on their own.
 */
const ARTICLE_URL =
  "https://vietnammedia.vnanet.vn/video/ket-noi-the-he-tre-kieu-bao-voi-coi-nguon-196132.htm";

const STREAM_URL =
  "https://storageovp.vnews.gov.vn/mediacache/TS/2026_07/26/VNTNUZDWCOAB/hls/master.m3u8";

/* The report's own headline, verbatim, so it stays Vietnamese in every language. */
const REPORT_TITLE = "Kết nối thế hệ trẻ kiều bào với cội nguồn";

function VnaPlayer() {
  const t = useTranslations("home.press");
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!playing || !video) return;

    // Safari and iOS play HLS natively. Everywhere else needs hls.js, which is
    // imported here rather than at module scope so its bundle stays out of the
    // homepage until someone actually presses play.
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = STREAM_URL;
      void video.play().catch(() => {});
      return;
    }

    let hls: { destroy: () => void } | null = null;
    let cancelled = false;

    void import("hls.js")
      .then(({ default: Hls }) => {
        if (cancelled) return;
        if (!Hls.isSupported()) {
          setFailed(true);
          return;
        }
        const instance = new Hls();
        hls = instance;
        instance.on(Hls.Events.MANIFEST_PARSED, () => void video.play().catch(() => {}));
        instance.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) setFailed(true);
        });
        instance.loadSource(STREAM_URL);
        instance.attachMedia(video);
      })
      .catch(() => setFailed(true));

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [playing]);

  if (failed) {
    return (
      <div className="grid aspect-video w-full place-items-center gap-3 bg-box-cream p-6 text-center">
        <p className="text-sm leading-relaxed text-sky-ink-soft">{t("videoFailed")}</p>
        <a
          href={ARTICLE_URL}
          target="_blank"
          rel="noreferrer"
          className="font-display text-sm font-extrabold text-indigo hover:underline"
        >
          {t("watchOnVna")}
        </a>
      </div>
    );
  }

  // Until play is pressed the poster is a plain image, so the page costs no
  // stream request and no player code on load.
  if (!playing) {
    return (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        aria-label={t("playVideo", { title: REPORT_TITLE })}
        className="group relative block aspect-video w-full cursor-pointer overflow-hidden"
      >
        <img
          src={poster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <span className="absolute inset-0 bg-indigo-deep/20 transition-colors group-hover:bg-indigo-deep/10" />
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-primary shadow-btn transition-transform group-hover:scale-105 sm:h-20 sm:w-20">
            {/* Nudged right so the triangle's visual centre sits on the disc's. */}
            <Play
              className="ml-1 h-7 w-7 fill-primary-foreground text-primary-foreground sm:h-9 sm:w-9"
              aria-hidden
            />
          </span>
        </span>
        <span className="absolute right-2 bottom-2 rounded-md bg-indigo-deep/70 px-2 py-0.5 font-display text-xs font-bold text-white">
          02:12
        </span>
      </button>
    );
  }

  return (
    <video
      ref={videoRef}
      controls
      playsInline
      poster={poster}
      className="aspect-video w-full bg-black"
    />
  );
}

/**
 * The featured item at the top of the homepage's "Tin tức" box (PressNews),
 * built as a wider sibling of that box's article cards — same white card, same
 * masthead-and-date line, headline, excerpt and link — so the report reads as
 * the lead story of the list rather than a separate player dropped above it.
 *
 * Unlike the article cards the card itself is not a link: it holds the play
 * button, and a button inside a link is invalid and ambiguous to tap. The
 * link to the original is its own element at the foot of the text instead.
 *
 * Side by side from lg (player left, text right); stacked below that, where
 * the player needs the full width to stay watchable.
 */
export function PressVideo() {
  const t = useTranslations("home.press");
  return (
    <article className="overflow-hidden rounded-2xl border-[3px] border-white bg-white lg:flex">
      {/* Navy behind the player so that if the text column ever runs taller
        than the 16:9 player, the spare height reads as letterboxing. */}
      <div className="flex shrink-0 items-center bg-indigo-deep lg:w-3/5">
        <VnaPlayer />
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* The masthead is the source line, so its alt is the outlet's name. */}
        <div className="flex min-h-8 items-center justify-between gap-3">
          <img src={vietnamMediaLogo} alt="VietNam Media (TTXVN)" className="h-5 w-auto" />
          <time
            dateTime="2026-07-26"
            className="shrink-0 font-display text-xs font-bold text-sky-ink-soft"
          >
            26-07-2026
          </time>
        </div>

        <h3
          lang="vi"
          className="mt-3 font-display text-lg leading-snug font-extrabold text-sky-ink"
        >
          {REPORT_TITLE}
        </h3>
        <p lang="vi" className="mt-2 line-clamp-4 text-sm leading-relaxed text-sky-ink-soft">
          Một nền tảng học tiếng Việt trực tuyến có tên “Trường Tiếng Việt Online” dành riêng cho
          con em người Việt ở nước ngoài vừa được ra mắt tại Canada. Sự kiện do Hội đồng Văn hóa
          Giáo dục Canada-Việt Nam tổ chức theo hình thức trực tiếp kết hợp trực tuyến.
        </p>

        <a
          href={ARTICLE_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-auto inline-flex w-fit items-center gap-1.5 pt-3 font-display text-sm font-extrabold text-indigo hover:text-indigo-deep hover:underline"
        >
          {t("viewOriginal")}
          <ExternalLink className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </article>
  );
}
