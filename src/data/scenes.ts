// Short, kid-friendly history blurb for each place, shown under the chủ đề title. Falls back to
// the Hạ Long entry, so every chủ đề always has something to show.
export type LocationInfo = { name: string; blurb: string };

export const CHU_DE_LOCATIONS: Record<number, LocationInfo> = {
  0: {
    name: "Vịnh Hạ Long",
    blurb:
      "Vịnh Hạ Long nằm ở tỉnh Quảng Ninh, với hàng ngàn hòn đảo đá vôi nhô lên giữa làn nước xanh biếc. Vịnh được UNESCO công nhận là Di sản Thiên nhiên Thế giới nhờ vẻ đẹp kỳ vĩ và những hang động tuyệt đẹp đã hình thành qua hàng triệu năm.",
  },
  1: {
    name: "Cầu Vàng",
    blurb:
      "Cầu Vàng tọa lạc trên đỉnh núi Bà Nà, thành phố Đà Nẵng. Cây cầu nổi bật với đôi bàn tay đá khổng lồ nâng đỡ nhịp cầu, tượng trưng cho bàn tay của các vị thần. Cầu Vàng khánh thành năm 2018 và nhanh chóng trở thành biểu tượng du lịch nổi tiếng của Việt Nam.",
  },
};

export function locationForChuDe(chuDeIndex: number): LocationInfo {
  return CHU_DE_LOCATIONS[chuDeIndex] ?? CHU_DE_LOCATIONS[0];
}
