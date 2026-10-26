import type { LocaleText } from "@/data/overworld";

// Short, kid-friendly history blurb for each place, shown under the chủ đề title. Falls back to
// the Hạ Long entry, so every chủ đề always has something to show.
export type LocationInfo = { name: string; blurb: LocaleText };

export const CHU_DE_LOCATIONS: Record<number, LocationInfo> = {
  0: {
    name: "Vịnh Hạ Long",
    blurb: {
      vi: "Vịnh Hạ Long nằm ở tỉnh Quảng Ninh, với hàng ngàn hòn đảo đá vôi nhô lên giữa làn nước xanh biếc. Vịnh được UNESCO công nhận là Di sản Thiên nhiên Thế giới nhờ vẻ đẹp kỳ vĩ và những hang động tuyệt đẹp đã hình thành qua hàng triệu năm.",
      en: "Vịnh Hạ Long is in Quảng Ninh province, with thousands of limestone islands rising out of the blue-green sea. UNESCO named the bay a World Natural Heritage Site for its amazing beauty and the stunning caves that formed over millions of years.",
    },
  },
  1: {
    name: "Cầu Vàng",
    blurb: {
      vi: "Cầu Vàng tọa lạc trên đỉnh núi Bà Nà, thành phố Đà Nẵng. Cây cầu nổi bật với đôi bàn tay đá khổng lồ nâng đỡ nhịp cầu, tượng trưng cho bàn tay của các vị thần. Cầu Vàng khánh thành năm 2018 và nhanh chóng trở thành biểu tượng du lịch nổi tiếng của Việt Nam.",
      en: "Cầu Vàng sits on top of Bà Nà mountain in Đà Nẵng. The bridge stands out for the two giant stone hands holding it up, like the hands of the gods. It opened in 2018 and quickly became one of Vietnam's most famous sights.",
    },
  },
};

export function locationForChuDe(chuDeIndex: number): LocationInfo {
  return CHU_DE_LOCATIONS[chuDeIndex] ?? CHU_DE_LOCATIONS[0];
}
