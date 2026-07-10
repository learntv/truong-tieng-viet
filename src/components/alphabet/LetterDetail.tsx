import { useEffect } from "react";
import { X, Volume2 } from "lucide-react";
import type { AlphabetLetter } from "@/data/alphabet";

export function LetterDetail({
  letter,
  onClose,
  speak,
  soundOn,
}: {
  letter: AlphabetLetter;
  onClose: () => void;
  speak: (text: string) => void;
  soundOn: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 animate-modal-overlay-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-[36px] bg-white shadow-2xl animate-modal-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-navy shadow-card transition hover:scale-110 hover:bg-white active:scale-95"
          aria-label="Đóng"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Big letter panel */}
        <div className="flex flex-col items-center justify-center bg-gradient-sunset px-6 pb-6 pt-10 text-navy">
          <div className="flex items-baseline gap-3 font-display font-extrabold leading-none">
            <span className="text-[110px] drop-shadow-[0_4px_0_rgba(255,255,255,0.6)] sm:text-[140px]">
              {letter.upper}
            </span>
            <span className="text-[80px] text-navy/85 drop-shadow-[0_4px_0_rgba(255,255,255,0.5)] sm:text-[100px]">
              {letter.lower}
            </span>
          </div>
          <button
            onClick={() => speak(letter.phonic)}
            disabled={!soundOn}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 font-display text-sm font-extrabold text-navy shadow-card transition hover:scale-105 active:scale-95 disabled:opacity-50 sm:text-base"
          >
            <Volume2 className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            Nghe âm "{letter.phonic}"
          </button>
        </div>

        {/* Example word */}
        <div className="flex flex-col items-center gap-3 px-6 py-6 text-center">
          <div className="text-6xl sm:text-7xl">{letter.emoji}</div>
          <p className="font-display text-2xl font-extrabold text-navy sm:text-3xl">
            {highlightFirst(letter.word, letter.lower)}
          </p>
          <button
            onClick={() => speak(letter.word)}
            disabled={!soundOn}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-display text-sm font-extrabold text-white shadow-soft transition hover:scale-105 active:scale-95 disabled:opacity-50 sm:text-base"
          >
            <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
            Nghe từ này
          </button>
        </div>
      </div>
    </div>
  );
}

// Colour the first matching letter in the word to reinforce recognition.
function highlightFirst(word: string, letter: string) {
  const idx = word.toLocaleLowerCase("vi").indexOf(letter.toLocaleLowerCase("vi"));
  if (idx === -1) return word;
  return (
    <>
      {word.slice(0, idx)}
      <span className="text-primary">{word[idx]}</span>
      {word.slice(idx + 1)}
    </>
  );
}
