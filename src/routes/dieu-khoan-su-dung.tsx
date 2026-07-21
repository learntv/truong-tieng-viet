import { createFileRoute, Link } from "@tanstack/react-router";
import { PageBanner } from "@/components/site/PageBanner";

const LAST_UPDATED = "21 tháng 7, 2026";
const CONTACT_EMAIL = "lienhe@truong-tieng-viet.example";

export const Route = createFileRoute("/dieu-khoan-su-dung")({
  head: () => ({
    meta: [
      { title: "Điều khoản sử dụng — Trường Tiếng Việt Của Em" },
      {
        name: "description",
        content:
          "Điều khoản sử dụng nền tảng học tiếng Việt Trường Tiếng Việt Của Em dành cho học sinh và phụ huynh.",
      },
      { property: "og:title", content: "Điều khoản sử dụng — Trường Tiếng Việt Của Em" },
      {
        property: "og:description",
        content:
          "Điều khoản sử dụng nền tảng học tiếng Việt Trường Tiếng Việt Của Em dành cho học sinh và phụ huynh.",
      },
    ],
  }),
  component: TermsOfServicePage,
});

function TermsOfServicePage() {
  return (
    <main className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <PageBanner
        title="Điều khoản sử dụng"
        subtitle={`Cập nhật lần cuối: ${LAST_UPDATED}`}
      />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="space-y-8 text-base leading-relaxed text-foreground">
          <Section title="1. Chấp nhận điều khoản">
            <p>
              Bằng việc truy cập và sử dụng nền tảng <strong>Trường Tiếng Việt Của Em</strong>, bạn
              đồng ý tuân thủ các điều khoản dưới đây. Nếu không đồng ý, vui lòng ngừng sử dụng nền
              tảng.
            </p>
          </Section>

          <Section title="2. Mục đích nền tảng">
            <p>
              Nền tảng cung cấp nội dung học tiếng Việt miễn phí, không mang tính thương mại, dành
              cho trẻ em Việt Nam tiểu học ở trong và ngoài nước.
            </p>
          </Section>

          <Section title="3. Tài khoản người dùng">
            <ul className="list-disc space-y-2 pl-6">
              <li>Người dùng chịu trách nhiệm bảo mật thông tin đăng nhập của tài khoản Google.</li>
              <li>
                Trẻ em nên sử dụng nền tảng dưới sự hướng dẫn của phụ huynh hoặc giáo viên.
              </li>
              <li>
                Bạn cam kết cung cấp thông tin hồ sơ (tên hiển thị, quốc gia) trung thực và phù hợp
                với môi trường học tập dành cho trẻ em.
              </li>
            </ul>
          </Section>

          <Section title="4. Quy tắc sử dụng">
            <p>Khi sử dụng nền tảng, bạn đồng ý không:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Đăng tải nội dung xúc phạm, bạo lực, phân biệt hoặc không phù hợp với trẻ em.</li>
              <li>Cố gắng can thiệp, phá hoại hoặc truy cập trái phép vào hệ thống.</li>
              <li>Sử dụng công cụ tự động để giả mạo tiến độ học tập hoặc bảng xếp hạng.</li>
              <li>Sao chép, phân phối lại nội dung bài học nhằm mục đích thương mại.</li>
            </ul>
          </Section>

          <Section title="5. Sở hữu trí tuệ">
            <p>
              Nội dung bài học, hình ảnh, âm thanh và giao diện thuộc quyền sở hữu của Trường Tiếng
              Việt Của Em và các đối tác cung cấp học liệu. Bạn được phép sử dụng cho mục đích học
              tập cá nhân, phi thương mại.
            </p>
          </Section>

          <Section title="6. Nội dung do người dùng tạo">
            <p>
              Tên hiển thị và biểu tượng đại diện bạn chọn có thể hiển thị công khai trên bảng xếp
              hạng. Chúng tôi có quyền ẩn hoặc chỉnh sửa nội dung không phù hợp với môi trường học
              tập dành cho trẻ em.
            </p>
          </Section>

          <Section title="7. Chấm dứt sử dụng">
            <p>
              Chúng tôi có thể tạm ngưng hoặc chấm dứt quyền truy cập của bất kỳ tài khoản nào vi
              phạm điều khoản này. Bạn có thể yêu cầu xóa tài khoản bất kỳ lúc nào bằng cách liên
              hệ với chúng tôi.
            </p>
          </Section>

          <Section title="8. Miễn trừ trách nhiệm">
            <p>
              Nền tảng được cung cấp “nguyên trạng”. Chúng tôi nỗ lực đảm bảo nội dung chính xác và
              hoạt động ổn định, nhưng không cam kết nền tảng luôn khả dụng hoặc không có lỗi.
            </p>
          </Section>

          <Section title="9. Thay đổi điều khoản">
            <p>
              Điều khoản có thể được cập nhật theo thời gian. Ngày cập nhật gần nhất được hiển thị
              ở đầu trang. Việc bạn tiếp tục sử dụng nền tảng sau khi cập nhật đồng nghĩa với việc
              chấp nhận các thay đổi.
            </p>
          </Section>

          <Section title="10. Liên hệ">
            <p>
              Mọi câu hỏi liên quan đến điều khoản sử dụng, vui lòng gửi email tới{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-semibold text-primary underline underline-offset-4"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </Section>

          <p className="pt-4 text-sm text-muted-foreground">
            Xem thêm:{" "}
            <Link
              to="/chinh-sach-bao-mat"
              className="font-semibold text-primary underline underline-offset-4"
            >
              Chính sách bảo mật
            </Link>
            .
          </p>
        </div>
      </article>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">{title}</h2>
      <div className="space-y-3 text-muted-foreground">{children}</div>
    </section>
  );
}
