import { useEffect, useRef, useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import { SkyBox } from "@/components/ui/sky-box";
import poster from "@/assets/vna-ket-noi-coi-nguon-poster.webp";

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
      <div className="grid aspect-video w-full place-items-center gap-3 rounded-xl border-[3px] border-white bg-white/75 p-6 text-center">
        <p className="text-sm leading-relaxed text-sky-ink-soft">
          Không phát được video ở đây. Em có thể xem bản gốc trên trang của Thông tấn xã Việt Nam.
        </p>
        <a
          href={ARTICLE_URL}
          target="_blank"
          rel="noreferrer"
          className="font-display text-sm font-extrabold text-indigo hover:underline"
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
        className="group relative block aspect-video w-full cursor-pointer overflow-hidden rounded-xl border-[3px] border-white"
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
      className="aspect-video w-full rounded-xl border-[3px] border-white bg-black"
    />
  );
}

export function PressVideo() {
  return (
    <SkyBox
      tone="red"
      ribbon="Truyền thông"
      title="Kết nối thế hệ trẻ kiều bào với cội nguồn"
      lede={
        <>
          Phóng sự của <strong>Thông tấn xã Việt Nam</strong> về lễ ra mắt nền tảng học tiếng Việt
          trực tuyến dành riêng cho con em người Việt ở nước ngoài, do Hội đồng Văn hóa Giáo dục
          Canada–Việt Nam tổ chức tại Canada.
        </>
      }
    >
      <div className="mx-auto max-w-2xl">
        <VnaPlayer />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="font-display text-xs font-bold tracking-[0.08em] text-sky-ink-soft uppercase">
            VNA · 26-07-2026
          </p>
          <a
            href={ARTICLE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-display text-sm font-extrabold text-indigo hover:underline"
          >
            Xem bài gốc trên VNA
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </SkyBox>
  );
}
