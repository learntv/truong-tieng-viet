import { Info } from "lucide-react";
import { InfoHero } from "./InfoHero";
import { InfoStats } from "./InfoStats";
import aoDai from "@/assets/symbols/ao-dai.png";
import nonLa from "@/assets/symbols/non-la.png";
import tre from "@/assets/symbols/tre.png";
import pho from "@/assets/symbols/pho.png";
import hoaSen from "@/assets/symbols/hoa-sen.png";

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
    headingColor: "text-sky-600",
  },
  {
    heading: "Dự án số hóa",
    body: (
      <>
        Dự án số hóa hai cuốn sách của{" "}
        <strong className="font-bold text-foreground">NXB ĐH Sư Phạm TP Hồ Chí Minh</strong>, được thực
        hiện trong khuôn khổ Chương trình Tôn vinh tiếng Việt trong cộng đồng người Việt Nam ở nước
        ngoài, do <strong className="font-bold text-foreground">UBNVONN – Bộ Ngoại giao</strong> phát
        động.
      </>
    ),
    image: nonLa,
    headingColor: "text-amber-700",
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
    headingColor: "text-green-600",
  },
  {
    heading: "Bản quyền",
    body: (
      <>
        Dự án được bảo hộ bản quyền bởi đồng tác giả:
        <br />
        <strong className="font-bold text-foreground">
          Phan Thị Quỳnh Trang - Nguyễn Trần Thanh Hải - Đỗ Thị Phương Mai - Trần Thanh Phúc - Trần Văn
          Nhật
        </strong>
        .
      </>
    ),
    image: pho,
    headingColor: "text-orange-600",
  },
];

export function InfoTab() {
  return (
    <section className="w-full pb-10">
      <InfoHero />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-8 flex flex-col items-center text-center sm:mb-12">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-400 text-white shadow-lg">
              <Info className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <h2 className="font-display text-3xl font-extrabold text-red-700 sm:text-5xl">
              Giới thiệu
            </h2>
          </div>
          <p className="mx-auto mt-3 max-w-2xl text-base text-foreground/70">
            Đôi nét về sứ mệnh, đối tác và bản quyền của Trường Tiếng Việt Của Em.
          </p>
        </header>

        <div id="info-rows-start" className="mx-auto flex max-w-4xl flex-col gap-24 sm:gap-32">
          {ROWS.map((r, i) => (
            <div
              key={r.heading}
              className={`flex flex-col items-center gap-8 text-center sm:gap-14 sm:text-left ${
                i % 2 === 1 ? "sm:flex-row-reverse" : "sm:flex-row"
              }`}
            >
              <div className="shrink-0">
                <img src={r.image} alt="" className="h-32 w-32 object-contain sm:h-40 sm:w-40" />
              </div>
              <div>
                <h3 className={`font-display text-3xl font-extrabold sm:text-4xl ${r.headingColor}`}>
                  {r.heading}
                </h3>
                <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-foreground/70 sm:mx-0">
                  {r.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-24 sm:mt-28">
          <div className="flex justify-center">
            <img
              src={hoaSen}
              alt=""
              className="relative z-10 -mb-12 h-28 w-28 object-contain sm:-mb-16 sm:h-36 sm:w-36"
            />
          </div>
          <article className="rounded-3xl bg-pink-100 px-8 pb-8 pt-16 sm:px-14 sm:pb-10 sm:pt-20">
            <div className="flex items-center justify-center">
              <h3
                className="font-display text-2xl font-extrabold text-red-600 sm:text-3xl"
                style={{ WebkitTextStroke: "1.5px white", paintOrder: "stroke fill" }}
              >
                Lời cảm ơn
              </h3>
            </div>
            <p className="mt-4 text-center text-[15px] leading-relaxed text-black/80 sm:text-base">
              Ban quản lý dự án xin được gửi lời cảm ơn chân thành tới{" "}
              <strong className="font-bold text-black">
                Ủy ban Nhà nước về người Việt Nam ở nước ngoài - Bộ Ngoại giao
              </strong>{" "}
              nước Cộng hòa xã hội chủ nghĩa Việt Nam đã luôn đồng hành
              và định hướng. Chúng tôi xin gửi lời tri ân sâu sắc tới các Đại sứ
              quán, các cơ quan ban ngành tại Việt Nam và Canada, cùng Mạng lưới
              giảng dạy tiếng Việt đã tạo điều kiện và hỗ trợ quý báu để dự án{" "}
              <strong className="font-bold text-black">&quot;Trường Tiếng Việt Của Em&quot;</strong>{" "}
              được hoàn thiện và đi vào vận hành. Sự
              đồng hành của quý vị là nguồn động lực to lớn giúp chúng tôi gìn giữ
              và lan tỏa ngôn ngữ, văn hóa Việt đến với thế hệ trẻ tại Canada nói
              riêng và trên toàn thế giới nói chung.
            </p>
          </article>
        </div>

        <div className="mt-16 sm:mt-20">
          <InfoStats />
        </div>
      </div>
    </section>
  );
}
