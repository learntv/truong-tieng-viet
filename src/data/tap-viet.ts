// Handwriting videos for /hoc-tap/tap-viet. The source videos come from the school's
// shared Drive ("HD viết …" folders): a pencil tracing each stroke, letter, digraph,
// number or sign over a grey guide on the ô li grid. The originals run 12–43 s, far too
// slow for young kids, so they were sped up 5×, re-encoded to 540×540 / 30 fps and
// uploaded to R2 under `tap-viet/v3/`, next to a `<id>.jpg` of the finished shape as a
// grey guide (pencil removed) — the video poster and the tracing background.
//
// The per-item tracing masks (135×135, white = the shape) live in public/tap-viet/mask/
// rather than R2, because the tracing check reads their pixels and the R2 domain sends
// no CORS headers.
//
// Each tab is one ô li page: public/tap-viet/grid/<category>.png is a blank grid tile
// repeated as its background, and public/tap-viet/thumb/<id>.png is the item's
// handwriting alone (transparent), drawn on that same grid so it lands on its lines.
// Tiles are a multiple of 4 li tall, so the solid lines stay 4 li apart across rows.

const R2_BASE = "https://bucket.bambootech.fi/tap-viet/v3";

export type TapVietCategoryId = "net" | "chu" | "ghep" | "so";

export type TapVietItem = {
  id: string;
  /** The item's name, e.g. "Chữ a" or "Nét cong kín". */
  title: string;
};

export type TapVietCategory = {
  id: TapVietCategoryId;
  label: string;
  /** One tile's size in li (grid squares); must match the rendered images. */
  tile: { cols: number; rows: number };
  items: TapVietItem[];
};

export const tapVietVideo = (id: string) => `${R2_BASE}/${id}.mp4`;
export const tapVietGuide = (id: string) => `${R2_BASE}/${id}.jpg`;
export const tapVietMask = (id: string) => `/tap-viet/mask/${id}.png`;
export const tapVietThumb = (id: string) => `/tap-viet/thumb/${id}.png`;
export const tapVietGridTile = (category: TapVietCategoryId) => `/tap-viet/grid/${category}.png`;

const strokes: [string, string][] = [
  ["net-ngang", "Nét ngang"],
  ["net-xo", "Nét xổ"],
  ["net-xien-phai", "Nét xiên phải"],
  ["net-xien-trai", "Nét xiên trái"],
  ["net-moc-nguoc", "Nét móc ngược"],
  ["net-moc-hai-dau", "Nét móc hai đầu"],
  ["net-cong-ho-trai", "Nét cong hở trái"],
  ["net-cong-kin", "Nét cong kín"],
  ["net-khuyet-tren", "Nét khuyết trên"],
  ["net-khuyet-duoi", "Nét khuyết dưới"],
  ["net-that-tren", "Nét thắt trên"],
  ["net-that-giua", "Nét thắt giữa"],
];

// Ids match src/data/alphabet.ts. The Drive folder has no ă or q.
const letters: [string, string][] = [
  ["a", "a"],
  ["a-circumflex", "â"],
  ["b", "b"],
  ["c", "c"],
  ["d", "d"],
  ["d-bar", "đ"],
  ["e", "e"],
  ["e-circumflex", "ê"],
  ["g", "g"],
  ["h", "h"],
  ["i", "i"],
  ["k", "k"],
  ["l", "l"],
  ["m", "m"],
  ["n", "n"],
  ["o", "o"],
  ["o-circumflex", "ô"],
  ["o-horn", "ơ"],
  ["p", "p"],
  ["r", "r"],
  ["s", "s"],
  ["t", "t"],
  ["u", "u"],
  ["u-horn", "ư"],
  ["v", "v"],
  ["x", "x"],
  ["y", "y"],
];

// The Drive folder has no nh.
const digraphs = ["ch", "gh", "gi", "kh", "ng", "ngh", "ph", "qu", "th", "tr"];

const signs: [string, string][] = [
  ["dau-lon", "Dấu lớn"],
  ["dau-be", "Dấu bé"],
  ["dau-bang", "Dấu bằng"],
];

export const TAP_VIET: TapVietCategory[] = [
  {
    id: "net",
    label: "Nét cơ bản",
    tile: { cols: 8, rows: 12 },
    items: strokes.map(([id, title]) => ({ id, title })),
  },
  {
    id: "chu",
    label: "Chữ cái",
    tile: { cols: 8, rows: 12 },
    items: letters.map(([id, l]) => ({ id, title: `Chữ ${l}` })),
  },
  {
    id: "ghep",
    label: "Chữ ghép",
    tile: { cols: 12, rows: 12 },
    items: digraphs.map((d) => ({ id: d, title: `Chữ ${d}` })),
  },
  {
    id: "so",
    label: "Số và dấu",
    tile: { cols: 6, rows: 8 },
    items: [
      ...Array.from({ length: 11 }, (_, n) => ({ id: `so-${n}`, title: `Số ${n}` })),
      ...signs.map(([id, title]) => ({ id, title })),
    ],
  },
];
