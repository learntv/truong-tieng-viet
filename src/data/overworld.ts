import halongPhoto from "@/assets/landmarks/halong.jpg";
import hoiAnPhoto from "@/assets/landmarks/hoi-an.jpg";
import landmark81Photo from "@/assets/landmarks/landmark-81.jpg";
import cauVangPhoto from "@/assets/landmarks/cau-vang.jpg";

// The four landmarks painted into the Quyển 1 overworld backdrop, one per chủ đề. `x`/`y` are
// percentages of the artwork, so pins stay glued to their landmark at every screen size — tune
// these here if the artwork is ever re-cropped. The order below is the order of the journey:
// Hạ Long → Hội An → Landmark 81 → Cầu Vàng.
//
// The photos are real stock shots of each place (Unsplash License — free for commercial use,
// no attribution required), cropped to a 640x360 card cover. Source photo pages:
//   Hạ Long      https://unsplash.com/photos/aQNHyIOwFZs
//   Hội An       https://unsplash.com/photos/AAoCUzB23kE
//   Landmark 81  https://unsplash.com/photos/0yjsdmgkBYE
//   Cầu Vàng     https://unsplash.com/photos/pXiXeosLOAk
export type Landmark = {
  chuDeIndex: number;
  /** Real place the artwork depicts — shown on the pin banner and in the popup. */
  name: string;
  /** Percent of the artwork's width / height. `y` marks the ground the pin stands on. */
  x: number;
  y: number;
  /** Photo of the real place, used as the cover of the landmark card. */
  photo: string;
  /** One kid-sized sentence about the place — keep it short enough to read at a glance. */
  blurb: string;
};

export const QUYEN1_LANDMARKS: Landmark[] = [
  {
    chuDeIndex: 0,
    name: "Vịnh Hạ Long",
    x: 21,
    y: 25,
    photo: halongPhoto,
    blurb: "Hàng nghìn hòn đảo đá nhô lên giữa làn nước xanh biếc ở Quảng Ninh.",
  },
  {
    chuDeIndex: 1,
    name: "Phố cổ Hội An",
    x: 21,
    y: 80,
    photo: hoiAnPhoto,
    blurb: "Phố cổ bên sông Hoài, rực rỡ đèn lồng đủ màu mỗi khi đêm xuống.",
  },
  {
    chuDeIndex: 2,
    name: "Thành phố Hồ Chí Minh",
    x: 55,
    y: 52,
    photo: landmark81Photo,
    blurb: "Thành phố lớn nhất nước ta, nơi có toà nhà Landmark 81 cao nhất Việt Nam.",
  },
  {
    chuDeIndex: 3,
    name: "Cầu Vàng",
    x: 86,
    y: 33,
    photo: cauVangPhoto,
    blurb: "Cây cầu vàng trên núi Bà Nà, Đà Nẵng, được hai bàn tay đá khổng lồ nâng đỡ.",
  },
];
