import { createFileRoute } from "@tanstack/react-router";
import { PageBanner } from "@/components/site/PageBanner";

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

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8 flex gap-4">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary font-display font-semibold text-white">
        {n}
      </div>
      <div>
        <h2 className="mb-2 font-display text-lg font-bold text-foreground sm:text-xl">
          {title}
        </h2>
        <div className="flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {children}
        </div>
      </div>
    </section>
  );
}

function UserGuide() {
  return (
    <main>
      <PageBanner
        title="Hướng dẫn sử dụng"
        subtitle="Chỉ vài bước đơn giản để bé bắt đầu hành trình học tiếng Việt."
      />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Step n={1} title="Tạo tài khoản">
          <p>
            Nhấn nút <strong className="text-foreground">Đăng nhập</strong> ở góc trên bên phải,
            rồi đăng ký bằng email hoặc đăng nhập nhanh bằng tài khoản Google. Phụ huynh nên tạo
            tài khoản và đồng hành cùng con trong quá trình học.
          </p>
        </Step>

        <Step n={2} title="Học bảng chữ cái">
          <p>
            Vào mục{" "}
            <a
              href="/hoc-tap/bang-chu-cai"
              className="font-semibold text-primary underline underline-offset-2"
            >
              Bảng chữ cái
            </a>{" "}
            để làm quen với các chữ cái tiếng Việt qua hình ảnh và âm thanh. Nhấn vào mỗi chữ để
            nghe cách phát âm chuẩn.
          </p>
        </Step>

        <Step n={3} title="Làm bài học theo chủ đề">
          <p>
            Trong mục{" "}
            <a href="/hoc-tap" className="font-semibold text-primary underline underline-offset-2">
              Học tập
            </a>
            , các bài học được sắp xếp theo chủ đề và mức độ. Bé hoàn thành từng bài để mở khoá
            bài tiếp theo và nhận điểm.
          </p>
        </Step>

        <Step n={4} title="Luyện nói">
          <p>
            Tính năng{" "}
            <a
              href="/hoc-tap/luyen-noi"
              className="font-semibold text-primary underline underline-offset-2"
            >
              Luyện nói
            </a>{" "}
            dùng micro của thiết bị để bé tập phát âm và được chấm điểm ngay lập tức. Hãy cho phép
            trình duyệt sử dụng micro khi được hỏi. Giọng nói không được ghi âm hay lưu trữ.
          </p>
        </Step>

        <Step n={5} title="Theo dõi tiến trình">
          <p>
            Bé nhận được huy hiệu, tích luỹ điểm và leo lên{" "}
            <a
              href="/bang-xep-hang"
              className="font-semibold text-primary underline underline-offset-2"
            >
              bảng xếp hạng
            </a>
            . Vào trang cá nhân để xem lại thành tích và chuỗi ngày học của bé.
          </p>
        </Step>

        <div className="mt-10 rounded-2xl border border-border bg-muted/40 p-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Gặp khó khăn khi sử dụng? Xem{" "}
          <a
            href="/cau-hoi-thuong-gap"
            className="font-semibold text-primary underline underline-offset-2"
          >
            Câu hỏi thường gặp
          </a>{" "}
          hoặc{" "}
          <a href="/lien-he" className="font-semibold text-primary underline underline-offset-2">
            liên hệ với chúng tôi
          </a>
          .
        </div>
      </div>
    </main>
  );
}
