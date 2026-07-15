import { useEffect, useRef, useState } from "react";
import { Loader2, Mic, Square } from "lucide-react";

const MAX_RECORDING_MS = 10_000;
// RMS (0–1) below this counts as silence. Mic noise floor is usually well under this.
const SILENCE_RMS_THRESHOLD = 0.02;
// How long silence must persist after the child has spoken before we auto-stop.
const SILENCE_STOP_MS = 1_200;

type Phase = "idle" | "starting" | "recording";

// Big round mic button sized for small fingers. Owns the MediaRecorder
// lifecycle; hands the finished take to the parent as an object URL (audio
// stays in the browser — nothing is uploaded).
export function RecordButton({
  onStart,
  onFinish,
  onMicDenied,
  disabled = false,
}: {
  onStart: () => void;
  onFinish: (audioUrl: string) => void;
  onMicDenied: () => void;
  disabled?: boolean;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceRafRef = useRef<number | null>(null);
  const hasSpokenRef = useRef(false);
  const silenceStartRef = useRef<number | null>(null);

  function releaseMic() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  function stopSilenceWatch() {
    if (silenceRafRef.current != null) {
      cancelAnimationFrame(silenceRafRef.current);
      silenceRafRef.current = null;
    }
    // Keep the AudioContext itself alive and reuse it next recording —
    // constructing a fresh one is the slow part (can take a noticeable
    // beat), so only tear down the per-recording analyser node.
    analyserRef.current = null;
  }

  function stopRecording() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    stopSilenceWatch();
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      try {
        recorder.stop();
        return; // onstop finishes up
      } catch {
        /* fall through */
      }
    }
    releaseMic();
    setPhase("idle");
  }

  // Watches mic volume while recording; once the child has spoken and then
  // gone quiet for SILENCE_STOP_MS, stop automatically instead of waiting
  // for the max-duration timeout or a manual tap.
  function watchForSilence() {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(data);

    let sumSquares = 0;
    for (let i = 0; i < data.length; i++) {
      const v = (data[i] - 128) / 128;
      sumSquares += v * v;
    }
    const rms = Math.sqrt(sumSquares / data.length);

    if (rms > SILENCE_RMS_THRESHOLD) {
      hasSpokenRef.current = true;
      silenceStartRef.current = null;
    } else if (hasSpokenRef.current) {
      if (silenceStartRef.current == null) {
        silenceStartRef.current = performance.now();
      } else if (performance.now() - silenceStartRef.current > SILENCE_STOP_MS) {
        stopRecording();
        return;
      }
    }

    silenceRafRef.current = requestAnimationFrame(watchForSilence);
  }

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      stopSilenceWatch();
      audioCtxRef.current?.close().catch(() => {});
      audioCtxRef.current = null;
      const recorder = recorderRef.current;
      if (recorder && recorder.state !== "inactive") {
        // Drop the callback so a stop-on-unmount doesn't call setState.
        recorder.onstop = null;
        try {
          recorder.stop();
        } catch {
          /* ignore */
        }
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
    },
    [],
  );

  async function startRecording() {
    setPhase("starting");
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setPhase("idle");
      onMicDenied();
      return;
    }
    streamRef.current = stream;

    // Safari doesn't support audio/webm — fall back to its default (audio/mp4).
    const mime =
      typeof MediaRecorder.isTypeSupported === "function" && MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "";
    const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    const chunks: BlobPart[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    recorder.onstop = () => {
      releaseMic();
      const blob = new Blob(chunks, mime ? { type: mime } : undefined);
      setPhase("idle");
      onFinish(URL.createObjectURL(blob));
    };
    recorderRef.current = recorder;
    recorder.start();
    setPhase("recording");
    onStart();
    timeoutRef.current = setTimeout(stopRecording, MAX_RECORDING_MS);

    // Deferred to the next tick so the "recording" UI paints immediately —
    // constructing/reusing the AudioContext can take a noticeable beat and
    // would otherwise delay the button's visual feedback.
    setTimeout(() => {
      // Recording may have already been stopped (e.g. instant re-tap) by the
      // time this runs — skip setup in that case.
      if (recorderRef.current !== recorder || recorder.state === "inactive") return;
      try {
        const AudioCtx =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioCtx = audioCtxRef.current ?? new AudioCtx();
        audioCtxRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);
        analyserRef.current = analyser;
        hasSpokenRef.current = false;
        silenceStartRef.current = null;
        silenceRafRef.current = requestAnimationFrame(watchForSilence);
      } catch {
        /* silence auto-stop unavailable — manual stop / max duration still work */
      }
    }, 0);
  }

  const isRecording = phase === "recording";

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled || phase === "starting"}
        aria-label={isRecording ? "Dừng ghi âm" : "Bắt đầu ghi âm"}
        className={[
          "grid h-20 w-20 place-items-center rounded-full border-2 border-black/10 text-white ring-4 ring-white/70",
          "transition-[transform,box-shadow,filter] duration-150 ease-bounce hover:brightness-110",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0",
          isRecording
            ? "animate-pulse-glow bg-red-500 translate-y-[3px] shadow-[0_1px_0_0_#be123c]"
            : "bg-gradient-primary shadow-bevel-primary active:translate-y-[3px] active:shadow-bevel-primary-active",
        ].join(" ")}
      >
        {phase === "starting" ? (
          <Loader2 className="h-8 w-8 animate-spin" />
        ) : isRecording ? (
          <Square className="h-7 w-7 fill-white" strokeWidth={2} />
        ) : (
          <Mic className="h-9 w-9" strokeWidth={2.5} />
        )}
      </button>
      <span className="font-display text-sm font-bold text-navy">
        {isRecording ? "Đang nghe em nói… bấm để xong" : "Em nói nào!"}
      </span>
    </div>
  );
}
