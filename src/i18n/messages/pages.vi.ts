// Prose for the static information pages. Kept out of vi.ts for length; `pages.en.ts` mirrors
// it. Inline markup is rendered by <Rich>: **bold** and [label](href).

const pagesVi = {
  guide: {
    title: "Hướng dẫn sử dụng",
    steps: [
      {
        title: "Tạo tài khoản",
        body: "Nhấn nút **Đăng nhập** ở góc trên bên phải, rồi đăng ký bằng email hoặc đăng nhập nhanh bằng tài khoản Google. Phụ huynh nên tạo tài khoản và đồng hành cùng con trong quá trình học.",
      },
      {
        title: "Học bảng chữ cái",
        body: "Vào mục [Bảng chữ cái](/hoc-tap/bang-chu-cai) để làm quen với các chữ cái tiếng Việt qua hình ảnh và âm thanh. Nhấn vào mỗi chữ để nghe cách phát âm chuẩn.",
      },
      {
        title: "Làm bài học theo chủ đề",
        body: "Trong mục [Học tập](/hoc-tap), các bài học được sắp xếp theo chủ đề và mức độ. Bé hoàn thành từng bài để mở khoá bài tiếp theo và nhận điểm.",
      },
      {
        title: "Luyện nói",
        body: "Tính năng [Luyện nói](/hoc-tap/luyen-noi) dùng micro của thiết bị để bé tập phát âm và được chấm điểm ngay lập tức. Hãy cho phép trình duyệt sử dụng micro khi được hỏi. Giọng nói không được ghi âm hay lưu trữ.",
      },
      {
        title: "Theo dõi tiến trình",
        body: "Bé tích luỹ điểm và leo lên [bảng xếp hạng](/bang-xep-hang). Vào trang cá nhân để xem lại thành tích và chuỗi ngày học của bé.",
      },
    ],
    help: "Gặp khó khăn khi sử dụng? Xem [Câu hỏi thường gặp](/cau-hoi-thuong-gap) hoặc [liên hệ với chúng tôi](/lien-he).",
  },

  faq: {
    title: "Câu hỏi thường gặp",
    items: [
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
        a: "Không. Giọng nói được xử lý ngay trên trình duyệt để chấm điểm phát âm và **không được ghi âm, lưu trữ hay gửi lên máy chủ** của chúng tôi. Xem thêm tại [Chính sách bảo mật](/chinh-sach-bao-mat).",
      },
      {
        q: "Tôi có cần đăng nhập để học không?",
        a: "Bạn có thể xem một số nội dung mà không cần đăng nhập, nhưng cần tài khoản để lưu tiến trình học và tham gia bảng xếp hạng.",
      },
      {
        q: "Làm sao để xoá tài khoản và dữ liệu?",
        a: "Bạn có thể xoá tài khoản ngay trong phần cài đặt tài khoản, hoặc liên hệ chúng tôi qua [contact@cvcec.org](mailto:contact@cvcec.org).",
      },
      {
        q: "Tôi gặp lỗi hoặc cần hỗ trợ thì làm thế nào?",
        a: "Hãy ghé trang [Liên hệ](/lien-he) để gửi thắc mắc. Chúng tôi luôn sẵn lòng hỗ trợ bạn và bé.",
      },
    ],
  },

  contact: {
    title: "Liên hệ",
    intro:
      "Trường Tiếng Việt Của Em được vận hành bởi [Canada Vietnam Cultural & Educational Council (CVCEC)](https://www.cvcec.org/). Nếu bạn có câu hỏi, góp ý hoặc mong muốn hợp tác, hãy liên hệ với chúng tôi qua các kênh dưới đây.",
    email: "Email",
    whatsapp: "WhatsApp",
    address: "Địa chỉ",
    follow: "Theo dõi chúng tôi",
  },

  // Legal pages: each section is a run of blocks, a paragraph ({ p }) or a bullet list ({ ul }).
  legal: {
    lastUpdated: (date: string) => `Cập nhật lần cuối: ${date}`,
  },

  terms: {
    title: "Điều khoản sử dụng",
    intro:
      'Chào mừng bạn đến với Trường Tiếng Việt Của Em ("Dịch vụ"), được vận hành bởi **Canada Vietnam Cultural & Educational Council (CVCEC)**. Bằng việc tạo tài khoản hoặc sử dụng Dịch vụ, bạn (hoặc phụ huynh/người giám hộ thay mặt trẻ em) đồng ý với các điều khoản dưới đây. Vui lòng đọc kỹ trước khi sử dụng.',
    sections: [
      {
        title: "1. Đối tượng sử dụng",
        blocks: [
          {
            p: "Dịch vụ được thiết kế dành cho trẻ em học tiếng Việt. Nếu người dùng dưới độ tuổi được pháp luật nơi cư trú cho phép tự đồng ý sử dụng dịch vụ trực tuyến, việc tạo và sử dụng tài khoản phải được thực hiện bởi hoặc dưới sự giám sát/đồng ý của phụ huynh hoặc người giám hộ hợp pháp. Phụ huynh chịu trách nhiệm về hoạt động trong tài khoản của con em mình.",
          },
        ],
      },
      {
        title: "2. Tài khoản",
        blocks: [
          {
            p: "Bạn cần cung cấp thông tin chính xác khi đăng ký (email hoặc đăng nhập bằng Google). Bạn có trách nhiệm bảo mật thông tin đăng nhập của mình. Chúng tôi có quyền tạm ngưng hoặc chấm dứt tài khoản vi phạm các điều khoản này, có hành vi gian lận, hoặc gây hại đến Dịch vụ hay người dùng khác.",
          },
          {
            p: "Bạn có thể xoá tài khoản bất kỳ lúc nào thông qua tính năng xoá tài khoản trong phần cài đặt; việc này sẽ xoá vĩnh viễn dữ liệu liên quan theo Chính sách bảo mật của chúng tôi.",
          },
        ],
      },
      {
        title: "3. Nội dung và hành vi của người dùng",
        blocks: [
          {
            p: "Khi sử dụng Dịch vụ (ví dụ: đặt tên hiển thị, tải ảnh đại diện), bạn đồng ý không:",
          },
          {
            ul: [
              "Đăng tải nội dung tục tĩu, bạo lực, phân biệt đối xử, hoặc không phù hợp với trẻ em.",
              "Mạo danh người khác hoặc cung cấp thông tin sai lệch.",
              "Sử dụng tên thật, thông tin liên hệ, hoặc hình ảnh nhận diện của trẻ làm tên hiển thị/ảnh đại diện công khai.",
              "Cố gắng truy cập trái phép hệ thống, can thiệp vào hoạt động của Dịch vụ, hoặc thu thập dữ liệu người dùng khác.",
            ],
          },
          {
            p: "Chúng tôi có quyền xoá nội dung vi phạm và/hoặc khoá tài khoản liên quan mà không cần báo trước.",
          },
        ],
      },
      {
        title: "4. Nội dung học tập và quyền sở hữu trí tuệ",
        blocks: [
          {
            p: "Toàn bộ nội dung bài học, hình ảnh, âm thanh, biểu tượng, mã nguồn và thiết kế của Dịch vụ thuộc quyền sở hữu của CVCEC hoặc bên cấp phép, được bảo vệ bởi luật bản quyền. Bạn được cấp quyền sử dụng cá nhân, phi thương mại đối với nội dung học tập trong phạm vi phục vụ việc học tiếng Việt của bạn/con em bạn. Bạn không được sao chép, phân phối lại, hoặc khai thác thương mại nội dung mà không có sự cho phép bằng văn bản.",
          },
        ],
      },
      {
        title: "5. Dịch vụ bên thứ ba",
        blocks: [
          {
            p: "Dịch vụ sử dụng các nhà cung cấp hạ tầng bên thứ ba (bao gồm Supabase, Cloudflare, và Google) để xác thực tài khoản, lưu trữ dữ liệu và tổng hợp giọng nói. Việc sử dụng các dịch vụ này cũng chịu sự điều chỉnh của điều khoản riêng của các bên đó.",
          },
        ],
      },
      {
        title: "6. Miễn trừ bảo đảm",
        blocks: [
          {
            p: 'Dịch vụ được cung cấp "nguyên trạng" ("as is") và "trong khả năng sẵn có" ("as available"), không có bất kỳ bảo đảm nào, dù rõ ràng hay ngụ ý. Chúng tôi không đảm bảo Dịch vụ sẽ hoạt động liên tục, không lỗi, hoặc phù hợp tuyệt đối với mọi mục đích sử dụng.',
          },
        ],
      },
      {
        title: "7. Giới hạn trách nhiệm",
        blocks: [
          {
            p: "Trong phạm vi tối đa được pháp luật cho phép, CVCEC không chịu trách nhiệm đối với các thiệt hại gián tiếp, ngẫu nhiên, hoặc hệ quả phát sinh từ việc sử dụng hoặc không thể sử dụng Dịch vụ. Dịch vụ được cung cấp miễn phí với mục đích giáo dục phi lợi nhuận.",
          },
        ],
      },
      {
        title: "8. Thay đổi điều khoản",
        blocks: [
          {
            p: "Chúng tôi có thể cập nhật các điều khoản này theo thời gian. Ngày cập nhật gần nhất được hiển thị ở đầu trang. Việc tiếp tục sử dụng Dịch vụ sau khi thay đổi có hiệu lực đồng nghĩa với việc bạn chấp nhận các điều khoản đã cập nhật.",
          },
        ],
      },
      {
        title: "9. Liên hệ",
        blocks: [
          {
            p: "Nếu bạn có câu hỏi về các điều khoản này, vui lòng liên hệ: [contact@cvcec.org](mailto:contact@cvcec.org).",
          },
        ],
      },
    ],
  },

  privacy: {
    title: "Chính sách bảo mật",
    intro:
      'Trường Tiếng Việt Của Em ("chúng tôi", "Dịch vụ") được vận hành bởi **Canada Vietnam Cultural & Educational Council (CVCEC)**. Chính sách này giải thích chúng tôi thu thập, sử dụng và bảo vệ thông tin gì khi bạn hoặc con em bạn sử dụng nền tảng học tiếng Việt của chúng tôi. Dịch vụ này hướng đến trẻ em, vì vậy chúng tôi thiết kế việc thu thập dữ liệu ở mức tối thiểu cần thiết và đặc biệt chú trọng đến sự riêng tư của trẻ.',
    sections: [
      {
        title: "1. Thông tin chúng tôi thu thập",
        blocks: [
          {
            p: "**Thông tin tài khoản.** Khi phụ huynh hoặc học sinh tạo tài khoản, chúng tôi thu thập địa chỉ email và mật khẩu (được mã hoá), hoặc thông tin cơ bản từ tài khoản Google nếu bạn đăng nhập bằng Google (tên hiển thị, email, ảnh đại diện công khai).",
          },
          {
            p: "**Hồ sơ học tập.** Tên hiển thị/biệt danh, ảnh đại diện (emoji hoặc ảnh do người dùng tải lên), quốc gia, và tiến trình học tập (bài đã hoàn thành, điểm số, chuỗi ngày học, vị trí trên bảng xếp hạng).",
          },
          {
            p: "**Luyện nói.** Tính năng luyện nói sử dụng micro của thiết bị để nhận dạng giọng nói ngay trên trình duyệt (Web Speech API). Âm thanh giọng nói của học sinh chỉ được xử lý tạm thời để chấm điểm phát âm và **không được ghi âm, lưu trữ hay gửi lên máy chủ của chúng tôi**.",
          },
          {
            p: "**Dữ liệu kỹ thuật.** Chúng tôi có thể ghi nhận thông tin kỹ thuật cơ bản (loại trình duyệt, nhật ký lỗi) nhằm duy trì hoạt động và bảo mật của Dịch vụ.",
          },
        ],
      },
      {
        title: "2. Cách chúng tôi sử dụng thông tin",
        blocks: [
          {
            ul: [
              "Cung cấp, duy trì và cá nhân hoá trải nghiệm học tập.",
              "Lưu và hiển thị tiến trình học tập, thành tích, bảng xếp hạng.",
              "Liên hệ với phụ huynh về tài khoản, hỗ trợ kỹ thuật, hoặc thay đổi chính sách.",
              "Bảo vệ Dịch vụ khỏi gian lận, lạm dụng và truy cập trái phép.",
            ],
          },
          {
            p: "Chúng tôi **không** bán dữ liệu cá nhân, không sử dụng dữ liệu của trẻ em để quảng cáo hướng đối tượng (behavioral advertising), và không sử dụng dữ liệu học tập cho mục đích nào ngoài việc vận hành Dịch vụ.",
          },
        ],
      },
      {
        title: "3. Đăng nhập bằng Google",
        blocks: [
          {
            p: "Nếu bạn chọn đăng nhập bằng Google, chúng tôi chỉ nhận thông tin cơ bản do Google cung cấp (tên, email, ảnh đại diện) để tạo và xác thực tài khoản. Chúng tôi không truy cập vào các dữ liệu Google khác (Gmail, Drive, danh bạ, v.v.). Bạn có thể thu hồi quyền truy cập này bất kỳ lúc nào tại [trang quản lý ứng dụng của tài khoản Google](https://myaccount.google.com/permissions).",
          },
        ],
      },
      {
        title: "4. Lưu trữ và bảo mật dữ liệu",
        blocks: [
          {
            p: "Dữ liệu tài khoản và tiến trình học tập được lưu trữ trên hạ tầng của Supabase (cơ sở dữ liệu, xác thực) và Cloudflare R2 (lưu trữ tệp như ảnh đại diện, âm thanh bài học). Chúng tôi áp dụng các biện pháp kỹ thuật hợp lý (mã hoá khi truyền tải, kiểm soát truy cập theo hàng dữ liệu) để bảo vệ thông tin khỏi truy cập trái phép.",
          },
          {
            p: "Không có phương thức truyền tải hoặc lưu trữ điện tử nào an toàn tuyệt đối; chúng tôi nỗ lực bảo vệ dữ liệu nhưng không thể đảm bảo an toàn tuyệt đối.",
          },
        ],
      },
      {
        title: "5. Quyền riêng tư của trẻ em",
        blocks: [
          {
            p: "Trường Tiếng Việt Của Em được thiết kế dành cho trẻ em học tiếng Việt, thường với sự đồng hành của phụ huynh. Chúng tôi:",
          },
          {
            ul: [
              "Chỉ thu thập thông tin tối thiểu cần thiết để vận hành tính năng học tập (không thu thập địa chỉ nhà, số điện thoại, hay dữ liệu định vị).",
              "Không hiển thị quảng cáo của bên thứ ba trong Dịch vụ.",
              "Không theo dõi hành vi trẻ em giữa các trang web/ứng dụng khác để quảng cáo.",
              "Cho phép phụ huynh xem, chỉnh sửa hoặc yêu cầu xoá thông tin tài khoản của con em mình bất kỳ lúc nào (xem mục 7).",
            ],
          },
          {
            p: "Nếu bạn là phụ huynh/người giám hộ và tin rằng con bạn đã cung cấp thông tin cá nhân mà không có sự đồng ý của bạn, vui lòng liên hệ chúng tôi theo mục 8 để chúng tôi xử lý và xoá thông tin đó.",
          },
        ],
      },
      {
        title: "6. Chia sẻ thông tin",
        blocks: [
          {
            p: "Chúng tôi không bán hoặc cho thuê dữ liệu cá nhân. Thông tin chỉ được chia sẻ với:",
          },
          {
            ul: [
              "Nhà cung cấp hạ tầng kỹ thuật (Supabase, Cloudflare, Google Cloud text-to-speech), chỉ trong phạm vi cần thiết để vận hành Dịch vụ.",
              "Cơ quan pháp luật, nếu được yêu cầu theo quy định pháp luật hiện hành.",
            ],
          },
          {
            p: "Tên hiển thị và điểm số trên **bảng xếp hạng** có thể hiển thị công khai cho người dùng khác trong Dịch vụ; chúng tôi khuyến khích phụ huynh không sử dụng tên thật của trẻ làm tên hiển thị.",
          },
        ],
      },
      {
        title: "7. Quyền của bạn",
        blocks: [
          {
            ul: [
              "Truy cập, chỉnh sửa thông tin hồ sơ bất kỳ lúc nào trong phần cài đặt tài khoản.",
              "Yêu cầu xoá tài khoản và toàn bộ dữ liệu liên quan (có sẵn tính năng xoá tài khoản trong ứng dụng).",
              "Yêu cầu xuất hoặc cung cấp bản sao dữ liệu cá nhân của bạn.",
              "Rút lại sự đồng ý đã cung cấp bất kỳ lúc nào bằng cách liên hệ chúng tôi.",
            ],
          },
        ],
      },
      {
        title: "8. Liên hệ",
        blocks: [
          {
            p: "Nếu bạn có câu hỏi về chính sách bảo mật này hoặc muốn thực hiện các quyền nêu trên, vui lòng liên hệ: [contact@cvcec.org](mailto:contact@cvcec.org).",
          },
        ],
      },
      {
        title: "9. Thay đổi chính sách",
        blocks: [
          {
            p: "Chúng tôi có thể cập nhật chính sách này theo thời gian. Ngày cập nhật gần nhất được hiển thị ở đầu trang. Các thay đổi quan trọng sẽ được thông báo qua email hoặc thông báo trong ứng dụng.",
          },
        ],
      },
    ],
  },
} as const;

export default pagesVi;
