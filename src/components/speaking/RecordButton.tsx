import { useEffect, useRef, useState } from "react";
import { Loader2, Mic, Square } from "lucide-react";

const MAX_RECORDING_MS = 10_000;

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

  function releaseMic() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  function stopRecording() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
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

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
  }

  const isRecording = phase === "recording";

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled || phase === "starting"}
        aria-label={isRecording ? "Dừng ghi âm" : "Bắt đầu ghi âm"}
        className={[
          "grid h-20 w-20 place-items-center rounded-full text-white shadow-glow-primary ring-4 ring-white/70 transition",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isRecording
            ? "animate-pulse-glow bg-gradient-to-br from-rose-400 to-red-600 scale-105"
            : "bg-gradient-primary hover:scale-105 active:scale-95",
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
