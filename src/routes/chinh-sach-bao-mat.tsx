import { createFileRoute } from "@tanstack/react-router";
import { PageBanner } from "@/components/site/PageBanner";

export const Route = createFileRoute("/chinh-sach-bao-mat")({
  head: () => ({
    meta: [
      { title: "Chính sách bảo mật — Trường Tiếng Việt Của Em" },
      {
        name: "description",
        content:
          "Chính sách bảo mật của Trường Tiếng Việt Của Em: dữ liệu chúng tôi thu thập, cách sử dụng, và quyền của phụ huynh/học sinh.",
      },
      { property: "og:title", content: "Chính sách bảo mật — Trường Tiếng Việt Của Em" },
      { property: "og:description", content: "Dữ liệu chúng tôi thu thập, cách sử dụng, và quyền của phụ huynh/học sinh." },
      { property: "og:url", content: "/chinh-sach-bao-mat" },
    ],
    links: [{ rel: "canonical", href: "/chinh-sach-bao-mat" }],
  }),
  component: PrivacyPolicy,
});

const LAST_UPDATED = "21 tháng 7, 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 font-display text-xl font-bold text-foreground sm:text-2xl">
        {title}
      </h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {children}
      </div>
    </section>
  );
}

function PrivacyPolicy() {
  return (
    <main className="">
      <PageBanner
        title="Chính sách bảo mật"
        subtitle={`Cập nhật lần cuối: ${LAST_UPDATED}`}
      />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="mb-10 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Trường Tiếng Việt Của Em ("chúng tôi", "Dịch vụ") được vận hành bởi{" "}
          <strong className="text-foreground">Canada Vietnam Cultural &amp; Educational Council (CVCEC)</strong>.
          Chính sách này giải thích chúng tôi thu thập, sử dụng và bảo vệ thông tin gì khi
          bạn hoặc con em bạn sử dụng nền tảng học tiếng Việt của chúng tôi. Dịch vụ này
          hướng đến trẻ em, vì vậy chúng tôi thiết kế việc thu thập dữ liệu ở mức tối thiểu
          cần thiết và đặc biệt chú trọng đến sự riêng tư của trẻ.
        </p>

        <Section title="1. Thông tin chúng tôi thu thập">
          <p>
            <strong className="text-foreground">Thông tin tài khoản.</strong> Khi phụ huynh
            hoặc học sinh tạo tài khoản, chúng tôi thu thập địa chỉ email và mật khẩu (được mã
            hoá), hoặc thông tin cơ bản từ tài khoản Google nếu bạn đăng nhập bằng Google
            (tên hiển thị, email, ảnh đại diện công khai).
          </p>
          <p>
            <strong className="text-foreground">Hồ sơ học tập.</strong> Tên hiển thị/biệt danh,
            ảnh đại diện (emoji hoặc ảnh do người dùng tải lên), quốc gia, và tiến trình học
            tập (bài đã hoàn thành, điểm số, chuỗi ngày học, vị trí trên bảng xếp hạng).
          </p>
          <p>
            <strong className="text-foreground">Luyện nói.</strong> Tính năng luyện nói sử
            dụng micro của thiết bị để nhận dạng giọng nói ngay trên trình duyệt (Web Speech
            API). Âm thanh giọng nói của học sinh chỉ được xử lý tạm thời để chấm điểm phát âm
            và <strong className="text-foreground">không được ghi âm, lưu trữ hay gửi lên máy
            chủ của chúng tôi</strong>.
          </p>
          <p>
            <strong className="text-foreground">Dữ liệu kỹ thuật.</strong> Chúng tôi có thể ghi
            nhận thông tin kỹ thuật cơ bản (loại trình duyệt, nhật ký lỗi) nhằm duy trì hoạt
            động và bảo mật của Dịch vụ.
          </p>
        </Section>

        <Section title="2. Cách chúng tôi sử dụng thông tin">
          <ul className="list-disc space-y-2 pl-5">
            <li>Cung cấp, duy trì và cá nhân hoá trải nghiệm học tập.</li>
            <li>Lưu và hiển thị tiến trình học tập, thành tích, bảng xếp hạng.</li>
            <li>Liên hệ với phụ huynh về tài khoản, hỗ trợ kỹ thuật, hoặc thay đổi chính sách.</li>
            <li>Bảo vệ Dịch vụ khỏi gian lận, lạm dụng và truy cập trái phép.</li>
          </ul>
          <p>
            Chúng tôi <strong className="text-foreground">không</strong> bán dữ liệu cá nhân,
            không sử dụng dữ liệu của trẻ em để quảng cáo hướng đối tượng (behavioral
            advertising), và không sử dụng dữ liệu học tập cho mục đích nào ngoài việc vận
            hành Dịch vụ.
          </p>
        </Section>

        <Section title="3. Đăng nhập bằng Google">
          <p>
            Nếu bạn chọn đăng nhập bằng Google, chúng tôi chỉ nhận thông tin cơ bản do Google
            cung cấp (tên, email, ảnh đại diện) để tạo và xác thực tài khoản. Chúng tôi không
            truy cập vào các dữ liệu Google khác (Gmail, Drive, danh bạ, v.v.). Bạn có thể thu
            hồi quyền truy cập này bất kỳ lúc nào tại{" "}
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-primary underline underline-offset-2"
            >
              trang quản lý ứng dụng của tài khoản Google
            </a>
            .
          </p>
        </Section>

        <Section title="4. Lưu trữ và bảo mật dữ liệu">
          <p>
            Dữ liệu tài khoản và tiến trình học tập được lưu trữ trên hạ tầng của Supabase
            (cơ sở dữ liệu, xác thực) và Cloudflare R2 (lưu trữ tệp như ảnh đại diện, âm
            thanh bài học). Chúng tôi áp dụng các biện pháp kỹ thuật hợp lý (mã hoá khi truyền
            tải, kiểm soát truy cập theo hàng dữ liệu) để bảo vệ thông tin khỏi truy cập trái
            phép.
          </p>
          <p>
            Không có phương thức truyền tải hoặc lưu trữ điện tử nào an toàn tuyệt đối; chúng
            tôi nỗ lực bảo vệ dữ liệu nhưng không thể đảm bảo an toàn tuyệt đối.
          </p>
        </Section>

        <Section title="5. Quyền riêng tư của trẻ em">
          <p>
            Trường Tiếng Việt Của Em được thiết kế dành cho trẻ em học tiếng Việt, thường với
            sự đồng hành của phụ huynh. Chúng tôi:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Chỉ thu thập thông tin tối thiểu cần thiết để vận hành tính năng học tập (không
              thu thập địa chỉ nhà, số điện thoại, hay dữ liệu định vị).
            </li>
            <li>Không hiển thị quảng cáo của bên thứ ba trong Dịch vụ.</li>
            <li>Không theo dõi hành vi trẻ em giữa các trang web/ứng dụng khác để quảng cáo.</li>
            <li>
              Cho phép phụ huynh xem, chỉnh sửa hoặc yêu cầu xoá thông tin tài khoản của con
              em mình bất kỳ lúc nào (xem mục 7).
            </li>
          </ul>
          <p>
            Nếu bạn là phụ huynh/người giám hộ và tin rằng con bạn đã cung cấp thông tin cá
            nhân mà không có sự đồng ý của bạn, vui lòng liên hệ chúng tôi theo mục 8 để chúng
            tôi xử lý và xoá thông tin đó.
          </p>
        </Section>

        <Section title="6. Chia sẻ thông tin">
          <p>
            Chúng tôi không bán hoặc cho thuê dữ liệu cá nhân. Thông tin chỉ được chia sẻ với:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Nhà cung cấp hạ tầng kỹ thuật (Supabase, Cloudflare, Google Cloud text-to-speech)
              — chỉ trong phạm vi cần thiết để vận hành Dịch vụ.
            </li>
            <li>Cơ quan pháp luật, nếu được yêu cầu theo quy định pháp luật hiện hành.</li>
          </ul>
          <p>
            Tên hiển thị và điểm số trên <strong className="text-foreground">bảng xếp
            hạng</strong> có thể hiển thị công khai cho người dùng khác trong Dịch vụ; chúng
            tôi khuyến khích phụ huynh không sử dụng tên thật của trẻ làm tên hiển thị.
          </p>
        </Section>

        <Section title="7. Quyền của bạn">
          <ul className="list-disc space-y-2 pl-5">
            <li>Truy cập, chỉnh sửa thông tin hồ sơ bất kỳ lúc nào trong phần cài đặt tài khoản.</li>
            <li>Yêu cầu xoá tài khoản và toàn bộ dữ liệu liên quan (có sẵn tính năng xoá tài khoản trong ứng dụng).</li>
            <li>Yêu cầu xuất hoặc cung cấp bản sao dữ liệu cá nhân của bạn.</li>
            <li>Rút lại sự đồng ý đã cung cấp bất kỳ lúc nào bằng cách liên hệ chúng tôi.</li>
          </ul>
        </Section>

        <Section title="8. Liên hệ">
          <p>
            Nếu bạn có câu hỏi về chính sách bảo mật này hoặc muốn thực hiện các quyền nêu
            trên, vui lòng liên hệ:{" "}
            <a
              href="mailto:contact@cvcec.org"
              className="font-semibold text-primary underline underline-offset-2"
            >
              contact@cvcec.org
            </a>
            .
          </p>
        </Section>

        <Section title="9. Thay đổi chính sách">
          <p>
            Chúng tôi có thể cập nhật chính sách này theo thời gian. Ngày cập nhật gần nhất
            được hiển thị ở đầu trang. Các thay đổi quan trọng sẽ được thông báo qua email
            hoặc thông báo trong ứng dụng.
          </p>
        </Section>

        <hr className="my-12 border-border" />

        {/* English version */}
        <h2 className="mb-2 font-display text-2xl font-bold text-foreground">
          Privacy Policy (English)
        </h2>
        <p className="mb-8 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

        <Section title="1. Information We Collect">
          <p>
            <strong className="text-foreground">Account information:</strong> email address and
            (encrypted) password, or basic Google account details (display name, email,
            public profile photo) if you sign in with Google.
          </p>
          <p>
            <strong className="text-foreground">Learning profile:</strong> display
            name/nickname, avatar (emoji or uploaded image), country, and learning progress
            (completed lessons, scores, streaks, leaderboard rank).
          </p>
          <p>
            <strong className="text-foreground">Speaking practice:</strong> our speaking
            exercises use the device microphone for on-device speech recognition (the browser's
            Web Speech API) to grade pronunciation. Voice audio is processed transiently and{" "}
            <strong className="text-foreground">is never recorded, stored, or uploaded to our
            servers</strong>.
          </p>
          <p>
            <strong className="text-foreground">Technical data:</strong> basic technical
            information (browser type, error logs) to keep the Service secure and functioning.
          </p>
        </Section>

        <Section title="2. How We Use Information">
          <ul className="list-disc space-y-2 pl-5">
            <li>Provide, maintain, and personalize the learning experience.</li>
            <li>Store and display learning progress, achievements, and leaderboards.</li>
            <li>Contact parents about the account, support requests, or policy updates.</li>
            <li>Protect the Service from fraud, abuse, and unauthorized access.</li>
          </ul>
          <p>
            We do <strong className="text-foreground">not</strong> sell personal data, do not
            use children's data for behavioral advertising, and do not use learning data for
            any purpose beyond operating the Service.
          </p>
        </Section>

        <Section title="3. Sign in with Google">
          <p>
            If you choose to sign in with Google, we only receive the basic profile information
            Google provides (name, email, profile photo) to create and authenticate your
            account. We do not access other Google data (Gmail, Drive, contacts, etc.). You can
            revoke this access at any time from your{" "}
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-primary underline underline-offset-2"
            >
              Google Account permissions page
            </a>
            .
          </p>
        </Section>

        <Section title="4. Data Storage and Security">
          <p>
            Account and progress data is stored using Supabase (database, authentication) and
            Cloudflare R2 (file storage such as avatars and lesson audio). We use reasonable
            technical safeguards (encryption in transit, row-level access controls) to protect
            information from unauthorized access. No method of transmission or storage is
            perfectly secure, and we cannot guarantee absolute security.
          </p>
        </Section>

        <Section title="5. Children's Privacy">
          <p>
            Trường Tiếng Việt Của Em is built for children learning Vietnamese, typically with
            a parent or guardian involved. We:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Collect only the minimum information needed for learning features (no home
              address, phone number, or precise location data).
            </li>
            <li>Do not display third-party advertising within the Service.</li>
            <li>Do not track children across other websites or apps for advertising purposes.</li>
            <li>
              Let a parent view, edit, or request deletion of their child's account information
              at any time (see Section 7).
            </li>
          </ul>
          <p>
            If you are a parent or guardian and believe your child has provided personal
            information without your consent, please contact us via Section 8 so we can
            investigate and delete it.
          </p>
        </Section>

        <Section title="6. Sharing of Information">
          <p>We do not sell or rent personal data. Information is only shared with:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Infrastructure providers (Supabase, Cloudflare, Google Cloud text-to-speech) —
              only as needed to operate the Service.
            </li>
            <li>Law enforcement, if required by applicable law.</li>
          </ul>
          <p>
            Display names and scores on the <strong className="text-foreground">leaderboard</strong>{" "}
            may be shown publicly to other users of the Service; we encourage parents not to
            use a child's real name as their display name.
          </p>
        </Section>

        <Section title="7. Your Rights">
          <ul className="list-disc space-y-2 pl-5">
            <li>Access and edit profile information at any time in account settings.</li>
            <li>Request deletion of your account and associated data (an in-app account deletion feature is available).</li>
            <li>Request a copy/export of your personal data.</li>
            <li>Withdraw previously given consent at any time by contacting us.</li>
          </ul>
        </Section>

        <Section title="8. Contact">
          <p>
            Questions about this Privacy Policy or requests to exercise the rights above can be
            sent to:{" "}
            <a
              href="mailto:contact@cvcec.org"
              className="font-semibold text-primary underline underline-offset-2"
            >
              contact@cvcec.org
            </a>
            .
          </p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>
            We may update this policy from time to time. The "last updated" date at the top of
            this page reflects the most recent revision. Material changes will be announced by
            email or an in-app notice.
          </p>
        </Section>
      </div>
    </main>
  );
}
