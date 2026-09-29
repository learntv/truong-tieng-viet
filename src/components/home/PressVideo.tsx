import { useEffect, useRef, useState } from "react";
import { ExternalLink, Play } from "lucide-react";
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

function VnaPlayer() {
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
      <div className="grid aspect-video w-full place-items-center gap-3 bg-ink-800 p-6 text-center">
        <p className="text-sm leading-relaxed text-ink-100">
          Không phát được video ở đây. Em có thể xem bản gốc trên trang của Thông tấn xã Việt Nam.
        </p>
        <a
          href={ARTICLE_URL}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold text-white underline underline-offset-4"
        >
          Xem trên VNA
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
        aria-label="Phát video: Kết nối thế hệ trẻ kiều bào với cội nguồn"
        className="group relative block aspect-video w-full cursor-pointer overflow-hidden"
      >
        <img
          src={poster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-ink-900/50 via-ink-900/10 to-transparent transition-opacity duration-300 group-hover:opacity-70" />
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid size-16 place-items-center rounded-full bg-white shadow-lg transition-transform duration-300 ease-out group-hover:scale-110 sm:size-20">
            {/* Nudged right so the triangle's visual centre sits on the disc's. */}
            <Play className="ml-1 size-7 fill-brand-600 text-brand-600 sm:size-9" aria-hidden />
          </span>
        </span>
        <span className="absolute right-3 bottom-3 rounded-full bg-ink-900/70 px-2.5 py-1 text-caption font-semibold text-white backdrop-blur-sm">
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
  return (
    <article className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-xs lg:flex">
      {/* Navy behind the player so that if the text column ever runs taller
        than the 16:9 player, the spare height reads as letterboxing. */}
      <div className="flex shrink-0 items-center bg-ink-900 lg:w-3/5">
        <VnaPlayer />
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        {/* The masthead is the source line, so its alt is the outlet's name. */}
        <div className="flex min-h-8 items-center justify-between gap-3">
          <img src={vietnamMediaLogo} alt="VietNam Media (TTXVN)" className="h-5 w-auto" />
          <time dateTime="2026-07-26" className="shrink-0 text-caption font-medium text-ink-500">
            26-07-2026
          </time>
        </div>

        <h3 className="mt-4 text-h2 text-ink-900">Kết nối thế hệ trẻ kiều bào với cội nguồn</h3>
        <p className="mt-3 line-clamp-5 text-[0.9375rem] leading-relaxed text-ink-600">
          Một nền tảng học tiếng Việt trực tuyến có tên “Trường Tiếng Việt Online” dành riêng cho
          con em người Việt ở nước ngoài vừa được ra mắt tại Canada. Sự kiện do Hội đồng Văn hóa
          Giáo dục Canada-Việt Nam tổ chức theo hình thức trực tiếp kết hợp trực tuyến.
        </p>

        <a
          href={ARTICLE_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-auto inline-flex w-fit items-center gap-1.5 pt-5 text-sm font-semibold text-brand-600 hover:underline"
        >
          Xem bài gốc
          <ExternalLink className="size-4" aria-hidden />
        </a>
      </div>
    </article>
  );
}
