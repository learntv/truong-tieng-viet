import { Bullets, Strong, TextLink, type ContentLocale, type LegalDoc } from "./prose";

export const privacyContent: Record<ContentLocale, LegalDoc> = {
  vi: {
    lastUpdated: "21 tháng 7, 2026",
    intro: (
      <>
        Trường Tiếng Việt Của Em ("chúng tôi", "Dịch vụ") được vận hành bởi{" "}
        <Strong>Canada Vietnam Cultural &amp; Educational Council (CVCEC)</Strong>. Chính sách này
        giải thích chúng tôi thu thập, sử dụng và bảo vệ thông tin gì khi bạn hoặc con em bạn sử
        dụng nền tảng học tiếng Việt của chúng tôi. Dịch vụ này hướng đến trẻ em, vì vậy chúng tôi
        thiết kế việc thu thập dữ liệu ở mức tối thiểu cần thiết và đặc biệt chú trọng đến sự riêng
        tư của trẻ.
      </>
    ),
    sections: [
      {
        title: "1. Thông tin chúng tôi thu thập",
        body: (
          <>
            <p>
              <Strong>Thông tin tài khoản.</Strong> Khi phụ huynh hoặc học sinh tạo tài khoản, chúng
              tôi thu thập địa chỉ email và mật khẩu (được mã hoá), hoặc thông tin cơ bản từ tài
              khoản Google nếu bạn đăng nhập bằng Google (tên hiển thị, email, ảnh đại diện công
              khai).
            </p>
            <p>
              <Strong>Hồ sơ học tập.</Strong> Tên hiển thị/biệt danh, ảnh đại diện (emoji hoặc ảnh
              do người dùng tải lên), quốc gia, và tiến trình học tập (bài đã hoàn thành, điểm số,
              chuỗi ngày học, vị trí trên bảng xếp hạng).
            </p>
            <p>
              <Strong>Luyện nói.</Strong> Tính năng luyện nói sử dụng micro của thiết bị để nhận
              dạng giọng nói ngay trên trình duyệt (Web Speech API). Âm thanh giọng nói của học sinh
              chỉ được xử lý tạm thời để chấm điểm phát âm và{" "}
              <Strong>không được ghi âm, lưu trữ hay gửi lên máy chủ của chúng tôi</Strong>.
            </p>
            <p>
              <Strong>Dữ liệu kỹ thuật.</Strong> Chúng tôi có thể ghi nhận thông tin kỹ thuật cơ bản
              (loại trình duyệt, nhật ký lỗi) nhằm duy trì hoạt động và bảo mật của Dịch vụ.
            </p>
          </>
        ),
      },
      {
        title: "2. Cách chúng tôi sử dụng thông tin",
        body: (
          <>
            <Bullets>
              <li>Cung cấp, duy trì và cá nhân hoá trải nghiệm học tập.</li>
              <li>Lưu và hiển thị tiến trình học tập, thành tích, bảng xếp hạng.</li>
              <li>
                Liên hệ với phụ huynh về tài khoản, hỗ trợ kỹ thuật, hoặc thay đổi chính sách.
              </li>
              <li>Bảo vệ Dịch vụ khỏi gian lận, lạm dụng và truy cập trái phép.</li>
            </Bullets>
            <p>
              Chúng tôi <Strong>không</Strong> bán dữ liệu cá nhân, không sử dụng dữ liệu của trẻ em
              để quảng cáo hướng đối tượng (behavioral advertising), và không sử dụng dữ liệu học
              tập cho mục đích nào ngoài việc vận hành Dịch vụ.
            </p>
          </>
        ),
      },
      {
        title: "3. Đăng nhập bằng Google",
        body: (
          <p>
            Nếu bạn chọn đăng nhập bằng Google, chúng tôi chỉ nhận thông tin cơ bản do Google cung
            cấp (tên, email, ảnh đại diện) để tạo và xác thực tài khoản. Chúng tôi không truy cập
            vào các dữ liệu Google khác (Gmail, Drive, danh bạ, v.v.). Bạn có thể thu hồi quyền truy
            cập này bất kỳ lúc nào tại{" "}
            <TextLink href="https://myaccount.google.com/permissions" external>
              trang quản lý ứng dụng của tài khoản Google
            </TextLink>
            .
          </p>
        ),
      },
      {
        title: "4. Lưu trữ và bảo mật dữ liệu",
        body: (
          <>
            <p>
              Dữ liệu tài khoản và tiến trình học tập được lưu trữ trên hạ tầng của Supabase (cơ sở
              dữ liệu, xác thực) và Cloudflare R2 (lưu trữ tệp như ảnh đại diện, âm thanh bài học).
              Chúng tôi áp dụng các biện pháp kỹ thuật hợp lý (mã hoá khi truyền tải, kiểm soát truy
              cập theo hàng dữ liệu) để bảo vệ thông tin khỏi truy cập trái phép.
            </p>
            <p>
              Không có phương thức truyền tải hoặc lưu trữ điện tử nào an toàn tuyệt đối; chúng tôi
              nỗ lực bảo vệ dữ liệu nhưng không thể đảm bảo an toàn tuyệt đối.
            </p>
          </>
        ),
      },
      {
        title: "5. Quyền riêng tư của trẻ em",
        body: (
          <>
            <p>
              Trường Tiếng Việt Của Em được thiết kế dành cho trẻ em học tiếng Việt, thường với sự
              đồng hành của phụ huynh. Chúng tôi:
            </p>
            <Bullets>
              <li>
                Chỉ thu thập thông tin tối thiểu cần thiết để vận hành tính năng học tập (không thu
                thập địa chỉ nhà, số điện thoại, hay dữ liệu định vị).
              </li>
              <li>Không hiển thị quảng cáo của bên thứ ba trong Dịch vụ.</li>
              <li>Không theo dõi hành vi trẻ em giữa các trang web/ứng dụng khác để quảng cáo.</li>
              <li>
                Cho phép phụ huynh xem, chỉnh sửa hoặc yêu cầu xoá thông tin tài khoản của con em
                mình bất kỳ lúc nào (xem mục 7).
              </li>
            </Bullets>
            <p>
              Nếu bạn là phụ huynh/người giám hộ và tin rằng con bạn đã cung cấp thông tin cá nhân
              mà không có sự đồng ý của bạn, vui lòng liên hệ chúng tôi theo mục 8 để chúng tôi xử
              lý và xoá thông tin đó.
            </p>
          </>
        ),
      },
      {
        title: "6. Chia sẻ thông tin",
        body: (
          <>
            <p>
              Chúng tôi không bán hoặc cho thuê dữ liệu cá nhân. Thông tin chỉ được chia sẻ với:
            </p>
            <Bullets>
              <li>
                Nhà cung cấp hạ tầng kỹ thuật (Supabase, Cloudflare, Google Cloud text-to-speech),
                chỉ trong phạm vi cần thiết để vận hành Dịch vụ.
              </li>
              <li>Cơ quan pháp luật, nếu được yêu cầu theo quy định pháp luật hiện hành.</li>
            </Bullets>
            <p>
              Tên hiển thị và điểm số trên <Strong>bảng xếp hạng</Strong> có thể hiển thị công khai
              cho người dùng khác trong Dịch vụ; chúng tôi khuyến khích phụ huynh không sử dụng tên
              thật của trẻ làm tên hiển thị.
            </p>
          </>
        ),
      },
      {
        title: "7. Quyền của bạn",
        body: (
          <Bullets>
            <li>
              Truy cập, chỉnh sửa thông tin hồ sơ bất kỳ lúc nào trong phần cài đặt tài khoản.
            </li>
            <li>
              Yêu cầu xoá tài khoản và toàn bộ dữ liệu liên quan (có sẵn tính năng xoá tài khoản
              trong ứng dụng).
            </li>
            <li>Yêu cầu xuất hoặc cung cấp bản sao dữ liệu cá nhân của bạn.</li>
            <li>Rút lại sự đồng ý đã cung cấp bất kỳ lúc nào bằng cách liên hệ chúng tôi.</li>
          </Bullets>
        ),
      },
      {
        title: "8. Liên hệ",
        body: (
          <p>
            Nếu bạn có câu hỏi về chính sách bảo mật này hoặc muốn thực hiện các quyền nêu trên, vui
            lòng liên hệ: <TextLink href="mailto:contact@cvcec.org">contact@cvcec.org</TextLink>.
          </p>
        ),
      },
      {
        title: "9. Thay đổi chính sách",
        body: (
          <p>
            Chúng tôi có thể cập nhật chính sách này theo thời gian. Ngày cập nhật gần nhất được
            hiển thị ở đầu trang. Các thay đổi quan trọng sẽ được thông báo qua email hoặc thông báo
            trong ứng dụng.
          </p>
        ),
      },
    ],
  },
  en: {
    lastUpdated: "July 21, 2026",
    intro: (
      <>
        Trường Tiếng Việt Của Em ("we", "the Service") is run by{" "}
        <Strong>Canada Vietnam Cultural &amp; Educational Council (CVCEC)</Strong>. This policy
        explains what information we collect, how we use it, and how we protect it when you or your
        child use our Vietnamese learning platform. The Service is made for children, so we keep
        data collection to the minimum needed and take special care with children's privacy.
      </>
    ),
    sections: [
      {
        title: "1. Information We Collect",
        body: (
          <>
            <p>
              <Strong>Account information.</Strong> When a parent or student creates an account, we
              collect an email address and (encrypted) password, or basic details from your Google
              account if you sign in with Google (display name, email, public profile photo).
            </p>
            <p>
              <Strong>Learning profile.</Strong> Display name/nickname, avatar (emoji or an uploaded
              image), country, and learning progress (completed lessons, scores, streaks,
              leaderboard rank).
            </p>
            <p>
              <Strong>Speaking practice.</Strong> Speaking practice uses the device microphone for
              speech recognition right in the browser (Web Speech API). A student's voice is only
              processed briefly to grade pronunciation and{" "}
              <Strong>is never recorded, stored, or uploaded to our servers</Strong>.
            </p>
            <p>
              <Strong>Technical data.</Strong> We may log basic technical information (browser type,
              error logs) to keep the Service running and secure.
            </p>
          </>
        ),
      },
      {
        title: "2. How We Use Information",
        body: (
          <>
            <Bullets>
              <li>Provide, maintain, and personalize the learning experience.</li>
              <li>Store and display learning progress, achievements, and leaderboards.</li>
              <li>Contact parents about the account, technical support, or policy changes.</li>
              <li>Protect the Service from fraud, abuse, and unauthorized access.</li>
            </Bullets>
            <p>
              We do <Strong>not</Strong> sell personal data, do not use children's data for
              behavioral advertising, and do not use learning data for any purpose beyond operating
              the Service.
            </p>
          </>
        ),
      },
      {
        title: "3. Sign in with Google",
        body: (
          <p>
            If you choose to sign in with Google, we only receive the basic information Google
            provides (name, email, profile photo) to create and authenticate your account. We do not
            access other Google data (Gmail, Drive, contacts, etc.). You can revoke this access at
            any time from your{" "}
            <TextLink href="https://myaccount.google.com/permissions" external>
              Google Account permissions page
            </TextLink>
            .
          </p>
        ),
      },
      {
        title: "4. Data Storage and Security",
        body: (
          <>
            <p>
              Account and progress data is stored on Supabase (database, authentication) and
              Cloudflare R2 (file storage such as avatars and lesson audio). We use reasonable
              technical safeguards (encryption in transit, row-level access controls) to protect
              information from unauthorized access.
            </p>
            <p>
              No method of electronic transmission or storage is perfectly secure; we work hard to
              protect your data but cannot guarantee absolute security.
            </p>
          </>
        ),
      },
      {
        title: "5. Children's Privacy",
        body: (
          <>
            <p>
              Trường Tiếng Việt Của Em is made for children learning Vietnamese, usually with a
              parent alongside them. We:
            </p>
            <Bullets>
              <li>
                Collect only the minimum information needed to run the learning features (no home
                address, phone number, or location data).
              </li>
              <li>Do not show third-party advertising in the Service.</li>
              <li>Do not track children across other websites or apps for advertising.</li>
              <li>
                Let parents view, edit, or request deletion of their child's account information at
                any time (see Section 7).
              </li>
            </Bullets>
            <p>
              If you are a parent or guardian and believe your child has given personal information
              without your consent, please contact us as described in Section 8 so we can handle it
              and delete that information.
            </p>
          </>
        ),
      },
      {
        title: "6. Sharing of Information",
        body: (
          <>
            <p>We do not sell or rent personal data. Information is only shared with:</p>
            <Bullets>
              <li>
                Technical infrastructure providers (Supabase, Cloudflare, Google Cloud
                text-to-speech), only as far as needed to operate the Service.
              </li>
              <li>Law enforcement authorities, if required by applicable law.</li>
            </Bullets>
            <p>
              Display names and scores on the <Strong>leaderboard</Strong> may be shown publicly to
              other users of the Service; we encourage parents not to use a child's real name as
              their display name.
            </p>
          </>
        ),
      },
      {
        title: "7. Your Rights",
        body: (
          <Bullets>
            <li>Access and edit your profile information at any time in account settings.</li>
            <li>
              Request deletion of your account and all associated data (an in-app account deletion
              feature is available).
            </li>
            <li>Request an export or a copy of your personal data.</li>
            <li>Withdraw consent you have given at any time by contacting us.</li>
          </Bullets>
        ),
      },
      {
        title: "8. Contact",
        body: (
          <p>
            If you have questions about this Privacy Policy or want to exercise the rights above,
            please contact: <TextLink href="mailto:contact@cvcec.org">contact@cvcec.org</TextLink>.
          </p>
        ),
      },
      {
        title: "9. Changes to This Policy",
        body: (
          <p>
            We may update this policy from time to time. The date of the latest update is shown at
            the top of this page. Important changes will be announced by email or by a notice in the
            app.
          </p>
        ),
      },
    ],
  },
};
