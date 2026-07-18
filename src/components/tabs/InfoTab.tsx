import { Info } from "lucide-react";
import { InfoHero } from "./InfoHero";
import { InfoStats } from "./InfoStats";
import aoDai from "@/assets/symbols/ao-dai.png";
import nonLa from "@/assets/symbols/non-la.png";
import tre from "@/assets/symbols/tre.png";
import pho from "@/assets/symbols/pho.png";
import hoaSen from "@/assets/symbols/hoa-sen.png";
import tilePattern from "@/assets/symbols/tile-pattern.svg";
import { HandNote, PostageStamp } from "@/components/decor";

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
        <strong className="font-bold text-foreground">NXB ĐH Sư Phạm TP Hồ Chí Minh</strong>, được
        thực hiện trong khuôn khổ Chương trình Tôn vinh tiếng Việt trong cộng đồng người Việt Nam ở
        nước ngoài, do{" "}
        <strong className="font-bold text-foreground">UBNVONN – Bộ Ngoại giao</strong> phát động.
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
          Phan Thị Quỳnh Trang - Nguyễn Trần Thanh Hải - Đỗ Thị Phương Mai - Trần Thanh Phúc - Trần
          Văn Nhật
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
        <header
          id="gioi-thieu"
          className="mb-8 flex flex-col items-center text-center sm:mb-12 scroll-mt-24"
        >
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

        <div id="info-rows-start" className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 sm:gap-6">
          {ROWS.map((r) => (
            <article
              key={r.heading}
              className="group flex items-start gap-4 rounded-3xl border border-border bg-card p-5 text-left shadow-card ring-[3px] ring-card transition-all ease-bounce hover:-translate-y-1 hover:shadow-soft sm:gap-5 sm:p-6"
            >
              <div className="shrink-0">
                <div className="grid h-24 w-24 place-items-center rounded-full border-2 border-dashed border-primary/30 bg-cream p-2 transition-transform group-hover:scale-105 sm:h-28 sm:w-28">
                  <img src={r.image} alt="" className="h-16 w-16 object-contain sm:h-20 sm:w-20" />
                </div>
              </div>
              <div className="min-w-0">
                <h3 className={`font-display text-xl font-extrabold sm:text-2xl ${r.headingColor}`}>
                  {r.heading}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/70">{r.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div
        className="w-full bg-navy px-4 py-14 sm:px-6 sm:py-20"
        style={{ backgroundImage: `url(${tilePattern})`, backgroundRepeat: "repeat" }}
      >
        <h3 className="text-center font-display text-2xl font-extrabold text-white opacity-90 sm:text-4xl">
          Lộ trình học thú vị
        </h3>
        <div className="mt-10 sm:mt-12">
          <InfoStats />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-10 pt-16 sm:px-6 sm:pb-14 sm:pt-20">
        {/* Thank-you letter tucked into an airmail envelope */}
        <article className="relative overflow-hidden rounded-xl border border-primary/15 bg-gradient-thanks shadow-card">
          {/* Airmail edges */}
          <div className="airmail-stripe h-2 w-full" aria-hidden />

          {/* Envelope flap — triangular fold pointing down to the seal */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-2 z-0 h-24 sm:h-28"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.94 0.05 18) 0%, oklch(0.965 0.03 22) 100%)",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              filter: "drop-shadow(0 4px 5px oklch(0.3 0.035 265 / 0.14))",
            }}
          />

          {/* Postage stamp */}
          <PostageStamp
            round
            className="absolute right-4 top-6 z-20 h-16 w-16 rotate-6 bg-card/90 text-primary shadow-card sm:right-6"
          >
            <span className="font-type text-[8px] font-bold uppercase leading-tight tracking-wide text-primary/80">
              Cảm
              <br />
              ơn
              <br />♥
            </span>
          </PostageStamp>

          {/* Letter body */}
          <div className="relative z-10 px-6 pb-10 pt-[104px] text-center sm:px-16 sm:pb-12 sm:pt-32">
            {/* Lotus wax seal at the flap tip */}
            <img
              src={hoaSen}
              alt=""
              className="absolute left-1/2 top-14 z-20 h-16 w-16 -translate-x-1/2 object-contain drop-shadow sm:top-16 sm:h-20 sm:w-20"
            />

            <HandNote className="text-2xl text-primary/80 sm:text-3xl">Thân gửi các em ♥</HandNote>
            <h3
              className="font-display text-2xl font-extrabold text-primary sm:text-3xl"
              style={{ WebkitTextStroke: "1.5px white", paintOrder: "stroke fill" }}
            >
              Lời cảm ơn
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-foreground/80 sm:text-base">
              Ban quản lý dự án xin được gửi lời cảm ơn chân thành tới{" "}
              <strong className="font-bold text-foreground">
                Ủy ban Nhà nước về người Việt Nam ở nước ngoài - Bộ Ngoại giao
              </strong>{" "}
              nước Cộng hòa xã hội chủ nghĩa Việt Nam đã luôn đồng hành và định hướng. Chúng tôi xin
              gửi lời tri ân sâu sắc tới các Đại sứ quán, các cơ quan ban ngành tại Việt Nam và
              Canada, cùng Mạng lưới giảng dạy tiếng Việt đã tạo điều kiện và hỗ trợ quý báu để dự
              án{" "}
              <strong className="font-bold text-foreground">
                &quot;Trường Tiếng Việt Của Em&quot;
              </strong>{" "}
              được hoàn thiện và đi vào vận hành. Sự đồng hành của quý vị là nguồn động lực to lớn
              giúp chúng tôi gìn giữ và lan tỏa ngôn ngữ, văn hóa Việt đến với thế hệ trẻ tại Canada
              nói riêng và trên toàn thế giới nói chung.
            </p>

            <HandNote className="mt-5 block text-xl text-primary/70 sm:text-2xl">
              — Ban quản lý dự án
            </HandNote>
          </div>

          <div className="airmail-stripe h-2 w-full" aria-hidden />
        </article>
      </div>
    </section>
  );
}
