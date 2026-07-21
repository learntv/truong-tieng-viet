import { createFileRoute, Link } from "@tanstack/react-router";
import { PageBanner } from "@/components/site/PageBanner";

const LAST_UPDATED = "21 tháng 7, 2026";
const CONTACT_EMAIL = "lienhe@truong-tieng-viet.example";

export const Route = createFileRoute("/chinh-sach-bao-mat")({
  head: () => ({
    meta: [
      { title: "Chính sách bảo mật — Trường Tiếng Việt Của Em" },
      {
        name: "description",
        content:
          "Chính sách bảo mật của Trường Tiếng Việt Của Em: dữ liệu chúng tôi thu thập, cách sử dụng và quyền của người dùng.",
      },
      { property: "og:title", content: "Chính sách bảo mật — Trường Tiếng Việt Của Em" },
      {
        property: "og:description",
        content:
          "Chính sách bảo mật của Trường Tiếng Việt Của Em: dữ liệu chúng tôi thu thập, cách sử dụng và quyền của người dùng.",
      },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <main className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <PageBanner
        title="Chính sách bảo mật"
        subtitle={`Cập nhật lần cuối: ${LAST_UPDATED}`}
      />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="space-y-8 text-base leading-relaxed text-foreground">
          <Section title="1. Giới thiệu">
            <p>
              Trang này được duy trì bởi đội ngũ vận hành <strong>Trường Tiếng Việt Của Em</strong>{" "}
              (sau đây gọi là “chúng tôi”) nhằm giải thích cách chúng tôi thu thập, sử dụng và bảo
              vệ dữ liệu của người dùng khi truy cập nền tảng học tiếng Việt của chúng tôi. Đây là
              tài liệu do đội ngũ tự soạn, không phải chứng nhận độc lập.
            </p>
          </Section>

          <Section title="2. Thông tin chúng tôi thu thập">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Thông tin tài khoản</strong>: khi đăng nhập bằng Google, chúng tôi nhận địa
                chỉ email, tên hiển thị và ảnh đại diện công khai từ tài khoản Google của bạn.
              </li>
              <li>
                <strong>Hồ sơ học tập</strong>: tên hiển thị, biểu tượng đại diện, quốc gia và tiến
                độ học tập mà bạn tự cập nhật trong ứng dụng.
              </li>
              <li>
                <strong>Tiến độ bài học</strong>: các chặng và nội dung bạn đã hoàn thành, được lưu
                để hiển thị lộ trình và bảng xếp hạng.
              </li>
            </ul>
          </Section>

          <Section title="3. Mục đích sử dụng dữ liệu">
            <ul className="list-disc space-y-2 pl-6">
              <li>Tạo và duy trì tài khoản cá nhân của bạn trên nền tảng.</li>
              <li>Ghi nhận tiến độ học tập và hiển thị lộ trình phù hợp.</li>
              <li>Hiển thị tên và biểu tượng đại diện trên bảng xếp hạng công khai.</li>
              <li>Cải thiện chất lượng nội dung và trải nghiệm học tập cho trẻ em.</li>
            </ul>
          </Section>

          <Section title="4. Đăng nhập bằng Google">
            <p>
              Chúng tôi sử dụng Google OAuth để xác thực. Khi bạn chọn đăng nhập bằng Google, Google
              sẽ chia sẻ với chúng tôi email, tên và ảnh đại diện. Chúng tôi không truy cập vào bất
              kỳ dữ liệu nào khác trong tài khoản Google của bạn (thư, danh bạ, tệp, v.v.).
            </p>
          </Section>

          <Section title="5. Chia sẻ dữ liệu">
            <p>
              Chúng tôi không bán dữ liệu cá nhân. Dữ liệu chỉ được xử lý bởi các nhà cung cấp hạ
              tầng cần thiết để vận hành ứng dụng (ví dụ: Supabase cho cơ sở dữ liệu và xác thực,
              nhà cung cấp lưu trữ tĩnh cho hình ảnh và âm thanh bài học). Các bên này chỉ xử lý dữ
              liệu theo hướng dẫn của chúng tôi.
            </p>
          </Section>

          <Section title="6. Thông tin công khai">
            <p>
              Tên hiển thị, biểu tượng, quốc gia và số bài đã hoàn thành có thể hiển thị công khai
              trên bảng xếp hạng và trang hồ sơ. Bạn có thể chỉnh sửa các thông tin này trong phần
              hồ sơ của mình.
            </p>
          </Section>

          <Section title="7. Lưu trữ và bảo mật">
            <p>
              Dữ liệu được lưu trữ trên hạ tầng Supabase với chính sách phân quyền theo hàng
              (Row-Level Security). Chỉ chủ tài khoản mới có thể chỉnh sửa hồ sơ và tiến độ học tập
              của mình.
            </p>
          </Section>

          <Section title="8. Quyền của người dùng">
            <p>
              Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa dữ liệu cá nhân của mình. Để thực
              hiện các quyền này, vui lòng liên hệ với chúng tôi qua email bên dưới.
            </p>
          </Section>

          <Section title="9. Trẻ em">
            <p>
              Nền tảng dành cho trẻ em tiểu học, thường được sử dụng dưới sự hướng dẫn của phụ huynh
              hoặc giáo viên. Phụ huynh có thể liên hệ với chúng tôi bất kỳ lúc nào để xem hoặc xóa
              dữ liệu tài khoản của con em mình.
            </p>
          </Section>

          <Section title="10. Thay đổi chính sách">
            <p>
              Chúng tôi có thể cập nhật chính sách này theo thời gian. Ngày cập nhật gần nhất sẽ
              được hiển thị ở đầu trang.
            </p>
          </Section>

          <Section title="11. Liên hệ">
            <p>
              Mọi câu hỏi về quyền riêng tư, vui lòng gửi email tới{" "}
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
              to="/dieu-khoan-su-dung"
              className="font-semibold text-primary underline underline-offset-4"
            >
              Điều khoản sử dụng
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
