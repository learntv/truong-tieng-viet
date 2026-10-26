import { Bullets, Strong, TextLink, type ContentLocale, type LegalDoc } from "./prose";

export const termsContent: Record<ContentLocale, LegalDoc> = {
  vi: {
    lastUpdated: "21 tháng 7, 2026",
    intro: (
      <>
        Chào mừng bạn đến với Trường Tiếng Việt Của Em ("Dịch vụ"), được vận hành bởi{" "}
        <Strong>Canada Vietnam Cultural &amp; Educational Council (CVCEC)</Strong>. Bằng việc tạo
        tài khoản hoặc sử dụng Dịch vụ, bạn (hoặc phụ huynh/người giám hộ thay mặt trẻ em) đồng ý
        với các điều khoản dưới đây. Vui lòng đọc kỹ trước khi sử dụng.
      </>
    ),
    sections: [
      {
        title: "1. Đối tượng sử dụng",
        body: (
          <p>
            Dịch vụ được thiết kế dành cho trẻ em học tiếng Việt. Nếu người dùng dưới độ tuổi được
            pháp luật nơi cư trú cho phép tự đồng ý sử dụng dịch vụ trực tuyến, việc tạo và sử dụng
            tài khoản phải được thực hiện bởi hoặc dưới sự giám sát/đồng ý của phụ huynh hoặc người
            giám hộ hợp pháp. Phụ huynh chịu trách nhiệm về hoạt động trong tài khoản của con em
            mình.
          </p>
        ),
      },
      {
        title: "2. Tài khoản",
        body: (
          <>
            <p>
              Bạn cần cung cấp thông tin chính xác khi đăng ký (email hoặc đăng nhập bằng Google).
              Bạn có trách nhiệm bảo mật thông tin đăng nhập của mình. Chúng tôi có quyền tạm ngưng
              hoặc chấm dứt tài khoản vi phạm các điều khoản này, có hành vi gian lận, hoặc gây hại
              đến Dịch vụ hay người dùng khác.
            </p>
            <p>
              Bạn có thể xoá tài khoản bất kỳ lúc nào thông qua tính năng xoá tài khoản trong phần
              cài đặt; việc này sẽ xoá vĩnh viễn dữ liệu liên quan theo Chính sách bảo mật của chúng
              tôi.
            </p>
          </>
        ),
      },
      {
        title: "3. Nội dung và hành vi của người dùng",
        body: (
          <>
            <p>
              Khi sử dụng Dịch vụ (ví dụ: đặt tên hiển thị, tải ảnh đại diện), bạn đồng ý không:
            </p>
            <Bullets>
              <li>
                Đăng tải nội dung tục tĩu, bạo lực, phân biệt đối xử, hoặc không phù hợp với trẻ em.
              </li>
              <li>Mạo danh người khác hoặc cung cấp thông tin sai lệch.</li>
              <li>
                Sử dụng tên thật, thông tin liên hệ, hoặc hình ảnh nhận diện của trẻ làm tên hiển
                thị/ảnh đại diện công khai.
              </li>
              <li>
                Cố gắng truy cập trái phép hệ thống, can thiệp vào hoạt động của Dịch vụ, hoặc thu
                thập dữ liệu người dùng khác.
              </li>
            </Bullets>
            <p>
              Chúng tôi có quyền xoá nội dung vi phạm và/hoặc khoá tài khoản liên quan mà không cần
              báo trước.
            </p>
          </>
        ),
      },
      {
        title: "4. Nội dung học tập và quyền sở hữu trí tuệ",
        body: (
          <p>
            Toàn bộ nội dung bài học, hình ảnh, âm thanh, biểu tượng, mã nguồn và thiết kế của Dịch
            vụ thuộc quyền sở hữu của CVCEC hoặc bên cấp phép, được bảo vệ bởi luật bản quyền. Bạn
            được cấp quyền sử dụng cá nhân, phi thương mại đối với nội dung học tập trong phạm vi
            phục vụ việc học tiếng Việt của bạn/con em bạn. Bạn không được sao chép, phân phối lại,
            hoặc khai thác thương mại nội dung mà không có sự cho phép bằng văn bản.
          </p>
        ),
      },
      {
        title: "5. Dịch vụ bên thứ ba",
        body: (
          <p>
            Dịch vụ sử dụng các nhà cung cấp hạ tầng bên thứ ba (bao gồm Supabase, Cloudflare, và
            Google) để xác thực tài khoản, lưu trữ dữ liệu và tổng hợp giọng nói. Việc sử dụng các
            dịch vụ này cũng chịu sự điều chỉnh của điều khoản riêng của các bên đó.
          </p>
        ),
      },
      {
        title: "6. Miễn trừ bảo đảm",
        body: (
          <p>
            Dịch vụ được cung cấp "nguyên trạng" ("as is") và "trong khả năng sẵn có" ("as
            available"), không có bất kỳ bảo đảm nào, dù rõ ràng hay ngụ ý. Chúng tôi không đảm bảo
            Dịch vụ sẽ hoạt động liên tục, không lỗi, hoặc phù hợp tuyệt đối với mọi mục đích sử
            dụng.
          </p>
        ),
      },
      {
        title: "7. Giới hạn trách nhiệm",
        body: (
          <p>
            Trong phạm vi tối đa được pháp luật cho phép, CVCEC không chịu trách nhiệm đối với các
            thiệt hại gián tiếp, ngẫu nhiên, hoặc hệ quả phát sinh từ việc sử dụng hoặc không thể sử
            dụng Dịch vụ. Dịch vụ được cung cấp miễn phí với mục đích giáo dục phi lợi nhuận.
          </p>
        ),
      },
      {
        title: "8. Thay đổi điều khoản",
        body: (
          <p>
            Chúng tôi có thể cập nhật các điều khoản này theo thời gian. Ngày cập nhật gần nhất được
            hiển thị ở đầu trang. Việc tiếp tục sử dụng Dịch vụ sau khi thay đổi có hiệu lực đồng
            nghĩa với việc bạn chấp nhận các điều khoản đã cập nhật.
          </p>
        ),
      },
      {
        title: "9. Liên hệ",
        body: (
          <p>
            Nếu bạn có câu hỏi về các điều khoản này, vui lòng liên hệ:{" "}
            <TextLink href="mailto:contact@cvcec.org">contact@cvcec.org</TextLink>.
          </p>
        ),
      },
    ],
  },
  en: {
    lastUpdated: "July 21, 2026",
    intro: (
      <>
        Welcome to Trường Tiếng Việt Của Em ("the Service"), run by{" "}
        <Strong>Canada Vietnam Cultural &amp; Educational Council (CVCEC)</Strong>. By creating an
        account or using the Service, you (or a parent/guardian on behalf of a child) agree to the
        terms below. Please read them carefully before using the Service.
      </>
    ),
    sections: [
      {
        title: "1. Who May Use the Service",
        body: (
          <p>
            The Service is designed for children learning Vietnamese. Where a user is below the age
            at which local law lets them consent on their own to an online service, account creation
            and use must be done by, or under the supervision and with the consent of, a parent or
            legal guardian. Parents are responsible for activity on their child's account.
          </p>
        ),
      },
      {
        title: "2. Accounts",
        body: (
          <>
            <p>
              You must provide accurate information when registering (email or Google sign-in). You
              are responsible for keeping your login details secure. We may suspend or terminate
              accounts that violate these Terms, engage in fraud, or harm the Service or other
              users.
            </p>
            <p>
              You may delete your account at any time using the account deletion feature in
              settings; this permanently deletes associated data as described in our Privacy Policy.
            </p>
          </>
        ),
      },
      {
        title: "3. User Content and Conduct",
        body: (
          <>
            <p>
              When using the Service (for example, setting a display name or uploading an avatar),
              you agree not to:
            </p>
            <Bullets>
              <li>
                Post obscene, violent, or discriminatory content, or content not suitable for
                children.
              </li>
              <li>Impersonate others or provide false information.</li>
              <li>
                Use a child's real name, contact details, or identifiable photo as a public display
                name/avatar.
              </li>
              <li>
                Attempt unauthorized access to the system, interfere with how the Service runs, or
                collect other users' data.
              </li>
            </Bullets>
            <p>
              We may remove violating content and/or lock related accounts without prior notice.
            </p>
          </>
        ),
      },
      {
        title: "4. Learning Content and Intellectual Property",
        body: (
          <p>
            All lesson content, images, audio, icons, source code, and design of the Service are
            owned by CVCEC or its licensors and protected by copyright law. You are granted a
            personal, non-commercial right to use the learning content for your own (or your
            child's) Vietnamese learning. You may not copy, redistribute, or commercially exploit
            the content without written permission.
          </p>
        ),
      },
      {
        title: "5. Third-Party Services",
        body: (
          <p>
            The Service uses third-party infrastructure providers (including Supabase, Cloudflare,
            and Google) for account authentication, data storage, and speech synthesis. Use of these
            services is also governed by their own terms.
          </p>
        ),
      },
      {
        title: "6. Disclaimer of Warranties",
        body: (
          <p>
            The Service is provided "as is" and "as available," without warranties of any kind,
            whether express or implied. We do not guarantee that the Service will run without
            interruption, be error-free, or be fully suitable for every purpose.
          </p>
        ),
      },
      {
        title: "7. Limitation of Liability",
        body: (
          <p>
            To the maximum extent permitted by law, CVCEC is not liable for any indirect,
            incidental, or consequential damages arising from use of, or inability to use, the
            Service. The Service is provided free of charge for non-profit educational purposes.
          </p>
        ),
      },
      {
        title: "8. Changes to These Terms",
        body: (
          <p>
            We may update these Terms from time to time. The date of the latest update is shown at
            the top of this page. Continuing to use the Service after changes take effect means you
            accept the updated Terms.
          </p>
        ),
      },
      {
        title: "9. Contact",
        body: (
          <p>
            If you have questions about these Terms, please contact:{" "}
            <TextLink href="mailto:contact@cvcec.org">contact@cvcec.org</TextLink>.
          </p>
        ),
      },
    ],
  },
};
