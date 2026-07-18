import { Info } from "lucide-react";
import { InfoHero } from "./InfoHero";
import { InfoStats } from "./InfoStats";
import aoDai from "@/assets/symbols/ao-dai.png";
import nonLa from "@/assets/symbols/non-la.png";
import tre from "@/assets/symbols/tre.png";
import pho from "@/assets/symbols/pho.png";
import hoaSen from "@/assets/symbols/hoa-sen.png";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

const ROWS = [
  {
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

      <div id="gioi-thieu" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24">
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
              className="flex items-start gap-4 p-5 text-left sm:gap-5 sm:p-6"
            >
              <div className="shrink-0">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-primary/10 p-2 sm:h-24 sm:w-24">
                  <img src={r.image} alt="" className="h-14 w-14 object-contain sm:h-16 sm:w-16" />
                </div>
              </div>
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

      <div className="w-full bg-navy px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeader align="center" title="Lộ trình học thú vị" light className="mb-10 sm:mb-12" />
        <InfoStats />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <Card className="relative overflow-hidden px-6 py-10 text-center sm:px-16 sm:py-14">
          <img
            src={hoaSen}
            alt=""
            className="mx-auto mb-4 h-14 w-14 object-contain"
          />
          <h3 className="inline-flex items-center gap-2 font-display text-2xl font-extrabold text-navy sm:text-3xl">
            <Info className="h-6 w-6 text-primary sm:h-7 sm:w-7" strokeWidth={2.5} />
            Lời cảm ơn
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            Ban quản lý dự án xin được gửi lời cảm ơn chân thành tới{" "}
            <strong className="font-bold text-foreground">
              Ủy ban Nhà nước về người Việt Nam ở nước ngoài - Bộ Ngoại giao
            </strong>{" "}
            nước Cộng hòa xã hội chủ nghĩa Việt Nam đã luôn đồng hành và định hướng. Chúng tôi xin
            gửi lời tri ân sâu sắc tới các Đại sứ quán, các cơ quan ban ngành tại Việt Nam và
            Canada, cùng Mạng lưới giảng dạy tiếng Việt đã tạo điều kiện và hỗ trợ quý báu để dự án{" "}
            <strong className="font-bold text-foreground">
              &quot;Trường Tiếng Việt Của Em&quot;
            </strong>{" "}
            được hoàn thiện và đi vào vận hành. Sự đồng hành của quý vị là nguồn động lực to lớn
            giúp chúng tôi gìn giữ và lan tỏa ngôn ngữ, văn hóa Việt đến với thế hệ trẻ tại Canada
            nói riêng và trên toàn thế giới nói chung.
          </p>
          <p className="mt-5 text-sm font-semibold text-muted-foreground">— Ban quản lý dự án</p>
        </Card>
      </div>
    </div>
  );
}
