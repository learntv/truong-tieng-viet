// Vietnamese alphabet ("Bảng chữ cái") content for /hoc-tap/bang-chu-cai.
// One entry per letter (including the 7 diacritic vowels ă, â, đ, ê, ô, ơ, ư).
// `image` keys match filenames in src/assets/alphabet/ (imported in the route file).

export type AlphabetWord = {
  vi: string;
  en: string;
  emoji: string;
  /** Rough English phonetic respelling to help English-speaking readers say the word aloud. */
  pronunciation: string;
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
      { vi: "Ba", en: "dad", emoji: "👨", pronunciation: "bah" },
      { vi: "Cá", en: "fish", emoji: "🐟", pronunciation: "kah" },
      { vi: "Áo", en: "shirt", emoji: "👕", pronunciation: "ow" },
    ],
  },
  {
    id: "a-breve",
    letter: "ă",
    soundName: "á",
    words: [
      { vi: "Ăn", en: "to eat", emoji: "🍽️", pronunciation: "an" },
      { vi: "Măng", en: "bamboo shoot", emoji: "🎋", pronunciation: "mahng" },
      { vi: "Khăn", en: "scarf", emoji: "🧣", pronunciation: "khan" },
    ],
  },
  {
    id: "a-circumflex",
    letter: "â",
    soundName: "ớ",
    words: [
      { vi: "Ấm", en: "kettle", emoji: "☕", pronunciation: "uhm" },
      { vi: "Cầu", en: "bridge", emoji: "🌉", pronunciation: "koh" },
      { vi: "Gấu", en: "bear", emoji: "🐻", pronunciation: "gohw" },
    ],
  },
  {
    id: "b",
    letter: "b",
    soundName: "bờ",
    words: [
      { vi: "Bà", en: "grandma", emoji: "👵", pronunciation: "bah" },
      { vi: "Bóng", en: "ball", emoji: "⚽", pronunciation: "bawng" },
      { vi: "Bút", en: "pen", emoji: "🖊️", pronunciation: "boot" },
    ],
  },
  {
    id: "c",
    letter: "c",
    soundName: "cờ",
    words: [
      { vi: "Cây", en: "tree", emoji: "🌳", pronunciation: "kay" },
      { vi: "Cua", en: "crab", emoji: "🦀", pronunciation: "kwah" },
      { vi: "Cam", en: "orange", emoji: "🍊", pronunciation: "kahm" },
    ],
  },
  {
    id: "d",
    letter: "d",
    soundName: "dờ",
    words: [
      { vi: "Dê", en: "goat", emoji: "🐐", pronunciation: "zay" },
      { vi: "Dừa", en: "coconut", emoji: "🥥", pronunciation: "zeu-uh" },
      { vi: "Dao", en: "knife", emoji: "🔪", pronunciation: "zow" },
    ],
  },
  {
    id: "d-bar",
    letter: "đ",
    soundName: "đờ",
    words: [
      { vi: "Đèn", en: "lamp", emoji: "💡", pronunciation: "den" },
      { vi: "Đá", en: "rock / ice", emoji: "🧊", pronunciation: "dah" },
      { vi: "Đũa", en: "chopsticks", emoji: "🥢", pronunciation: "doo-ah" },
    ],
  },
  {
    id: "e",
    letter: "e",
    soundName: "e",
    words: [
      { vi: "Mẹ", en: "mom", emoji: "👩", pronunciation: "meh" },
      { vi: "Xe", en: "car", emoji: "🚗", pronunciation: "seh" },
      { vi: "Én", en: "swallow (bird)", emoji: "🐦", pronunciation: "en" },
    ],
  },
  {
    id: "e-circumflex",
    letter: "ê",
    soundName: "ê",
    words: [
      { vi: "Bê", en: "calf", emoji: "🐄", pronunciation: "bay" },
      { vi: "Ghế", en: "chair", emoji: "🪑", pronunciation: "gay" },
      { vi: "Đêm", en: "night", emoji: "🌙", pronunciation: "daym" },
    ],
  },
  {
    id: "g",
    letter: "g",
    soundName: "gờ",
    words: [
      { vi: "Gà", en: "chicken", emoji: "🐔", pronunciation: "gah" },
      { vi: "Gấu", en: "bear", emoji: "🐻", pronunciation: "gohw" },
      { vi: "Gạo", en: "rice", emoji: "🍚", pronunciation: "gow" },
    ],
  },
  {
    id: "h",
    letter: "h",
    soundName: "hờ",
    words: [
      { vi: "Hoa", en: "flower", emoji: "🌸", pronunciation: "hwah" },
      { vi: "Heo", en: "pig", emoji: "🐷", pronunciation: "heh-oh" },
      { vi: "Hồ", en: "lake", emoji: "🏞️", pronunciation: "hoh" },
    ],
  },
  {
    id: "i",
    letter: "i",
    soundName: "i",
    words: [
      { vi: "Chim", en: "bird", emoji: "🐦", pronunciation: "chim" },
      { vi: "Kim", en: "needle", emoji: "🪡", pronunciation: "kim" },
      { vi: "Bi", en: "marble", emoji: "🔵", pronunciation: "bee" },
    ],
  },
  {
    id: "k",
    letter: "k",
    soundName: "ca",
    words: [
      { vi: "Kem", en: "ice cream", emoji: "🍦", pronunciation: "kehm" },
      { vi: "Kẹo", en: "candy", emoji: "🍬", pronunciation: "keh-oh" },
      { vi: "Kiến", en: "ant", emoji: "🐜", pronunciation: "kee-en" },
    ],
  },
  {
    id: "l",
    letter: "l",
    soundName: "lờ",
    words: [
      { vi: "Lá", en: "leaf", emoji: "🍃", pronunciation: "lah" },
      { vi: "Lợn", en: "pig", emoji: "🐖", pronunciation: "luhn" },
      { vi: "Lúa", en: "rice plant", emoji: "🌾", pronunciation: "loo-ah" },
    ],
  },
  {
    id: "m",
    letter: "m",
    soundName: "mờ",
    words: [
      { vi: "Mèo", en: "cat", emoji: "🐱", pronunciation: "meh-oh" },
      { vi: "Mưa", en: "rain", emoji: "🌧️", pronunciation: "muh-uh" },
      { vi: "Mũ", en: "hat", emoji: "🧢", pronunciation: "moo" },
    ],
  },
  {
    id: "n",
    letter: "n",
    soundName: "nờ",
    words: [
      { vi: "Nước", en: "water", emoji: "💧", pronunciation: "nuh-uhk" },
      { vi: "Nai", en: "deer", emoji: "🦌", pronunciation: "nai" },
      { vi: "Nón", en: "conical hat", emoji: "👒", pronunciation: "nawn" },
    ],
  },
  {
    id: "o",
    letter: "o",
    soundName: "o",
    words: [
      { vi: "Bò", en: "cow", emoji: "🐄", pronunciation: "baw" },
      { vi: "Cỏ", en: "grass", emoji: "🌱", pronunciation: "kaw" },
      { vi: "Ong", en: "bee", emoji: "🐝", pronunciation: "awng" },
    ],
  },
  {
    id: "o-circumflex",
    letter: "ô",
    soundName: "ô",
    words: [
      { vi: "Ô", en: "umbrella", emoji: "☂️", pronunciation: "oh" },
      { vi: "Bố", en: "dad", emoji: "👨", pronunciation: "boh" },
      { vi: "Cô", en: "teacher (female)", emoji: "👩‍🏫", pronunciation: "koh" },
    ],
  },
  {
    id: "o-horn",
    letter: "ơ",
    soundName: "ơ",
    words: [
      { vi: "Cờ", en: "flag", emoji: "🚩", pronunciation: "kuh" },
      { vi: "Bơi", en: "to swim", emoji: "🏊", pronunciation: "boy" },
      { vi: "Bơ", en: "avocado", emoji: "🥑", pronunciation: "buh" },
    ],
  },
  {
    id: "p",
    letter: "p",
    soundName: "pờ",
    words: [
      { vi: "Pin", en: "battery", emoji: "🔋", pronunciation: "pin" },
      { vi: "Piano", en: "piano", emoji: "🎹", pronunciation: "pee-ah-noh" },
      { vi: "Pizza", en: "pizza", emoji: "🍕", pronunciation: "pit-sah" },
    ],
  },
  {
    id: "q",
    letter: "q",
    soundName: "quy",
    words: [
      { vi: "Quả", en: "fruit", emoji: "🍎", pronunciation: "kwah" },
      { vi: "Quạt", en: "fan", emoji: "🌀", pronunciation: "kwaht" },
      { vi: "Quê", en: "hometown", emoji: "🏡", pronunciation: "kway" },
    ],
  },
  {
    id: "r",
    letter: "r",
    soundName: "rờ",
    words: [
      { vi: "Rắn", en: "snake", emoji: "🐍", pronunciation: "ran" },
      { vi: "Rùa", en: "turtle", emoji: "🐢", pronunciation: "roo-ah" },
      { vi: "Răng", en: "tooth", emoji: "🦷", pronunciation: "rahng" },
    ],
  },
  {
    id: "s",
    letter: "s",
    soundName: "sờ",
    words: [
      { vi: "Sư tử", en: "lion", emoji: "🦁", pronunciation: "seu tuh" },
      { vi: "Sao", en: "star", emoji: "⭐", pronunciation: "sow" },
      { vi: "Sách", en: "book", emoji: "📖", pronunciation: "sahk" },
    ],
  },
  {
    id: "t",
    letter: "t",
    soundName: "tờ",
    words: [
      { vi: "Táo", en: "apple", emoji: "🍎", pronunciation: "tow" },
      { vi: "Tôm", en: "shrimp", emoji: "🦐", pronunciation: "tohm" },
      { vi: "Tay", en: "hand", emoji: "✋", pronunciation: "tay" },
    ],
  },
  {
    id: "u",
    letter: "u",
    soundName: "u",
    words: [
      { vi: "Cún", en: "puppy", emoji: "🐶", pronunciation: "koon" },
      { vi: "Thu", en: "autumn", emoji: "🍂", pronunciation: "too" },
      { vi: "Múa", en: "to dance", emoji: "💃", pronunciation: "moo-ah" },
    ],
  },
  {
    id: "u-horn",
    letter: "ư",
    soundName: "ư",
    words: [
      { vi: "Thư", en: "letter (mail)", emoji: "✉️", pronunciation: "teu" },
      { vi: "Sữa", en: "milk", emoji: "🥛", pronunciation: "seu-uh" },
      { vi: "Cưa", en: "saw", emoji: "🪚", pronunciation: "keu-uh" },
    ],
  },
  {
    id: "v",
    letter: "v",
    soundName: "vờ",
    words: [
      { vi: "Voi", en: "elephant", emoji: "🐘", pronunciation: "voy" },
      { vi: "Vịt", en: "duck", emoji: "🦆", pronunciation: "vit" },
      { vi: "Váy", en: "dress", emoji: "👗", pronunciation: "vay" },
    ],
  },
  {
    id: "x",
    letter: "x",
    soundName: "xờ",
    words: [
      { vi: "Xoài", en: "mango", emoji: "🥭", pronunciation: "swai" },
      { vi: "Xanh", en: "blue / green", emoji: "💙", pronunciation: "sahn" },
      { vi: "Xúc xắc", en: "dice", emoji: "🎲", pronunciation: "sook sahk" },
    ],
  },
  {
    id: "y",
    letter: "y",
    soundName: "i dài",
    words: [
      { vi: "Y tá", en: "nurse", emoji: "👩‍⚕️", pronunciation: "ee tah" },
      { vi: "Yêu", en: "to love", emoji: "❤️", pronunciation: "yew" },
      { vi: "Ý", en: "idea", emoji: "💭", pronunciation: "ee" },
    ],
  },
];
