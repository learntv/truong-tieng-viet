import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircleQuestion, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/Mascot";

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
        <strong>không được ghi âm, lưu trữ hay gửi lên máy chủ</strong> của chúng tôi. Xem thêm tại{" "}
        <a href="/chinh-sach-bao-mat" className="link-inline">
          Chính sách bảo mật
        </a>
        .
      </>
    ),
  },
  {
    q: "Tôi có cần đăng nhập để học không?",
    a: "Bạn có thể xem một số nội dung mà không cần đăng nhập, nhưng cần tài khoản để lưu tiến trình học và tham gia bảng xếp hạng.",
  },
  {
    q: "Làm sao để xoá tài khoản và dữ liệu?",
    a: (
      <>
        Bạn có thể xoá tài khoản ngay trong phần cài đặt tài khoản, hoặc liên hệ chúng tôi qua{" "}
        <a href="mailto:contact@cvcec.org" className="link-inline">
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
        <a href="/lien-he" className="link-inline">
          Liên hệ
        </a>{" "}
        để gửi thắc mắc. Chúng tôi luôn sẵn lòng hỗ trợ bạn và bé.
      </>
    ),
  },
];

function FAQ() {
  return (
    <>
      <PageHeader
        icon={MessageCircleQuestion}
        hue="grape"
        title="Câu hỏi thường gặp"
        lede="Những thắc mắc phổ biến của phụ huynh và học sinh."
        width="content"
        aside={
          <Mascot
            pose="thinking"
            size="lg"
            decorative
            className="hidden h-40 animate-float md:block"
          />
        }
      />

      <Container width="content" className="pb-20">
        <div className="flex max-w-3xl flex-col gap-3">
          {FAQS.map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-3xl border border-ink-100 bg-white shadow-xs transition-[box-shadow,border-color] duration-200 open:border-grape-100 open:shadow-md hover:border-ink-200 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-3xl p-5 text-[1.0625rem] font-bold text-ink-900 sm:p-6">
                {q}
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-grape-50 text-grape-700 transition-transform duration-300 ease-out group-open:rotate-45">
                  <Plus className="size-5" strokeWidth={2.5} aria-hidden />
                </span>
              </summary>
              <div className="px-5 pb-6 text-[1.0625rem] leading-relaxed text-ink-700 sm:px-6 [&_strong]:font-semibold [&_strong]:text-ink-900">
                {a}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 flex max-w-3xl flex-col items-start gap-5 rounded-3xl bg-grape-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="text-h3 text-ink-900">Vẫn còn thắc mắc?</h2>
            <p className="mt-1 text-ink-600">Chúng tôi luôn sẵn lòng hỗ trợ bạn và bé.</p>
          </div>
          <Button asChild>
            <Link to="/lien-he">Liên hệ với chúng tôi</Link>
          </Button>
        </div>
      </Container>
    </>
  );
}
