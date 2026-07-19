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
//   Hội An       https://unsplash.com/photos/JjxdZZKyWq0
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
  /** The "Khám phá" popup content — see {@link Discovery}. */
  discovery: Discovery;
};

/**
 * What the child reads in the "Khám phá <địa điểm>" popup. Split in two on purpose: `intro` is
 * free, `deep` stays behind a lock until every chặng of the chủ đề is done, so there's something
 * waiting at the end of the lessons besides the stamp.
 */
export type Discovery = {
  /** Postcard stats — three short label/value pairs shown as tiles under the cover photo. */
  facts: { icon: string; label: string; value: string }[];
  /** Part 1, always readable. */
  intro: { heading: string; paragraphs: string[] };
  /** Part 2, unlocked by finishing the chủ đề. `teaser` is what the lock shows instead. */
  deep: { heading: string; teaser: string; paragraphs: string[] };
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
    discovery: {
      facts: [
        { icon: "🏝️", label: "Số hòn đảo", value: "gần 2.000" },
        { icon: "📍", label: "Ở đâu", value: "Quảng Ninh" },
        { icon: "🏆", label: "Danh hiệu", value: "Di sản UNESCO" },
      ],
      intro: {
        heading: "Vịnh của những hòn đảo đá",
        paragraphs: [
          "Vịnh Hạ Long rộng hơn một nghìn năm trăm ki-lô-mét vuông, với gần hai nghìn hòn đảo đá vôi mọc lên giữa mặt nước xanh biếc. Nhìn từ trên cao, các hòn đảo trông như một đàn rồng đá đang nằm nghỉ trên biển.",
          "Mỗi hòn đảo có một cái tên do người dân đặt theo hình dáng của nó: hòn Gà Chọi, hòn Đỉnh Hương, hòn Con Cóc. Em thử đoán xem hòn Gà Chọi trông giống con gì nhé!",
        ],
      },
      deep: {
        heading: "Bí mật trong lòng đảo đá",
        teaser: "Trong các hòn đảo có một thứ mà tàu thuyền đi bên ngoài không nhìn thấy được…",
        paragraphs: [
          "Bên trong những hòn đảo là cả một thế giới hang động. Hang Sửng Sốt rộng tới mười nghìn mét vuông, trần hang cao vút với hàng nghìn khối thạch nhũ rủ xuống như rèm đá. Mỗi xăng-ti-mét thạch nhũ ấy phải mất khoảng một trăm năm mới hình thành — nghĩa là có khối thạch nhũ đã lớn lên từ trước khi ông bà của ông bà em ra đời rất lâu.",
          "Người xưa kể rằng khi giặc tràn tới, Ngọc Hoàng sai đàn rồng bay xuống giúp dân. Rồng phun ra vô số viên ngọc, ngọc rơi xuống biển hoá thành các hòn đảo chắn đường thuyền giặc. Vì đàn rồng hạ xuống đây nên vịnh mang tên Hạ Long — 'rồng đáp xuống'.",
          "Ngày nay vẫn còn những làng chài nổi trên vịnh, nơi các bạn nhỏ chèo thuyền thúng đi học thay vì đi bộ tới trường.",
        ],
      },
    },
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
    discovery: {
      facts: [
        { icon: "🏮", label: "Tuổi phố cổ", value: "hơn 400 năm" },
        { icon: "📍", label: "Ở đâu", value: "Quảng Nam" },
        { icon: "🏆", label: "Danh hiệu", value: "Di sản UNESCO" },
      ],
      intro: {
        heading: "Phố cổ bên sông Hoài",
        paragraphs: [
          "Hội An là một khu phố nhỏ bên sông Hoài, với những ngôi nhà gỗ mái ngói rêu phong nằm sát nhau dọc các con đường hẹp. Ở đây không có nhà cao tầng, và nhiều đoạn phố chỉ dành cho người đi bộ và xe đạp.",
          "Mỗi tối, cả phố tắt bớt đèn điện và thắp đèn lồng. Đèn lồng đỏ, vàng, xanh treo kín các mái hiên, soi bóng xuống mặt sông lung linh.",
        ],
      },
      deep: {
        heading: "Ngôi phố của những người đi biển",
        teaser: "Vì sao một phố nhỏ ở Việt Nam lại có cả chùa Nhật và hội quán Hoa?",
        paragraphs: [
          "Bốn trăm năm trước, Hội An là một thương cảng sầm uất bậc nhất Đông Nam Á. Thuyền buôn từ Nhật Bản, Trung Hoa, Bồ Đào Nha, Hà Lan đều ghé vào đây đổi tơ lụa, gốm sứ và hương liệu. Các thương nhân ở lại nhiều tháng chờ gió mùa đổi chiều mới về được, nên họ dựng nhà, dựng chùa ngay tại phố.",
          "Chùa Cầu — cây cầu gỗ có mái che in trên tờ tiền hai mươi nghìn đồng — do các thương nhân Nhật Bản xây từ thế kỷ XVII để nối khu phố Nhật với khu phố Hoa. Hai đầu cầu có tượng chó và tượng khỉ canh giữ.",
          "Đến ngày rằm hằng tháng, người Hội An thả hoa đăng xuống sông Hoài. Mỗi chiếc đèn hoa mang theo một điều ước, trôi lấp lánh trên mặt nước tới tận cuối phố.",
        ],
      },
    },
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
    discovery: {
      facts: [
        { icon: "🏙️", label: "Landmark 81", value: "81 tầng" },
        { icon: "👨‍👩‍👧", label: "Dân số", value: "hơn 9 triệu" },
        { icon: "🌊", label: "Bên dòng", value: "sông Sài Gòn" },
      ],
      intro: {
        heading: "Thành phố không bao giờ ngủ",
        paragraphs: [
          "Thành phố Hồ Chí Minh là thành phố đông dân nhất nước ta, với hơn chín triệu người sinh sống. Đường phố lúc nào cũng tấp nập xe cộ, hàng quán mở tới khuya và đèn sáng suốt đêm.",
          "Giữa thành phố, bên sông Sài Gòn, toà nhà Landmark 81 vươn lên cao hơn bốn trăm sáu mươi mét — cao nhất Việt Nam. Đứng trên tầng quan sát, cả thành phố thu lại bé như một mô hình đồ chơi.",
        ],
      },
      deep: {
        heading: "Thành phố có một thành phố khác ở dưới lòng đất",
        teaser: "Cách trung tâm vài chục ki-lô-mét có một nơi người ta từng sống hoàn toàn dưới đất…",
        paragraphs: [
          "Ở huyện Củ Chi có hệ thống địa đạo dài tới hai trăm năm mươi ki-lô-mét, đào bằng tay trong lòng đất suốt nhiều năm. Dưới đó có phòng họp, bếp, giếng nước và cả bệnh xá. Khói bếp được dẫn đi thật xa rồi mới thoát lên, để trên mặt đất không ai đoán được bên dưới có người.",
          "Trên mặt đất, chợ Bến Thành với tháp đồng hồ quen thuộc đã đứng đó từ năm 1914 và tới nay vẫn là nơi mua bán nhộn nhịp nhất thành phố.",
          "Thành phố còn có tên gọi thân thương là Sài Gòn, và người ta hay bảo rằng đây là nơi 'đất lành chim đậu' — ai từ đâu tới cũng có thể sống được, làm được và tìm được món ăn quê mình.",
        ],
      },
    },
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
    discovery: {
      facts: [
        { icon: "⛰️", label: "Độ cao", value: "1.400 m" },
        { icon: "📏", label: "Chiều dài cầu", value: "150 m" },
        { icon: "🗓️", label: "Khánh thành", value: "năm 2018" },
      ],
      intro: {
        heading: "Cây cầu nằm trên mây",
        paragraphs: [
          "Cầu Vàng nằm trên núi Bà Nà, thành phố Đà Nẵng, ở độ cao khoảng một nghìn bốn trăm mét. Cây cầu dài một trăm năm mươi mét, uốn cong mềm mại và được hai bàn tay đá khổng lồ nâng lên giữa trời.",
          "Vì cầu ở rất cao nên mây thường trôi ngang qua ngay dưới chân. Người đi trên cầu có cảm giác như đang bước trong mây thật.",
        ],
      },
      deep: {
        heading: "Bàn tay đá mới… tám tuổi",
        teaser: "Đôi bàn tay trông cũ kỹ hàng trăm năm ấy thật ra được làm thế nào?",
        paragraphs: [
          "Hai bàn tay nâng cầu trông như đá cổ phủ rêu, nhưng thật ra chúng được dựng bằng khung thép và lưới, rồi phủ sợi thuỷ tinh bên ngoài. Các nghệ nhân đã vẽ và tạo vết nứt, vết rêu bằng tay để bàn tay trông như đã ở đó hàng trăm năm.",
          "Để lên tới cầu, em phải đi cáp treo vượt qua rừng già Bà Nà. Tuyến cáp treo ở đây từng giữ kỷ lục thế giới về độ chênh cao giữa ga đi và ga đến.",
          "Ngay năm đầu tiên mở cửa, ảnh Cầu Vàng đã xuất hiện trên báo chí khắp thế giới, và tạp chí Time xếp nơi đây vào danh sách những điểm đến tuyệt vời nhất hành tinh.",
        ],
      },
    },
  },
];
