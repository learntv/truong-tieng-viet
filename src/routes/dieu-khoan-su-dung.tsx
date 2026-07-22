import { createFileRoute } from "@tanstack/react-router";
import { PageBanner } from "@/components/site/PageBanner";

export const Route = createFileRoute("/dieu-khoan-su-dung")({
  head: () => ({
    meta: [
      { title: "Điều khoản sử dụng — Trường Tiếng Việt Của Em" },
      {
        name: "description",
        content:
          "Điều khoản sử dụng của Trường Tiếng Việt Của Em: quyền và trách nhiệm khi sử dụng nền tảng học tiếng Việt.",
      },
    ],
  }),
  component: TermsOfService,
});

const LAST_UPDATED = "21 tháng 7, 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 font-display text-xl font-extrabold text-foreground sm:text-2xl">
        {title}
      </h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {children}
      </div>
    </section>
  );
}

function TermsOfService() {
  return (
    <main className="">
      <PageBanner title="Điều khoản sử dụng" subtitle={`Cập nhật lần cuối: ${LAST_UPDATED}`} />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="mb-10 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Chào mừng bạn đến với Trường Tiếng Việt Của Em ("Dịch vụ"), được vận hành bởi{" "}
          <strong className="text-foreground">Canada Vietnam Cultural &amp; Educational Council (CVCEC)</strong>.
          Bằng việc tạo tài khoản hoặc sử dụng Dịch vụ, bạn (hoặc phụ huynh/người giám hộ thay
          mặt trẻ em) đồng ý với các điều khoản dưới đây. Vui lòng đọc kỹ trước khi sử dụng.
        </p>

        <Section title="1. Đối tượng sử dụng">
          <p>
            Dịch vụ được thiết kế dành cho trẻ em học tiếng Việt. Nếu người dùng dưới độ tuổi
            được pháp luật nơi cư trú cho phép tự đồng ý sử dụng dịch vụ trực tuyến, việc tạo
            và sử dụng tài khoản phải được thực hiện bởi hoặc dưới sự giám sát/đồng ý của phụ
            huynh hoặc người giám hộ hợp pháp. Phụ huynh chịu trách nhiệm về hoạt động trong
            tài khoản của con em mình.
          </p>
        </Section>

        <Section title="2. Tài khoản">
          <p>
            Bạn cần cung cấp thông tin chính xác khi đăng ký (email hoặc đăng nhập bằng
            Google). Bạn có trách nhiệm bảo mật thông tin đăng nhập của mình. Chúng tôi có
            quyền tạm ngưng hoặc chấm dứt tài khoản vi phạm các điều khoản này, có hành vi gian
            lận, hoặc gây hại đến Dịch vụ hay người dùng khác.
          </p>
          <p>
            Bạn có thể xoá tài khoản bất kỳ lúc nào thông qua tính năng xoá tài khoản trong
            phần cài đặt; việc này sẽ xoá vĩnh viễn dữ liệu liên quan theo Chính sách bảo mật
            của chúng tôi.
          </p>
        </Section>

        <Section title="3. Nội dung và hành vi của người dùng">
          <p>Khi sử dụng Dịch vụ (ví dụ: đặt tên hiển thị, tải ảnh đại diện), bạn đồng ý không:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Đăng tải nội dung tục tĩu, bạo lực, phân biệt đối xử, hoặc không phù hợp với trẻ em.</li>
            <li>Mạo danh người khác hoặc cung cấp thông tin sai lệch.</li>
            <li>Sử dụng tên thật, thông tin liên hệ, hoặc hình ảnh nhận diện của trẻ làm tên hiển thị/ảnh đại diện công khai.</li>
            <li>Cố gắng truy cập trái phép hệ thống, can thiệp vào hoạt động của Dịch vụ, hoặc thu thập dữ liệu người dùng khác.</li>
          </ul>
          <p>
            Chúng tôi có quyền xoá nội dung vi phạm và/hoặc khoá tài khoản liên quan mà không
            cần báo trước.
          </p>
        </Section>

        <Section title="4. Nội dung học tập và quyền sở hữu trí tuệ">
          <p>
            Toàn bộ nội dung bài học, hình ảnh, âm thanh, biểu tượng, mã nguồn và thiết kế của
            Dịch vụ thuộc quyền sở hữu của CVCEC hoặc bên cấp phép, được bảo vệ bởi luật bản
            quyền. Bạn được cấp quyền sử dụng cá nhân, phi thương mại đối với nội dung học tập
            trong phạm vi phục vụ việc học tiếng Việt của bạn/con em bạn. Bạn không được sao
            chép, phân phối lại, hoặc khai thác thương mại nội dung mà không có sự cho phép
            bằng văn bản.
          </p>
        </Section>

        <Section title="5. Dịch vụ bên thứ ba">
          <p>
            Dịch vụ sử dụng các nhà cung cấp hạ tầng bên thứ ba (bao gồm Supabase, Cloudflare,
            và Google) để xác thực tài khoản, lưu trữ dữ liệu và tổng hợp giọng nói. Việc sử
            dụng các dịch vụ này cũng chịu sự điều chỉnh của điều khoản riêng của các bên đó.
          </p>
        </Section>

        <Section title="6. Miễn trừ bảo đảm">
          <p>
            Dịch vụ được cung cấp "nguyên trạng" ("as is") và "trong khả năng sẵn có" ("as
            available"), không có bất kỳ bảo đảm nào, dù rõ ràng hay ngụ ý. Chúng tôi không đảm
            bảo Dịch vụ sẽ hoạt động liên tục, không lỗi, hoặc phù hợp tuyệt đối với mọi mục
            đích sử dụng.
          </p>
        </Section>

        <Section title="7. Giới hạn trách nhiệm">
          <p>
            Trong phạm vi tối đa được pháp luật cho phép, CVCEC không chịu trách nhiệm đối với
            các thiệt hại gián tiếp, ngẫu nhiên, hoặc hệ quả phát sinh từ việc sử dụng hoặc
            không thể sử dụng Dịch vụ. Dịch vụ được cung cấp miễn phí với mục đích giáo dục phi
            lợi nhuận.
          </p>
        </Section>

        <Section title="8. Thay đổi điều khoản">
          <p>
            Chúng tôi có thể cập nhật các điều khoản này theo thời gian. Ngày cập nhật gần nhất
            được hiển thị ở đầu trang. Việc tiếp tục sử dụng Dịch vụ sau khi thay đổi có hiệu
            lực đồng nghĩa với việc bạn chấp nhận các điều khoản đã cập nhật.
          </p>
        </Section>

        <Section title="9. Liên hệ">
          <p>
            Nếu bạn có câu hỏi về các điều khoản này, vui lòng liên hệ:{" "}
            <a
              href="mailto:contact@cvcec.org"
              className="font-semibold text-primary underline underline-offset-2"
            >
              contact@cvcec.org
            </a>
            .
          </p>
        </Section>

        <hr className="my-12 border-border" />

        {/* English version */}
        <h1 className="mb-2 font-display text-2xl font-extrabold text-foreground">
          Terms of Service (English)
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

        <Section title="1. Who May Use the Service">
          <p>
            The Service is designed for children learning Vietnamese. Where a user is below the
            age at which local law permits independent consent to use an online service,
            account creation and use must be done by, or with the supervision and consent of, a
            parent or legal guardian. Parents are responsible for activity on their child's
            account.
          </p>
        </Section>

        <Section title="2. Accounts">
          <p>
            You must provide accurate information when registering (email or Google sign-in).
            You are responsible for keeping your login credentials secure. We may suspend or
            terminate accounts that violate these Terms, engage in fraud, or harm the Service or
            other users.
          </p>
          <p>
            You may delete your account at any time using the in-app account deletion feature;
            this permanently removes associated data per our Privacy Policy.
          </p>
        </Section>

        <Section title="3. User Content and Conduct">
          <p>When using the Service (e.g., setting a display name, uploading an avatar), you agree not to:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Post obscene, violent, discriminatory, or otherwise inappropriate content.</li>
            <li>Impersonate others or provide false information.</li>
            <li>Use a child's real name, contact details, or identifiable photo as a public display name/avatar.</li>
            <li>Attempt unauthorized access, interfere with the Service, or scrape other users' data.</li>
          </ul>
          <p>
            We may remove violating content and/or suspend related accounts without prior
            notice.
          </p>
        </Section>

        <Section title="4. Learning Content and Intellectual Property">
          <p>
            All lesson content, images, audio, icons, source code, and design of the Service are
            owned by CVCEC or its licensors and protected by copyright law. You are granted a
            personal, non-commercial license to use the learning content for the purpose of your
            (or your child's) Vietnamese learning. You may not copy, redistribute, or
            commercially exploit the content without written permission.
          </p>
        </Section>

        <Section title="5. Third-Party Services">
          <p>
            The Service relies on third-party infrastructure providers (including Supabase,
            Cloudflare, and Google) for authentication, data storage, and speech synthesis. Use
            of these services is also subject to their own respective terms.
          </p>
        </Section>

        <Section title="6. Disclaimer of Warranties">
          <p>
            The Service is provided "as is" and "as available," without warranties of any kind,
            whether express or implied. We do not guarantee that the Service will be
            uninterrupted, error-free, or fit for any particular purpose.
          </p>
        </Section>

        <Section title="7. Limitation of Liability">
          <p>
            To the maximum extent permitted by law, CVCEC is not liable for any indirect,
            incidental, or consequential damages arising from use of, or inability to use, the
            Service. The Service is provided free of charge for non-profit educational purposes.
          </p>
        </Section>

        <Section title="8. Changes to These Terms">
          <p>
            We may update these Terms from time to time. The "last updated" date at the top of
            this page reflects the most recent revision. Continued use of the Service after
            changes take effect constitutes acceptance of the updated Terms.
          </p>
        </Section>

        <Section title="9. Contact">
          <p>
            Questions about these Terms can be sent to:{" "}
            <a
              href="mailto:contact@cvcec.org"
              className="font-semibold text-primary underline underline-offset-2"
            >
              contact@cvcec.org
            </a>
            .
          </p>
        </Section>
      </div>
    </main>
  );
}
