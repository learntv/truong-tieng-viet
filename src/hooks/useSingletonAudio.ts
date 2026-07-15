import { useCallback, useRef, useState } from "react";

// Only one clip should play at a time across the whole app — starting a new one pauses
// whichever was already playing, the same way a single narrator can't talk over themselves.
// Module-level rather than React context: this is a page-wide media concern, not something
// that needs to flow through the component tree, and every caller already renders its own
// <audio> element, so there's nothing to lift into a provider.
let currentlyPlaying: HTMLAudioElement | null = null;

// Shared play/pause/singleton-tracking behavior for a tap-to-hear button backed by an
// <audio> element — used for lesson narration, word-cloud captions, alphabet sounds, and
// speaking-practice model pronunciation alike. Callers render their own <audio> with the
// returned ref/src/handlers, since preload strategy and click semantics (toggle vs. always
// restart) differ per call site.
export function useSingletonAudio(src: string) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const stop = useCallback(() => setPlaying(false), []);

  const play = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (currentlyPlaying && currentlyPlaying !== el) currentlyPlaying.pause();
    currentlyPlaying = el;
    el.currentTime = 0;
    setPlaying(true);
    el.play().catch(stop);
  }, [stop]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  return { playing, play, pause, audioRef, src, onEnded: stop, onPause: stop, onError: stop };
}
