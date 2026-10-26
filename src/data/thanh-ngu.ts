// Vietnamese idioms ("Thành ngữ") content for /hoc-tap/thanh-ngu.
// Each idiom's `id` also keys its illustration in components/thanh-ngu/IdiomArt.tsx.

import type { BoxTone } from "@/components/learning/boxTones";

export type IdiomWord = {
  vi: string;
  /** The word's own meaning, so the idiom can be read word by word. */
  en: string;
};

/** A line of explanation, in Vietnamese with an English version beside it. */
export type IdiomText = { vi: string; en: string };

export type Idiom = {
  id: string;
  /** The idiom itself, put into English: shown under it when the site isn't in Vietnamese. */
  translation: { en: string };
  /** The idiom as it is written, one entry per word. */
  words: IdiomWord[];
  /** The picture the words paint, taken at face value. */
  literal: IdiomText;
  /** What people actually mean when they say it. */
  meaning: IdiomText;
  example: IdiomText;
  /** The quiz hides `words[blank]` and offers it among these two wrong answers. */
  blank: number;
  distractors: [IdiomWord, IdiomWord];
  tone: BoxTone;
};

export function idiomText(idiom: Idiom): string {
  return idiom.words.map((w) => w.vi).join(" ");
}

export const IDIOMS: Idiom[] = [
  {
    id: "ech-ngoi-day-gieng",
    translation: { en: "A frog sitting at the bottom of a well" },
    words: [
      { vi: "Ếch", en: "frog" },
      { vi: "ngồi", en: "sits" },
      { vi: "đáy", en: "bottom" },
      { vi: "giếng", en: "well" },
    ],
    literal: {
      vi: "Chú ếch ngồi dưới đáy giếng, ngước lên chỉ thấy một khoảng trời bé xíu, nên tưởng bầu trời chỉ to bằng cái miệng giếng.",
      en: "A frog sits at the bottom of a well. Looking up, it sees only a tiny circle of sky, so it thinks the whole sky is that small.",
    },
    meaning: {
      vi: "Chỉ người biết ít, nhìn thấy ít mà lại tưởng mình biết hết mọi thứ.",
      en: "Someone who has seen very little of the world but thinks they know everything.",
    },
    example: {
      vi: "Đọc thêm sách đi con, đừng làm ếch ngồi đáy giếng nhé!",
      en: "Read more books, don't be a frog at the bottom of a well!",
    },
    blank: 3,
    distractors: [
      { vi: "ao", en: "pond" },
      { vi: "sông", en: "river" },
    ],
    tone: "mint",
  },
  {
    id: "dan-gay-tai-trau",
    translation: { en: "Playing the lute to a buffalo" },
    words: [
      { vi: "Đàn", en: "lute" },
      { vi: "gảy", en: "plucked" },
      { vi: "tai", en: "ear" },
      { vi: "trâu", en: "buffalo" },
    ],
    literal: {
      vi: "Một người ngồi gảy đàn thật hay ngay bên tai con trâu, nhưng trâu chẳng hiểu gì, cứ thản nhiên nhai cỏ.",
      en: "Someone plays a lovely tune on a lute right by a buffalo's ear, but the buffalo understands nothing and just keeps chewing grass.",
    },
    meaning: {
      vi: "Nói điều hay với người không hiểu hoặc không chịu nghe thì cũng chẳng ích gì.",
      en: "Explaining something good to someone who can't understand it, or won't listen, is wasted effort.",
    },
    example: {
      vi: "Em giảng mãi mà bạn cứ mải chơi, đúng là đàn gảy tai trâu!",
      en: "I kept explaining but my friend just kept playing. Like plucking a lute for a buffalo!",
    },
    blank: 3,
    distractors: [
      { vi: "mèo", en: "cat" },
      { vi: "gà", en: "chicken" },
    ],
    tone: "peach",
  },
  {
    id: "nuoc-do-dau-vit",
    translation: { en: "Water poured on a duck's head" },
    words: [
      { vi: "Nước", en: "water" },
      { vi: "đổ", en: "poured" },
      { vi: "đầu", en: "head" },
      { vi: "vịt", en: "duck" },
    ],
    literal: {
      vi: "Đổ nước lên đầu con vịt, nước trôi tuột đi hết, vì lông vịt không thấm nước.",
      en: "Pour water on a duck's head and it all slides right off, because duck feathers are waterproof.",
    },
    meaning: {
      vi: "Dạy bảo, nhắc nhở mãi mà người nghe chẳng nhớ, chẳng tiếp thu được gì.",
      en: "Advice that never sinks in, no matter how many times it is repeated.",
    },
    example: {
      vi: "Mẹ nhắc cất giày bao nhiêu lần rồi mà vẫn như nước đổ đầu vịt.",
      en: "Mom has asked me to put my shoes away so many times, but it's like water off a duck's head.",
    },
    blank: 3,
    distractors: [
      { vi: "cá", en: "fish" },
      { vi: "mèo", en: "cat" },
    ],
    tone: "ice",
  },
  {
    id: "dau-voi-duoi-chuot",
    translation: { en: "An elephant's head, a mouse's tail" },
    words: [
      { vi: "Đầu", en: "head" },
      { vi: "voi", en: "elephant" },
      { vi: "đuôi", en: "tail" },
      { vi: "chuột", en: "mouse" },
    ],
    literal: {
      vi: "Một con vật thật kỳ lạ: cái đầu to như đầu voi, mà cái đuôi lại bé tí như đuôi chuột.",
      en: "A funny creature with a head as big as an elephant's and a tail as tiny as a mouse's.",
    },
    meaning: {
      vi: "Việc gì bắt đầu rất to tát, rầm rộ, nhưng càng về sau càng nhỏ dần rồi bỏ dở.",
      en: "Something that starts big and exciting, then fizzles out to almost nothing.",
    },
    example: {
      vi: "Vườn rau của lớp em lúc đầu ai cũng hăng hái, rồi chẳng ai tưới nữa, thật là đầu voi đuôi chuột.",
      en: "Everyone was excited about our class garden at first, then nobody watered it. Elephant head, mouse tail.",
    },
    blank: 3,
    distractors: [
      { vi: "sóc", en: "squirrel" },
      { vi: "gà", en: "chicken" },
    ],
    tone: "lavender",
  },
  {
    id: "meo-mu-vo-ca-ran",
    translation: { en: "A blind cat grabs a fried fish" },
    words: [
      { vi: "Mèo", en: "cat" },
      { vi: "mù", en: "blind" },
      { vi: "vớ", en: "grabs" },
      { vi: "cá", en: "fish" },
      { vi: "rán", en: "fried" },
    ],
    literal: {
      vi: "Một chú mèo chẳng nhìn thấy gì, vậy mà lại vớ được ngay một con cá rán thơm phức.",
      en: "A cat that can't see a thing somehow grabs a delicious fried fish.",
    },
    meaning: {
      vi: "Gặp may bất ngờ, có được điều tốt mà chẳng cần tìm kiếm.",
      en: "Getting lucky by pure chance, without even looking.",
    },
    example: {
      vi: "Em vừa vào tiệm bánh thì cô chủ phát bánh miễn phí, đúng là mèo mù vớ cá rán!",
      en: "I walked into the bakery just as they started giving out free cakes. A blind cat finding fried fish!",
    },
    blank: 3,
    distractors: [
      { vi: "bánh", en: "cake" },
      { vi: "thịt", en: "meat" },
    ],
    tone: "sun",
  },
  {
    id: "cuoi-ngua-xem-hoa",
    translation: { en: "Looking at flowers from a galloping horse" },
    words: [
      { vi: "Cưỡi", en: "ride" },
      { vi: "ngựa", en: "horse" },
      { vi: "xem", en: "look at" },
      { vi: "hoa", en: "flowers" },
    ],
    literal: {
      vi: "Ngồi trên lưng ngựa phi thật nhanh qua vườn hoa, chỉ kịp liếc qua chứ chẳng ngắm được bông nào.",
      en: "Galloping on a horse through a flower garden, you only catch a glimpse and never really see a single flower.",
    },
    meaning: {
      vi: "Làm việc gì cũng vội vàng, qua loa, chỉ biết sơ sơ bên ngoài.",
      en: "Doing something in a rush and only skimming the surface.",
    },
    example: {
      vi: "Đọc truyện kiểu cưỡi ngựa xem hoa thì sao nhớ được nhân vật nào!",
      en: "If you rush through a story like that, how will you remember any of the characters?",
    },
    blank: 1,
    distractors: [
      { vi: "voi", en: "elephant" },
      { vi: "trâu", en: "buffalo" },
    ],
    tone: "pink",
  },
  {
    id: "nhu-ca-gap-nuoc",
    translation: { en: "Like a fish finding water" },
    words: [
      { vi: "Như", en: "like" },
      { vi: "cá", en: "fish" },
      { vi: "gặp", en: "meets" },
      { vi: "nước", en: "water" },
    ],
    literal: {
      vi: "Chú cá được thả vào hồ nước mát, vui vẻ bơi lội tung tăng.",
      en: "A fish is let into a cool pond and swims around happily.",
    },
    meaning: {
      vi: "Được ở đúng nơi mình thích, làm đúng việc mình giỏi, nên rất vui và thoải mái.",
      en: "Being exactly where you belong, doing what you love, and feeling right at home.",
    },
    example: {
      vi: "Được ra biển chơi, bé Na vui như cá gặp nước.",
      en: "At the beach, little Na was as happy as a fish in water.",
    },
    blank: 3,
    distractors: [
      { vi: "cát", en: "sand" },
      { vi: "mây", en: "clouds" },
    ],
    tone: "ice",
  },
  {
    id: "cham-nhu-rua",
    translation: { en: "Slow as a turtle" },
    words: [
      { vi: "Chậm", en: "slow" },
      { vi: "như", en: "like" },
      { vi: "rùa", en: "turtle" },
    ],
    literal: {
      vi: "Chú rùa bò từng bước, từng bước một, mãi mới tới nơi.",
      en: "A turtle crawls one step at a time and takes ages to get anywhere.",
    },
    meaning: {
      vi: "Làm gì cũng rất chậm chạp.",
      en: "Very, very slow at doing something.",
    },
    example: {
      vi: "Sáng nay em mặc áo chậm như rùa nên suýt trễ học.",
      en: "This morning I got dressed as slowly as a turtle and nearly missed school.",
    },
    blank: 2,
    distractors: [
      { vi: "thỏ", en: "rabbit" },
      { vi: "sóc", en: "squirrel" },
    ],
    tone: "mint",
  },
  {
    id: "vui-nhu-tet",
    translation: { en: "Happy as Tết" },
    words: [
      { vi: "Vui", en: "happy" },
      { vi: "như", en: "like" },
      { vi: "Tết", en: "Lunar New Year" },
    ],
    literal: {
      vi: "Vui như những ngày Tết, khi cả nhà sum họp, có bánh chưng, hoa mai và phong bao lì xì đỏ.",
      en: "As joyful as Tết, when the whole family gathers with bánh chưng, apricot blossoms and red lucky envelopes.",
    },
    meaning: {
      vi: "Rất vui vẻ, rộn ràng, náo nhiệt.",
      en: "Extremely happy, lively and full of cheer.",
    },
    example: {
      vi: "Hôm ông bà sang chơi, nhà em vui như Tết.",
      en: "The day Grandma and Grandpa came to visit, our house was as happy as Tết.",
    },
    blank: 2,
    distractors: [
      { vi: "mưa", en: "rain" },
      { vi: "gió", en: "wind" },
    ],
    tone: "pink",
  },
  {
    id: "uong-nuoc-nho-nguon",
    translation: { en: "When you drink water, remember its source" },
    words: [
      { vi: "Uống", en: "drink" },
      { vi: "nước", en: "water" },
      { vi: "nhớ", en: "remember" },
      { vi: "nguồn", en: "spring" },
    ],
    literal: {
      vi: "Khi uống ngụm nước mát, hãy nhớ đến dòng suối trên núi cao, nơi nước ấy chảy ra.",
      en: "When you sip cool water, remember the mountain spring it came from.",
    },
    meaning: {
      vi: "Phải biết ơn những người đã chăm lo, giúp đỡ mình, như ông bà, cha mẹ, thầy cô.",
      en: "Always be grateful to the people who cared for you, like grandparents, parents and teachers.",
    },
    example: {
      vi: "Tết này em viết thiệp cảm ơn cô giáo cũ, vì uống nước phải nhớ nguồn.",
      en: "This Tết I'm writing a thank-you card to my old teacher, because when you drink water, you remember its source.",
    },
    blank: 3,
    distractors: [
      { vi: "sông", en: "river" },
      { vi: "cốc", en: "cup" },
    ],
    tone: "lavender",
  },
  {
    id: "nuoc-chay-da-mon",
    translation: { en: "Flowing water wears away stone" },
    words: [
      { vi: "Nước", en: "water" },
      { vi: "chảy", en: "flows" },
      { vi: "đá", en: "stone" },
      { vi: "mòn", en: "wears away" },
    ],
    literal: {
      vi: "Từng giọt nước nhỏ cứ rơi mãi xuống hòn đá, lâu ngày đá cứng cũng bị mòn đi.",
      en: "Little drops of water keep falling on a stone, and over a long time even hard stone wears away.",
    },
    meaning: {
      vi: "Kiên trì từng chút một thì việc khó đến mấy cũng làm được.",
      en: "Keep at it little by little and even the hardest thing becomes possible.",
    },
    example: {
      vi: "Mỗi ngày em học năm từ mới, nước chảy đá mòn, giờ em đọc được cả truyện rồi!",
      en: "I learned five new words every day. Water wears away stone, and now I can read a whole story!",
    },
    blank: 2,
    distractors: [
      { vi: "cây", en: "tree" },
      { vi: "cát", en: "sand" },
    ],
    tone: "peach",
  },
  {
    id: "khoe-nhu-voi",
    translation: { en: "Strong as an elephant" },
    words: [
      { vi: "Khỏe", en: "strong" },
      { vi: "như", en: "like" },
      { vi: "voi", en: "elephant" },
    ],
    literal: {
      vi: "Chú voi to lớn dùng vòi nhấc bổng cả khúc gỗ nặng, nhẹ như không.",
      en: "A big elephant lifts a heavy log with its trunk as if it weighed nothing.",
    },
    meaning: {
      vi: "Rất khỏe mạnh, có sức lực lớn.",
      en: "Very strong and full of energy.",
    },
    example: {
      vi: "Bố bê cả thùng sách lên lầu một mình, khỏe như voi!",
      en: "Dad carried the whole box of books upstairs by himself. Strong as an elephant!",
    },
    blank: 2,
    distractors: [
      { vi: "kiến", en: "ant" },
      { vi: "mèo", en: "cat" },
    ],
    tone: "sun",
  },
  {
    id: "nhanh-nhu-soc",
    translation: { en: "Quick as a squirrel" },
    words: [
      { vi: "Nhanh", en: "quick" },
      { vi: "như", en: "like" },
      { vi: "sóc", en: "squirrel" },
    ],
    literal: {
      vi: "Chú sóc nhỏ chạy vụt lên cây, nhảy từ cành này sang cành khác, chớp mắt đã chẳng thấy đâu.",
      en: "A little squirrel dashes up a tree and leaps from branch to branch. Blink and it's gone.",
    },
    meaning: {
      vi: "Rất nhanh nhẹn, hoạt bát.",
      en: "Very quick and nimble.",
    },
    example: {
      vi: "Nghe mẹ gọi ăn cơm, em chạy xuống nhà nhanh như sóc.",
      en: "When Mom called us for dinner, I ran downstairs as quick as a squirrel.",
    },
    blank: 2,
    distractors: [
      { vi: "rùa", en: "turtle" },
      { vi: "ốc", en: "snail" },
    ],
    tone: "peach",
  },
  {
    id: "kien-tha-lau-cung-day-to",
    translation: { en: "Ants that keep carrying will fill their nest" },
    words: [
      { vi: "Kiến", en: "ants" },
      { vi: "tha", en: "carry" },
      { vi: "lâu", en: "a long time" },
      { vi: "cũng", en: "also" },
      { vi: "đầy", en: "fill" },
      { vi: "tổ", en: "nest" },
    ],
    literal: {
      vi: "Mỗi chú kiến chỉ tha được một hạt bé xíu, nhưng tha mãi, tha mãi thì tổ cũng đầy ắp thức ăn.",
      en: "Each ant can carry only one tiny crumb, but by carrying and carrying, they fill their nest with food.",
    },
    meaning: {
      vi: "Chăm chỉ góp nhặt từng chút một, lâu dần sẽ được nhiều.",
      en: "Save or work a little at a time, and in the end it adds up to a lot.",
    },
    example: {
      vi: "Mỗi ngày em bỏ heo đất một đồng xu, kiến tha lâu cũng đầy tổ mà!",
      en: "I put one coin in my piggy bank every day. Ants carrying crumbs fill their nest in the end!",
    },
    blank: 0,
    distractors: [
      { vi: "Chim", en: "birds" },
      { vi: "Mèo", en: "cats" },
    ],
    tone: "sun",
  },
  {
    id: "la-lanh-dum-la-rach",
    translation: { en: "The whole leaf wraps the torn leaf" },
    words: [
      { vi: "Lá", en: "leaf" },
      { vi: "lành", en: "whole" },
      { vi: "đùm", en: "wraps" },
      { vi: "lá", en: "leaf" },
      { vi: "rách", en: "torn" },
    ],
    literal: {
      vi: "Chiếc lá lành lặn che chở, ôm lấy chiếc lá bị rách.",
      en: "A whole, healthy leaf shelters and wraps around a torn leaf.",
    },
    meaning: {
      vi: "Người có điều kiện hơn giúp đỡ, đùm bọc người đang gặp khó khăn.",
      en: "Those who are doing well help and look after those who are struggling.",
    },
    example: {
      vi: "Cả lớp em góp sách vở tặng các bạn vùng lũ, lá lành đùm lá rách.",
      en: "Our class collected books for children in the flooded areas. The whole leaf wraps the torn one.",
    },
    blank: 4,
    distractors: [
      { vi: "xanh", en: "green" },
      { vi: "vàng", en: "yellow" },
    ],
    tone: "lavender",
  },
  {
    id: "tre-gia-mang-moc",
    translation: { en: "Old bamboo, new shoots" },
    words: [
      { vi: "Tre", en: "bamboo" },
      { vi: "già", en: "old" },
      { vi: "măng", en: "bamboo shoots" },
      { vi: "mọc", en: "grow" },
    ],
    literal: {
      vi: "Cây tre già dần đi, thì dưới gốc lại có những búp măng non mọc lên.",
      en: "As the bamboo grows old, fresh young shoots spring up at its feet.",
    },
    meaning: {
      vi: "Thế hệ trước già đi, đã có thế hệ sau lớn lên tiếp nối.",
      en: "As one generation grows older, the next grows up to carry on.",
    },
    example: {
      vi: "Ông dạy bố đánh cờ, giờ bố lại dạy em, tre già măng mọc.",
      en: "Grandpa taught Dad to play chess, and now Dad is teaching me. Old bamboo, new shoots.",
    },
    blank: 2,
    distractors: [
      { vi: "lá", en: "leaves" },
      { vi: "hoa", en: "flowers" },
    ],
    tone: "mint",
  },
  {
    id: "nuoc-den-chan-moi-nhay",
    translation: { en: "Jumping only when the water reaches your feet" },
    words: [
      { vi: "Nước", en: "water" },
      { vi: "đến", en: "reaches" },
      { vi: "chân", en: "feet" },
      { vi: "mới", en: "only then" },
      { vi: "nhảy", en: "jump" },
    ],
    literal: {
      vi: "Nước lũ dâng lên tận chân rồi mới cuống cuồng nhảy lên chỗ cao.",
      en: "Only when the floodwater reaches your feet do you scramble to jump to higher ground.",
    },
    meaning: {
      vi: "Để việc đến sát nút mới vội vàng làm.",
      en: "Leaving things to the last minute, then rushing.",
    },
    example: {
      vi: "Mai thi rồi mà tối nay em mới học bài, đúng là nước đến chân mới nhảy.",
      en: "The test is tomorrow and I'm only studying tonight. Jumping only when the water reaches my feet.",
    },
    blank: 2,
    distractors: [
      { vi: "cổ", en: "neck" },
      { vi: "tay", en: "hands" },
    ],
    tone: "ice",
  },
  {
    id: "thung-rong-keu-to",
    translation: { en: "An empty barrel makes the loudest noise" },
    words: [
      { vi: "Thùng", en: "barrel" },
      { vi: "rỗng", en: "empty" },
      { vi: "kêu", en: "sounds" },
      { vi: "to", en: "loud" },
    ],
    literal: {
      vi: "Gõ vào cái thùng rỗng thì nghe kêu boong boong rất to, còn thùng đầy thì chẳng kêu mấy.",
      en: "Knock on an empty barrel and it booms loudly, while a full one barely makes a sound.",
    },
    meaning: {
      vi: "Người hiểu biết ít lại hay khoe khoang, nói to, nói nhiều.",
      en: "People who know the least often boast and talk the loudest.",
    },
    example: {
      vi: "Bạn ấy khoe giỏi toán nhất lớp mà chẳng giải được bài nào, đúng là thùng rỗng kêu to.",
      en: "My classmate bragged about being the best at maths but couldn't solve a single problem. Empty barrels make the most noise.",
    },
    blank: 1,
    distractors: [
      { vi: "đầy", en: "full" },
      { vi: "nặng", en: "heavy" },
    ],
    tone: "pink",
  },
  {
    id: "an-qua-nho-ke-trong-cay",
    translation: { en: "When you eat the fruit, remember who planted the tree" },
    words: [
      { vi: "Ăn", en: "eat" },
      { vi: "quả", en: "fruit" },
      { vi: "nhớ", en: "remember" },
      { vi: "kẻ", en: "the one who" },
      { vi: "trồng", en: "planted" },
      { vi: "cây", en: "tree" },
    ],
    literal: {
      vi: "Khi ăn quả ngọt, hãy nhớ đến người đã vất vả trồng và chăm sóc cái cây.",
      en: "When you eat a sweet fruit, remember the person who worked hard to plant and tend the tree.",
    },
    meaning: {
      vi: "Biết ơn những người đã làm ra điều tốt đẹp cho mình.",
      en: "Be thankful to the people whose hard work gave you the good things you enjoy.",
    },
    example: {
      vi: "Ăn quả nhớ kẻ trồng cây, con nhớ cảm ơn các bác nông dân đã làm ra hạt gạo nhé.",
      en: "Remember who planted the tree: let's thank the farmers who grow our rice.",
    },
    blank: 1,
    distractors: [
      { vi: "cơm", en: "rice" },
      { vi: "kẹo", en: "candy" },
    ],
    tone: "peach",
  },
  {
    id: "cho-treo-meo-day",
    translation: { en: "Hang it from the dog, cover it from the cat" },
    words: [
      { vi: "Chó", en: "dog" },
      { vi: "treo", en: "hang up" },
      { vi: "mèo", en: "cat" },
      { vi: "đậy", en: "cover" },
    ],
    literal: {
      vi: "Đồ ăn phải treo lên cao cho chó không với tới, và đậy lại cho mèo không ăn vụng được.",
      en: "Hang the food up high so the dog can't reach it, and cover it so the cat can't sneak a bite.",
    },
    meaning: {
      vi: "Phải cẩn thận giữ gìn đồ đạc, phòng trước kẻo mất.",
      en: "Look after your things carefully and guard them before anything goes wrong.",
    },
    example: {
      vi: "Bánh sinh nhật để trên bàn đấy, chó treo mèo đậy cẩn thận nhé con!",
      en: "The birthday cake is on the table. Keep it safe from the dog and the cat!",
    },
    blank: 2,
    distractors: [
      { vi: "gà", en: "chicken" },
      { vi: "chuột", en: "mouse" },
    ],
    tone: "lavender",
  },
];
