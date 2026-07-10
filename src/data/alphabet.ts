// Vietnamese alphabet data for the "Bảng chữ cái" learning tab.
// Each letter has an example word + emoji illustration and a phonics sound
// (the "âm" — how it sounds in a word) alongside the letter's name.
// We deliberately skip tone marks — this tab focuses on letter recognition.

export type AlphabetLetter = {
  upper: string;
  lower: string;
  /** Phonics sound spoken first ("bờ", "cờ"...). */
  phonic: string;
  /** Word illustrating the letter (starts with it). */
  word: string;
  /** Emoji illustration — flat, kid-friendly. */
  emoji: string;
  kind: "nguyen-am" | "phu-am";
};

export const ALPHABET: AlphabetLetter[] = [
  { upper: "A", lower: "a", phonic: "a", word: "quả táo", emoji: "🍎", kind: "nguyen-am" },
  { upper: "Ă", lower: "ă", phonic: "á", word: "ăn cơm", emoji: "🍚", kind: "nguyen-am" },
  { upper: "Â", lower: "â", phonic: "ớ", word: "ấm trà", emoji: "🫖", kind: "nguyen-am" },
  { upper: "B", lower: "b", phonic: "bờ", word: "con bò", emoji: "🐄", kind: "phu-am" },
  { upper: "C", lower: "c", phonic: "cờ", word: "con cá", emoji: "🐟", kind: "phu-am" },
  { upper: "D", lower: "d", phonic: "dờ", word: "quả dưa", emoji: "🍉", kind: "phu-am" },
  { upper: "Đ", lower: "đ", phonic: "đờ", word: "đèn pin", emoji: "🔦", kind: "phu-am" },
  { upper: "E", lower: "e", phonic: "e", word: "em bé", emoji: "👶", kind: "nguyen-am" },
  { upper: "Ê", lower: "ê", phonic: "ê", word: "con ếch", emoji: "🐸", kind: "nguyen-am" },
  { upper: "G", lower: "g", phonic: "gờ", word: "con gà", emoji: "🐔", kind: "phu-am" },
  { upper: "H", lower: "h", phonic: "hờ", word: "hoa hồng", emoji: "🌹", kind: "phu-am" },
  { upper: "I", lower: "i", phonic: "i", word: "cái ivi", emoji: "📺", kind: "nguyen-am" },
  { upper: "K", lower: "k", phonic: "ca", word: "cái kéo", emoji: "✂️", kind: "phu-am" },
  { upper: "L", lower: "l", phonic: "lờ", word: "cái lá", emoji: "🍃", kind: "phu-am" },
  { upper: "M", lower: "m", phonic: "mờ", word: "con mèo", emoji: "🐱", kind: "phu-am" },
  { upper: "N", lower: "n", phonic: "nờ", word: "cái nón", emoji: "👒", kind: "phu-am" },
  { upper: "O", lower: "o", phonic: "o", word: "quả ổi", emoji: "🍈", kind: "nguyen-am" },
  { upper: "Ô", lower: "ô", phonic: "ô", word: "cái ô", emoji: "☂️", kind: "nguyen-am" },
  { upper: "Ơ", lower: "ơ", phonic: "ơ", word: "cái cờ", emoji: "🚩", kind: "nguyen-am" },
  { upper: "P", lower: "p", phonic: "pờ", word: "quả pin", emoji: "🔋", kind: "phu-am" },
  { upper: "Q", lower: "q", phonic: "quy", word: "quả quýt", emoji: "🍊", kind: "phu-am" },
  { upper: "R", lower: "r", phonic: "rờ", word: "cái rổ", emoji: "🧺", kind: "phu-am" },
  { upper: "S", lower: "s", phonic: "sờ", word: "ngôi sao", emoji: "⭐", kind: "phu-am" },
  { upper: "T", lower: "t", phonic: "tờ", word: "con tôm", emoji: "🦐", kind: "phu-am" },
  { upper: "U", lower: "u", phonic: "u", word: "quả ú", emoji: "🍡", kind: "nguyen-am" },
  { upper: "Ư", lower: "ư", phonic: "ư", word: "con hươu", emoji: "🦌", kind: "nguyen-am" },
  { upper: "V", lower: "v", phonic: "vờ", word: "cái ví", emoji: "👛", kind: "phu-am" },
  { upper: "X", lower: "x", phonic: "xờ", word: "xe hơi", emoji: "🚗", kind: "phu-am" },
  { upper: "Y", lower: "y", phonic: "i", word: "y tá", emoji: "👩‍⚕️", kind: "nguyen-am" },
];
