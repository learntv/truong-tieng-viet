import { createFileRoute } from "@tanstack/react-router";
import { Compass, LifeBuoy } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/layout/Container";
import { Mascot } from "@/components/Mascot";

export const Route = createFileRoute("/huong-dan-su-dung")({
  head: () => ({
    meta: [
      { title: "Hướng dẫn sử dụng — Trường Tiếng Việt Của Em" },
      {
        name: "description",
        content:
          "Hướng dẫn sử dụng Trường Tiếng Việt Của Em: cách tạo tài khoản, học bảng chữ cái, làm bài học, luyện nói và theo dõi tiến trình.",
      },
      { property: "og:title", content: "Hướng dẫn sử dụng — Trường Tiếng Việt Của Em" },
      {
        property: "og:description",
        content: "Cách bắt đầu học tiếng Việt cùng con trên Trường Tiếng Việt Của Em.",
      },
      { property: "og:url", content: "/huong-dan-su-dung" },
    ],
    links: [{ rel: "canonical", href: "/huong-dan-su-dung" }],
  }),
  component: UserGuide,
});

const STEP_HUES = ["bg-brand-600", "bg-grape-600", "bg-coral-600", "bg-rose-600", "bg-leaf-600"];

/** One step on the guide's path: a numbered node on a rail, then its copy. */
function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="group relative flex gap-5 pb-10 last:pb-0 sm:gap-7">
      <span
        aria-hidden
        className="absolute top-12 bottom-0 left-[1.35rem] w-0.5 bg-ink-100 group-last:hidden"
      />
      <span
        className={`relative z-10 grid size-11 shrink-0 place-items-center rounded-full text-lg font-extrabold text-white shadow-sm ${STEP_HUES[(n - 1) % STEP_HUES.length]}`}
      >
        {n}
      </span>
      <div className="pt-1.5">
        <h2 className="text-h3 text-ink-900">{title}</h2>
        <div className="mt-2 flex flex-col gap-2 text-[1.0625rem] leading-relaxed text-ink-700 [&_strong]:font-semibold [&_strong]:text-ink-900">
          {children}
        </div>
      </div>
    </li>
  );
}

function UserGuide() {
  return (
    <>
      <PageHeader
        icon={Compass}
        hue="coral"
        title="Hướng dẫn sử dụng"
        lede="Chỉ vài bước đơn giản để bé bắt đầu hành trình học tiếng Việt."
        width="content"
        aside={
          <Mascot
            pose="pointing"
            size="lg"
            decorative
            className="hidden h-40 animate-float md:block"
          />
        }
      />

      <Container width="content" className="pb-20">
        <ol className="max-w-2xl">
          <Step n={1} title="Tạo tài khoản">
            <p>
              Nhấn nút <strong>Đăng nhập</strong> ở góc trên bên phải, rồi đăng ký bằng email hoặc
              đăng nhập nhanh bằng tài khoản Google. Phụ huynh nên tạo tài khoản và đồng hành cùng
              con trong quá trình học.
            </p>
          </Step>

          <Step n={2} title="Học bảng chữ cái">
            <p>
              Vào mục{" "}
              <a href="/hoc-tap/bang-chu-cai" className="link-inline">
                Bảng chữ cái
              </a>{" "}
              để làm quen với các chữ cái tiếng Việt qua hình ảnh và âm thanh. Nhấn vào mỗi chữ để
              nghe cách phát âm chuẩn.
            </p>
          </Step>

          <Step n={3} title="Làm bài học theo chủ đề">
            <p>
              Trong mục{" "}
              <a href="/hoc-tap" className="link-inline">
                Học tập
              </a>
              , các bài học được sắp xếp theo chủ đề và mức độ. Bé hoàn thành từng bài để mở khoá
              bài tiếp theo và nhận điểm.
            </p>
          </Step>

          <Step n={4} title="Luyện nói">
            <p>
              Tính năng{" "}
              <a href="/hoc-tap/luyen-noi" className="link-inline">
                Luyện nói
              </a>{" "}
              dùng micro của thiết bị để bé tập phát âm và được chấm điểm ngay lập tức. Hãy cho phép
              trình duyệt sử dụng micro khi được hỏi. Giọng nói không được ghi âm hay lưu trữ.
            </p>
          </Step>

          <Step n={5} title="Theo dõi tiến trình">
            <p>
              Bé tích luỹ điểm và leo lên{" "}
              <a href="/bang-xep-hang" className="link-inline">
                bảng xếp hạng
              </a>
              . Vào trang cá nhân để xem lại thành tích và chuỗi ngày học của bé.
            </p>
          </Step>
        </ol>

        <div className="mt-14 flex max-w-2xl flex-col gap-4 rounded-3xl bg-coral-50 p-6 text-[1.0625rem] leading-relaxed text-ink-700 sm:flex-row sm:items-center sm:p-8">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-coral-600 shadow-xs">
            <LifeBuoy className="size-6" aria-hidden />
          </span>
          <p>
            Gặp khó khăn khi sử dụng? Xem{" "}
            <a href="/cau-hoi-thuong-gap" className="link-inline">
              Câu hỏi thường gặp
            </a>{" "}
            hoặc{" "}
            <a href="/lien-he" className="link-inline">
              liên hệ với chúng tôi
            </a>
            .
          </p>
        </div>
      </Container>
    </>
  );
}
