import { ArrowRight, BookOpenText, Copyright, Mail, MessageCircle, Network } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { InfoHero } from "./InfoHero";
import { InfoCarousel } from "./InfoCarousel";
import { InfoStats } from "./InfoStats";
import hoaSen from "@/assets/symbols/hoa-sen.png";
import chimLac from "@/assets/symbols/chim-lac.png";
import { SectionHeader } from "@/components/ui/section-header";

/**
 * The content is not four equal facts: the Bộ Ngoại giao sponsorship is the
 * trust signal and leads on a full-width maroon card; the rest drop to a plain
 * bordered trio with red line-icons. No tints, no decorative symbol artwork.
 */
const LEAD = {
  heading: "Bảo trợ chuyên môn",
  body: (
    <>
      Dự án thực hiện dưới sự bảo trợ và ủng hộ của{" "}
      <strong className="font-bold text-gold">
        Ủy ban Nhà nước về người Việt Nam ở nước ngoài – Bộ Ngoại giao
      </strong>
      .
    </>
  ),
};

const ROWS = [
  {
    icon: BookOpenText,
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
  },
  {
    icon: Network,
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
  },
  {
    icon: Copyright,
    heading: "Bản quyền",
    body: (
      <>
        Dự án được bảo hộ bản quyền bởi đồng tác giả: Phan Thị Quỳnh Trang, Nguyễn Trần Thanh Hải,
        Đỗ Thị Phương Mai, Trần Thanh Phúc, Trần Văn Nhật.
      </>
    ),
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

        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl bg-maroon px-6 py-8 sm:px-10 sm:py-10">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(40rem 20rem at 88% -20%, color-mix(in oklab, var(--primary-glow) 45%, transparent) 0%, transparent 65%)",
              }}
            />
            <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:gap-8 sm:text-left">
              {/* The symbol PNGs carry a white matte fringe from how they were
                cut out. Rather than fight it, the badge gives the artwork a pale
                disc to sit on, so the fringe lands on near-white and disappears. */}
              <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-white/92 shadow-sm ring-1 ring-white/25 sm:h-28 sm:w-28">
                <img src={chimLac} alt="" className="h-16 w-16 object-contain sm:h-20 sm:w-20" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold tracking-[0.12em] text-gold uppercase">
                  {LEAD.heading}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-white/90 sm:text-lg">
                  {LEAD.body}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:mt-6 sm:grid-cols-3 sm:gap-6">
            {ROWS.map((r) => (
              <div
                key={r.heading}
                className="rounded-2xl border border-border bg-card px-6 py-6 shadow-card sm:px-7 sm:py-7"
              >
                <r.icon className="h-6 w-6 text-primary" strokeWidth={2} aria-hidden />
                <h3 className="mt-4 font-display text-lg font-extrabold text-navy">{r.heading}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="lo-trinh" className="w-full scroll-mt-24 bg-rose-tint px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeader align="center" title="Lộ trình học thú vị" className="mb-10 sm:mb-12" />
        <InfoStats />

        {/* Repeats the hero's primary CTA at the point where the reader has
          just seen what the course actually contains. */}
        <div className="mt-12 flex justify-center sm:mt-14">
          <Link
            to="/hoc-tap"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-card transition-colors hover:bg-primary/90 sm:text-base"
          >
            Học ngay
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
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

      {/* Đồng hành / Call to action — light band after the maroon thank-you. */}
      <div id="dong-hanh" className="w-full scroll-mt-24 bg-rose-tint px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h3 className="font-display text-2xl font-extrabold text-navy sm:text-3xl">
            Chung tay gieo hạt giống cội nguồn cho thế hệ mai sau
          </h3>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            Hành trình gìn giữ tiếng mẹ đẻ nơi xứ người là một sứ mệnh đầy tự hào nhưng cũng cần rất
            nhiều nguồn lực. Dự án phi lợi nhuận{" "}
            <strong className="font-bold text-primary">&quot;Trường Tiếng Việt Của Em&quot;</strong> luôn
            rộng mở đón nhận sự đồng hành, đóng góp và tài trợ từ các bậc phụ huynh, kiều bào và các
            mạnh thường quân để nuôi dưỡng ngọn lửa văn hóa Việt trong tâm hồn thế hệ trẻ. Mỗi sự đóng
            góp – dù là nhỏ nhất – đều là nguồn lực quý báu để dự án vươn xa hơn. Xin vui lòng liên hệ
            và đồng hành cùng chúng tôi qua:
          </p>

          <div className="mt-8 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
            <a
              href="mailto:contact@cvcec.org"
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-card px-6 py-4 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:justify-start"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                <Mail className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Email
                </span>
                <span className="block truncate font-display text-base font-bold text-navy">
                  contact@cvcec.org
                </span>
              </span>
            </a>

            <a
              href="https://wa.me/16478972358"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-card px-6 py-4 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:justify-start"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                <MessageCircle className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  WhatsApp
                </span>
                <span className="block truncate font-display text-base font-bold text-navy">
                  +1 647 897 2358
                </span>
              </span>
            </a>
          </div>

          <p className="mt-8 font-display text-base font-semibold text-primary">
            Xin chân thành cảm ơn!
          </p>
        </div>
      </div>
    </div>
  );
}
