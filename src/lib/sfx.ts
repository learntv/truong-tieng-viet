// Tiny Web Audio synth for playful UI sounds.
// All sounds are generated on the fly — no audio files, no network cost.
// The AudioContext is created lazily on first user interaction, which also
// satisfies browser autoplay policies.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    try {
      ctx = new AC();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

type ToneOpts = {
  /** Start frequency in Hz */
  freq: number;
  /** Glide to this frequency by the end (defaults to freq) */
  freqEnd?: number;
  type?: OscillatorType;
  /** Seconds */
  duration?: number;
  /** Peak gain, keep well below 1 */
  volume?: number;
  /** Seconds from now to start */
  delay?: number;
};

function tone({
  freq,
  freqEnd,
  type = "sine",
  duration = 0.12,
  volume = 0.12,
  delay = 0,
}: ToneOpts) {
  const ac = getCtx();
  if (!ac) return;
  const t0 = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd ?? freq), t0 + duration);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(volume, t0 + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

export const sfx = {
  /** Soft bubbly pop — selecting things */
  pop() {
    tone({ freq: 420, freqEnd: 780, type: "sine", duration: 0.1, volume: 0.14 });
  },
  /** Bright tap — small buttons */
  click() {
    tone({ freq: 640, freqEnd: 520, type: "triangle", duration: 0.07, volume: 0.1 });
  },
  /** Little upward chirp — hover/highlight moments */
  chirp() {
    tone({ freq: 880, freqEnd: 1320, type: "sine", duration: 0.08, volume: 0.07 });
  },
  /** Two-note boing — mascot hop */
  hop() {
    tone({ freq: 300, freqEnd: 600, type: "sine", duration: 0.14, volume: 0.13 });
    tone({ freq: 500, freqEnd: 900, type: "sine", duration: 0.12, volume: 0.1, delay: 0.09 });
  },
  /** Rising magical arpeggio — starting a lesson / big CTA */
  sparkle() {
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    notes.forEach((f, i) =>
      tone({ freq: f, type: "triangle", duration: 0.16, volume: 0.09, delay: i * 0.07 }),
    );
  },
  /** Happy major fanfare — completing / advancing topics */
  success() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((f, i) =>
      tone({ freq: f, type: "sine", duration: 0.22, volume: 0.11, delay: i * 0.09 }),
    );
  },
  /** Low wobble — locked / not allowed */
  locked() {
    tone({ freq: 180, freqEnd: 140, type: "square", duration: 0.12, volume: 0.05 });
    tone({ freq: 160, freqEnd: 120, type: "square", duration: 0.14, volume: 0.05, delay: 0.12 });
  },
};
