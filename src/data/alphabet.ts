// Vietnamese alphabet ("Bảng chữ cái") content for /hoc-tap/bang-chu-cai.
// One entry per letter (including the 7 diacritic vowels ă, â, đ, ê, ô, ơ, ư).
// `image` keys match filenames in src/assets/alphabet/ (imported in the route file).

export type AlphabetWord = {
  vi: string;
  en: string;
  emoji: string;
};

export type AlphabetLetter = {
  /** Stable id, also the asset filename (without extension) in src/assets/alphabet/. */
  id: string;
  letter: string;
  /** How the letter is read aloud in a Vietnamese classroom, e.g. "bờ", "cờ". */
  soundName: string;
  words: AlphabetWord[];
};

export const ALPHABET: AlphabetLetter[] = [
  {
    id: "a",
    letter: "a",
    soundName: "a",
    words: [
      { vi: "Ba", en: "dad", emoji: "👨" },
      { vi: "Cá", en: "fish", emoji: "🐟" },
      { vi: "Áo", en: "shirt", emoji: "👕" },
    ],
  },
  {
    id: "a-breve",
    letter: "ă",
    soundName: "á",
    words: [
      { vi: "Ăn", en: "to eat", emoji: "🍽️" },
      { vi: "Măng", en: "bamboo shoot", emoji: "🎋" },
      { vi: "Khăn", en: "scarf", emoji: "🧣" },
    ],
  },
  {
    id: "a-circumflex",
    letter: "â",
    soundName: "ớ",
    words: [
      { vi: "Ấm", en: "kettle", emoji: "☕" },
      { vi: "Cầu", en: "bridge", emoji: "🌉" },
      { vi: "Gấu", en: "bear", emoji: "🐻" },
    ],
  },
  {
    id: "b",
    letter: "b",
    soundName: "bờ",
    words: [
      { vi: "Bà", en: "grandma", emoji: "👵" },
      { vi: "Bóng", en: "ball", emoji: "⚽" },
      { vi: "Bút", en: "pen", emoji: "🖊️" },
    ],
  },
  {
    id: "c",
    letter: "c",
    soundName: "cờ",
    words: [
      { vi: "Cây", en: "tree", emoji: "🌳" },
      { vi: "Cua", en: "crab", emoji: "🦀" },
      { vi: "Cam", en: "orange", emoji: "🍊" },
    ],
  },
  {
    id: "d",
    letter: "d",
    soundName: "dờ",
    words: [
      { vi: "Dê", en: "goat", emoji: "🐐" },
      { vi: "Dừa", en: "coconut", emoji: "🥥" },
      { vi: "Dao", en: "knife", emoji: "🔪" },
    ],
  },
  {
    id: "d-bar",
    letter: "đ",
    soundName: "đờ",
    words: [
      { vi: "Đèn", en: "lamp", emoji: "💡" },
      { vi: "Đá", en: "rock / ice", emoji: "🧊" },
      { vi: "Đũa", en: "chopsticks", emoji: "🥢" },
    ],
  },
  {
    id: "e",
    letter: "e",
    soundName: "e",
    words: [
      { vi: "Mẹ", en: "mom", emoji: "👩" },
      { vi: "Xe", en: "car", emoji: "🚗" },
      { vi: "Én", en: "swallow (bird)", emoji: "🐦" },
    ],
  },
  {
    id: "e-circumflex",
    letter: "ê",
    soundName: "ê",
    words: [
      { vi: "Bê", en: "calf", emoji: "🐄" },
      { vi: "Ghế", en: "chair", emoji: "🪑" },
      { vi: "Đêm", en: "night", emoji: "🌙" },
    ],
  },
  {
    id: "g",
    letter: "g",
    soundName: "gờ",
    words: [
      { vi: "Gà", en: "chicken", emoji: "🐔" },
      { vi: "Gấu", en: "bear", emoji: "🐻" },
      { vi: "Gạo", en: "rice", emoji: "🍚" },
    ],
  },
  {
    id: "h",
    letter: "h",
    soundName: "hờ",
    words: [
      { vi: "Hoa", en: "flower", emoji: "🌸" },
      { vi: "Heo", en: "pig", emoji: "🐷" },
      { vi: "Hồ", en: "lake", emoji: "🏞️" },
    ],
  },
  {
    id: "i",
    letter: "i",
    soundName: "i",
    words: [
      { vi: "Chim", en: "bird", emoji: "🐦" },
      { vi: "Kim", en: "needle", emoji: "🪡" },
      { vi: "Bi", en: "marble", emoji: "🔵" },
    ],
  },
  {
    id: "k",
    letter: "k",
    soundName: "ca",
    words: [
      { vi: "Kem", en: "ice cream", emoji: "🍦" },
      { vi: "Kẹo", en: "candy", emoji: "🍬" },
      { vi: "Kiến", en: "ant", emoji: "🐜" },
    ],
  },
  {
    id: "l",
    letter: "l",
    soundName: "lờ",
    words: [
      { vi: "Lá", en: "leaf", emoji: "🍃" },
      { vi: "Lợn", en: "pig", emoji: "🐖" },
      { vi: "Lúa", en: "rice plant", emoji: "🌾" },
    ],
  },
  {
    id: "m",
    letter: "m",
    soundName: "mờ",
    words: [
      { vi: "Mèo", en: "cat", emoji: "🐱" },
      { vi: "Mưa", en: "rain", emoji: "🌧️" },
      { vi: "Mũ", en: "hat", emoji: "🧢" },
    ],
  },
  {
    id: "n",
    letter: "n",
    soundName: "nờ",
    words: [
      { vi: "Nước", en: "water", emoji: "💧" },
      { vi: "Nai", en: "deer", emoji: "🦌" },
      { vi: "Nón", en: "conical hat", emoji: "👒" },
    ],
  },
  {
    id: "o",
    letter: "o",
    soundName: "o",
    words: [
      { vi: "Bò", en: "cow", emoji: "🐄" },
      { vi: "Cỏ", en: "grass", emoji: "🌱" },
      { vi: "Ong", en: "bee", emoji: "🐝" },
    ],
  },
  {
    id: "o-circumflex",
    letter: "ô",
    soundName: "ô",
    words: [
      { vi: "Ô", en: "umbrella", emoji: "☂️" },
      { vi: "Bố", en: "dad", emoji: "👨" },
      { vi: "Cô", en: "teacher (female)", emoji: "👩‍🏫" },
    ],
  },
  {
    id: "o-horn",
    letter: "ơ",
    soundName: "ơ",
    words: [
      { vi: "Cờ", en: "flag", emoji: "🚩" },
      { vi: "Bơi", en: "to swim", emoji: "🏊" },
      { vi: "Bơ", en: "avocado", emoji: "🥑" },
    ],
  },
  {
    id: "p",
    letter: "p",
    soundName: "pờ",
    words: [
      { vi: "Pin", en: "battery", emoji: "🔋" },
      { vi: "Piano", en: "piano", emoji: "🎹" },
      { vi: "Pizza", en: "pizza", emoji: "🍕" },
    ],
  },
  {
    id: "q",
    letter: "q",
    soundName: "quy",
    words: [
      { vi: "Quả", en: "fruit", emoji: "🍎" },
      { vi: "Quạt", en: "fan", emoji: "🌀" },
      { vi: "Quê", en: "hometown", emoji: "🏡" },
    ],
  },
  {
    id: "r",
    letter: "r",
    soundName: "rờ",
    words: [
      { vi: "Rắn", en: "snake", emoji: "🐍" },
      { vi: "Rùa", en: "turtle", emoji: "🐢" },
      { vi: "Răng", en: "tooth", emoji: "🦷" },
    ],
  },
  {
    id: "s",
    letter: "s",
    soundName: "sờ",
    words: [
      { vi: "Sư tử", en: "lion", emoji: "🦁" },
      { vi: "Sao", en: "star", emoji: "⭐" },
      { vi: "Sách", en: "book", emoji: "📖" },
    ],
  },
  {
    id: "t",
    letter: "t",
    soundName: "tờ",
    words: [
      { vi: "Táo", en: "apple", emoji: "🍎" },
      { vi: "Tôm", en: "shrimp", emoji: "🦐" },
      { vi: "Tay", en: "hand", emoji: "✋" },
    ],
  },
  {
    id: "u",
    letter: "u",
    soundName: "u",
    words: [
      { vi: "Cún", en: "puppy", emoji: "🐶" },
      { vi: "Thu", en: "autumn", emoji: "🍂" },
      { vi: "Múa", en: "to dance", emoji: "💃" },
    ],
  },
  {
    id: "u-horn",
    letter: "ư",
    soundName: "ư",
    words: [
      { vi: "Thư", en: "letter (mail)", emoji: "✉️" },
      { vi: "Sữa", en: "milk", emoji: "🥛" },
      { vi: "Cưa", en: "saw", emoji: "🪚" },
    ],
  },
  {
    id: "v",
    letter: "v",
    soundName: "vờ",
    words: [
      { vi: "Voi", en: "elephant", emoji: "🐘" },
      { vi: "Vịt", en: "duck", emoji: "🦆" },
      { vi: "Váy", en: "dress", emoji: "👗" },
    ],
  },
  {
    id: "x",
    letter: "x",
    soundName: "xờ",
    words: [
      { vi: "Xoài", en: "mango", emoji: "🥭" },
      { vi: "Xanh", en: "blue / green", emoji: "💙" },
      { vi: "Xúc xắc", en: "dice", emoji: "🎲" },
    ],
  },
  {
    id: "y",
    letter: "y",
    soundName: "i dài",
    words: [
      { vi: "Y tá", en: "nurse", emoji: "👩‍⚕️" },
      { vi: "Yêu", en: "to love", emoji: "❤️" },
      { vi: "Ý", en: "idea", emoji: "💭" },
    ],
  },
];
