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
  /**
   * A fuller two-to-three sentence version of `blurb`, for the chủ đề page header where there's
   * room to say more. Same voice as `blurb` — still written for a child.
   */
  description: string;
};

export const QUYEN1_LANDMARKS: Landmark[] = [
  {
    chuDeIndex: 0,
    name: "Vịnh Hạ Long",
    x: 21,
    y: 25,
    photo: halongPhoto,
    blurb: "Hàng nghìn hòn đảo đá nhô lên giữa làn nước xanh biếc ở Quảng Ninh.",
    description:
      "Vịnh Hạ Long nằm ở tỉnh Quảng Ninh, nơi hàng nghìn hòn đảo đá vôi nhô lên giữa làn nước xanh biếc. Trong lòng các hòn đảo là những hang động tuyệt đẹp đã hình thành qua hàng triệu năm. Vịnh được UNESCO công nhận là Di sản Thiên nhiên Thế giới.",
  },
  {
    chuDeIndex: 1,
    name: "Phố cổ Hội An",
    x: 21,
    y: 80,
    photo: hoiAnPhoto,
    blurb: "Phố cổ bên sông Hoài, rực rỡ đèn lồng đủ màu mỗi khi đêm xuống.",
    description:
      "Phố cổ Hội An nằm bên sông Hoài, tỉnh Quảng Nam, với những ngôi nhà gỗ mái ngói đã hơn bốn trăm năm tuổi. Mỗi khi đêm xuống, cả khu phố rực rỡ ánh đèn lồng đủ màu và người ta thả hoa đăng trôi trên sông. Đây cũng là một Di sản Văn hóa Thế giới.",
  },
  {
    chuDeIndex: 2,
    name: "Thành phố Hồ Chí Minh",
    x: 55,
    y: 52,
    photo: landmark81Photo,
    blurb: "Thành phố lớn nhất nước ta, nơi có toà nhà Landmark 81 cao nhất Việt Nam.",
    description:
      "Thành phố Hồ Chí Minh là thành phố lớn nhất và nhộn nhịp nhất nước ta, nằm bên sông Sài Gòn. Giữa những con đường tấp nập là toà nhà Landmark 81 cao tới 81 tầng — toà nhà cao nhất Việt Nam. Nơi đây có chợ Bến Thành và rất nhiều món ăn ngon.",
  },
  {
    chuDeIndex: 3,
    name: "Cầu Vàng",
    x: 86,
    y: 33,
    photo: cauVangPhoto,
    blurb: "Cây cầu vàng trên núi Bà Nà, Đà Nẵng, được hai bàn tay đá khổng lồ nâng đỡ.",
    description:
      "Cầu Vàng nằm trên đỉnh núi Bà Nà, thành phố Đà Nẵng, cao hơn một nghìn mét so với mặt biển. Cây cầu được hai bàn tay đá khổng lồ nâng đỡ, trông như bàn tay của các vị thần đưa cầu lên giữa mây trời. Cầu khánh thành năm 2018 và nhanh chóng nổi tiếng khắp thế giới.",
  },
];
