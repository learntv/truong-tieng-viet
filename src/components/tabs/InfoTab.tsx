import { Info } from "lucide-react";
import { InfoHero } from "./InfoHero";
import { InfoCarousel } from "./InfoCarousel";
import { InfoStats } from "./InfoStats";
import aoDai from "@/assets/symbols/ao-dai.png";
import nonLa from "@/assets/symbols/non-la.png";
import tre from "@/assets/symbols/tre.png";
import pho from "@/assets/symbols/pho.png";
import hoaSen from "@/assets/symbols/hoa-sen.png";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

/**
 * Each card is washed with the dominant hue of its own symbol — áo dài blue,
 * nón lá orange, tre green, phở amber — sampled from the artwork rather than
 * picked by eye. Kept at very low chroma so the row still reads as one set and
 * the red theme stays dominant.
 */
const TINTS = {
  blue: "bg-[oklch(0.975_0.018_240)]",
  orange: "bg-[oklch(0.975_0.020_55)]",
  green: "bg-[oklch(0.975_0.020_140)]",
  amber: "bg-[oklch(0.975_0.022_85)]",
} as const;

const ROWS = [
  {
    tint: TINTS.blue,
    heading: "Bảo trợ chuyên môn",
    body: (
      <>
        Dự án thực hiện dưới sự bảo trợ và ủng hộ của{" "}
        <strong className="font-bold text-foreground">
          Ủy ban Nhà nước về người Việt Nam ở nước ngoài – Bộ Ngoại giao
        </strong>
        .
      </>
    ),
    image: aoDai,
  },
  {
    tint: TINTS.orange,
    heading: "Dự án số hóa",
    body: (
      <>
        Dự án số hóa hai cuốn sách của{" "}
        <strong className="font-bold text-foreground">NXB ĐH Sư Phạm TP Hồ Chí Minh</strong>, được
        thực hiện trong khuôn khổ Chương trình Tôn vinh tiếng Việt trong cộng đồng người Việt Nam ở
        nước ngoài, do{" "}
        <strong className="font-bold text-foreground">UBNVONN – Bộ Ngoại giao</strong> phát động.
      </>
    ),
    image: nonLa,
  },
  {
    tint: TINTS.green,
    heading: "Hệ sinh thái",
    body: (
      <>
        Dự án là thành viên tích cực nằm trong{" "}
        <strong className="font-bold text-foreground">
          Mạng lưới các cơ sở giảng dạy tiếng Việt và văn hóa Việt Nam ở nước ngoài
        </strong>
        .
      </>
    ),
    image: tre,
  },
  {
    tint: TINTS.amber,
    heading: "Bản quyền",
    body: (
      <>
        Dự án được bảo hộ bản quyền bởi đồng tác giả:
        <br />
        <strong className="font-bold text-foreground">
          Phan Thị Quỳnh Trang - Nguyễn Trần Thanh Hải - Đỗ Thị Phương Mai - Trần Thanh Phúc - Trần
          Văn Nhật
        </strong>
        .
      </>
    ),
    image: pho,
  },
];

export function InfoTab() {
  return (
    <div className="w-full">
      <InfoHero />
      <InfoCarousel />

      <div id="gioi-thieu" className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-8 pb-16 sm:px-6 sm:pt-12 sm:pb-24">
        <SectionHeader
          align="center"
          eyebrow="Về dự án"
          title="Giới thiệu"
          subtitle="Đôi nét về sứ mệnh, đối tác và bản quyền của Trường Tiếng Việt Của Em."
          className="mx-auto mb-10 sm:mb-14"
        />

        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 sm:gap-6">
          {ROWS.map((r) => (
            <Card
              key={r.heading}
              interactive
              className={`flex items-start gap-4 p-5 text-left sm:gap-5 sm:p-6 ${r.tint}`}
            >
              <img
                src={r.image}
                alt=""
                className="h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20"
              />
              <div className="min-w-0">
                <h3 className="font-display text-lg font-extrabold text-navy sm:text-xl">
                  {r.heading}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="w-full bg-rose-tint px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeader align="center" title="Lộ trình học thú vị" className="mb-10 sm:mb-12" />
        <InfoStats />
      </div>

      {/* Lời cảm ơn — full-bleed deep red band with two soft squircle shapes
        bleeding off opposite corners, per the TTVCE-UI red theme. */}
      <div className="relative overflow-hidden bg-maroon px-4 py-16 sm:px-6 sm:py-24">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(60rem 28rem at 82% -10%, color-mix(in oklab, var(--primary-glow) 50%, transparent) 0%, transparent 65%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(44rem 24rem at 10% 115%, color-mix(in oklab, var(--gold) 24%, transparent) 0%, transparent 60%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <img
            src={hoaSen}
            alt=""
            className="mx-auto mb-5 h-20 w-20 object-contain sm:h-24 sm:w-24"
          />
          <h3 className="inline-flex items-center gap-2 font-display text-2xl font-extrabold text-white sm:text-3xl">
            <Info className="h-6 w-6 text-gold sm:h-7 sm:w-7" strokeWidth={2.5} />
            Lời cảm ơn
          </h3>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-white/90 sm:text-base">
            Ban quản lý dự án xin được gửi lời cảm ơn chân thành tới{" "}
            <strong className="font-bold text-gold">
              Ủy ban Nhà nước về người Việt Nam ở nước ngoài - Bộ Ngoại giao
            </strong>{" "}
            nước Cộng hòa xã hội chủ nghĩa Việt Nam đã luôn đồng hành và định hướng. Chúng tôi xin
            gửi lời tri ân sâu sắc tới các Đại sứ quán, các cơ quan ban ngành tại Việt Nam và
            Canada, cùng Mạng lưới giảng dạy tiếng Việt đã tạo điều kiện và hỗ trợ quý báu để dự án{" "}
            <strong className="font-bold text-gold">&quot;Trường Tiếng Việt Của Em&quot;</strong>{" "}
            được hoàn thiện và đi vào vận hành. Sự đồng hành của quý vị là nguồn động lực to lớn
            giúp chúng tôi gìn giữ và lan tỏa ngôn ngữ, văn hóa Việt đến với thế hệ trẻ tại Canada
            nói riêng và trên toàn thế giới nói chung.
          </p>
          <p className="mt-6 text-sm font-semibold text-gold-soft">— Ban quản lý dự án</p>
        </div>
      </div>
    </div>
  );
}
