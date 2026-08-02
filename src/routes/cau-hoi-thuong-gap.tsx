import { createFileRoute } from "@tanstack/react-router";
import { PageBanner } from "@/components/site/PageBanner";

export const Route = createFileRoute("/cau-hoi-thuong-gap")({
  head: () => ({
    meta: [
      { title: "Câu hỏi thường gặp — Trường Tiếng Việt Của Em" },
      {
        name: "description",
        content:
          "Câu hỏi thường gặp về Trường Tiếng Việt Của Em: chi phí, độ tuổi phù hợp, luyện nói, quyền riêng tư của trẻ và cách được hỗ trợ.",
      },
      { property: "og:title", content: "Câu hỏi thường gặp — Trường Tiếng Việt Của Em" },
      {
        property: "og:description",
        content: "Giải đáp những thắc mắc thường gặp của phụ huynh và học sinh.",
      },
      { property: "og:url", content: "/cau-hoi-thuong-gap" },
    ],
    links: [{ rel: "canonical", href: "/cau-hoi-thuong-gap" }],
  }),
  component: FAQ,
});

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "Trường Tiếng Việt Của Em có mất phí không?",
    a: "Nền tảng được xây dựng phi lợi nhuận nhằm gìn giữ tiếng Việt cho trẻ em. Bạn có thể tạo tài khoản và học miễn phí.",
  },
  {
    q: "Nền tảng phù hợp với độ tuổi nào?",
    a: "Chúng tôi thiết kế dành cho trẻ em, nhưng mọi lứa tuổi mới bắt đầu học tiếng Việt đều có thể sử dụng.",
  },
  {
    q: "Con tôi cần chuẩn bị gì để học?",
    a: "Chỉ cần một thiết bị có trình duyệt web và kết nối Internet. Với phần luyện nói, thiết bị cần có micro và bạn cho phép trình duyệt sử dụng micro khi được hỏi.",
  },
  {
    q: "Tính năng luyện nói có ghi âm giọng của con tôi không?",
    a: (
      <>
        Không. Giọng nói được xử lý ngay trên trình duyệt để chấm điểm phát âm và{" "}
        <strong className="text-foreground">không được ghi âm, lưu trữ hay gửi lên máy chủ</strong>{" "}
        của chúng tôi. Xem thêm tại{" "}
        <a
          href="/chinh-sach-bao-mat"
          className="font-semibold text-primary underline underline-offset-2"
        >
          Chính sách bảo mật
        </a>
        .
      </>
    ),
  },
  {
    q: "Tôi có cần đăng nhập để học không?",
    a: "Bạn có thể xem một số nội dung mà không cần đăng nhập, nhưng cần tài khoản để lưu tiến trình học, nhận huy hiệu và tham gia bảng xếp hạng.",
  },
  {
    q: "Làm sao để xoá tài khoản và dữ liệu?",
    a: (
      <>
        Bạn có thể xoá tài khoản ngay trong phần cài đặt tài khoản, hoặc liên hệ chúng tôi qua{" "}
        <a
          href="mailto:contact@cvcec.org"
          className="font-semibold text-primary underline underline-offset-2"
        >
          contact@cvcec.org
        </a>
        .
      </>
    ),
  },
  {
    q: "Tôi gặp lỗi hoặc cần hỗ trợ thì làm thế nào?",
    a: (
      <>
        Hãy ghé trang{" "}
        <a href="/lien-he" className="font-semibold text-primary underline underline-offset-2">
          Liên hệ
        </a>{" "}
        để gửi thắc mắc. Chúng tôi luôn sẵn lòng hỗ trợ bạn và bé.
      </>
    ),
  },
];

function FAQ() {
  return (
    <main>
      <PageBanner
        title="Câu hỏi thường gặp"
        subtitle="Những thắc mắc phổ biến của phụ huynh và học sinh."
      />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-4">
          {FAQS.map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-2xl border border-border bg-card p-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-bold text-foreground sm:text-lg">
                {q}
                <span className="shrink-0 text-primary transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </main>
  );
}
