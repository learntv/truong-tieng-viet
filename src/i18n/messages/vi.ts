// Source of truth for interface copy. `en.ts` is typed against this file, so every key added
// here has to be added there too or `tsc` fails. Learning content (lessons, vocabulary, topic
// and place names) does not belong here: it stays Vietnamese in both locales.

import pagesVi from "./pages.vi";

const vi = {
  pages: pagesVi,

  site: {
    name: "Trường Tiếng Việt Của Em",
  },

  common: {
    close: "Đóng",
  },

  lang: {
    label: "Ngôn ngữ",
    vi: "Tiếng Việt",
    en: "English",
  },

  nav: {
    home: "Trang chủ",
    learn: "Học tập",
    myCorner: "Góc của em",
    leaderboard: "Xếp hạng",
    signIn: "Đăng nhập",
    signOut: "Đăng xuất",
    profile: "Trang cá nhân",
    report: "Báo cáo",
    studentFallback: "Học sinh",
    avatarAlt: "Ảnh đại diện",
    openMenu: "Mở menu",
    closeMenu: "Đóng menu",
    mainNav: "Điều hướng chính",
  },

  footer: {
    blurb: "Nền tảng học tiếng Việt dành cho trẻ em Việt Nam ở trong và ngoài nước.",
    ministryAlt: "Bộ Ngoại giao",
    aboutTitle: "Về chúng tôi",
    learnTitle: "Học tập",
    policyTitle: "Chính sách",
    links: {
      about: "Giới thiệu",
      guide: "Hướng dẫn sử dụng",
      faq: "Câu hỏi thường gặp",
      contact: "Liên hệ",
      alphabet: "Bảng chữ cái",
      lessons: "Bài học",
      speaking: "Luyện nói",
      leaderboard: "Bảng xếp hạng",
      terms: "Điều khoản sử dụng",
      privacy: "Chính sách bảo mật",
    },
    copyright: (year: number, siteName: string) =>
      `© ${year} ${siteName}. Tất cả quyền được bảo lưu.`,
  },

  errors: {
    genericTitle: "Trang này chưa tải được",
    genericBody: "Có lỗi xảy ra từ phía chúng tôi. Em hãy thử tải lại, hoặc quay về trang chủ nhé.",
    retry: "Thử lại",
    backHome: "Về trang chủ",
    notFoundTitle: "Không tìm thấy trang",
    notFoundBody: "Trang em tìm không tồn tại hoặc đã được chuyển đi nơi khác.",
  },

  auth: {
    loginTab: "Đăng nhập",
    registerTab: "Đăng ký",
    loginHeading: "Chào em trở lại!",
    registerHeading: "Tạo tài khoản",
    intro: "Đăng nhập để lưu tiến độ học tập của em.",
    backHomeLabel: "Về trang chủ",
    google: "Tiếp tục với Google",
    or: "hoặc",
    email: "Email",
    emailPlaceholder: "em@example.com",
    password: "Mật khẩu",
    forgotPassword: "Quên mật khẩu?",
    submitLogin: "Đăng nhập",
    submitRegister: "Đăng ký",
    invalidEmail: "Email không hợp lệ",
    passwordTooShort: "Mật khẩu tối thiểu 6 ký tự",
    loginFailed: "Đăng nhập thất bại",
    loginSuccess: "Đăng nhập thành công!",
    registerFailed: "Đăng ký thất bại",
    registerCheckEmail: "Kiểm tra email để xác nhận tài khoản!",
    googleFailed: "Không thể kết nối Google",
    forgotBack: "Quay lại",
    forgotIntro: "Nhập email của bạn và chúng tôi sẽ gửi liên kết đặt lại mật khẩu.",
    forgotSubmit: "Gửi email đặt lại mật khẩu",
    forgotSendFailed: "Không gửi được email",
    forgotSent: "Email đặt lại mật khẩu đã được gửi. Kiểm tra hộp thư của bạn.",
    forgotBackToLogin: "Quay lại đăng nhập",
  },

  resetPassword: {
    heading: "Đặt lại mật khẩu",
    intro: "Nhập mật khẩu mới cho tài khoản của bạn.",
    newPassword: "Mật khẩu mới",
    confirmPassword: "Xác nhận mật khẩu",
    submit: "Cập nhật mật khẩu",
    mismatch: "Mật khẩu không khớp",
    invalidLink: "Liên kết không hợp lệ hoặc đã hết hạn.",
    failed: "Không thể đặt lại mật khẩu",
    success: "Mật khẩu đã được cập nhật!",
  },

  profileSetup: {
    title: "Chào mừng! 🎉",
    intro: "Hãy tạo hồ sơ của em nhé",
    googleAvatar: "Bọn mình sẽ dùng ảnh đại diện Google của em nhé 👍",
    pickAvatar: "Chọn avatar của em",
    name: "Tên của em",
    namePlaceholder: "Nhập tên...",
    nameRequired: "Hãy nhập tên của em nhé!",
    where: "Em đang ở đâu?",
    pickCountry: "Chọn quốc gia...",
    search: "Tìm kiếm...",
    noResults: "Không tìm thấy",
    start: "Bắt đầu học! 🚀",
    saveFailed: "Không thể lưu hồ sơ",
  },

  home: {
    curtain: {
      label: "Vén màn khai trương",
      tap: "CHẠM ĐỂ VÉN MÀN",
    },
    gallery: {
      beGioTheCo: "Em bé mặc áo dài đỏ giơ cao thẻ cờ Việt Nam",
      coGiaoKhaiMac:
        "Cô giáo cầm thẻ cờ Việt Nam trong buổi khai mạc lớp tiếng Việt tương tác, dịp Giỗ Tổ Hùng Vương",
      caLopChupChung:
        "Cô giáo, tình nguyện viên và các em học sinh mặc áo dài chụp ảnh chung, tay cầm sách tiếng Việt",
      ghepTheDayLa: "Các em nhỏ chơi ghép thẻ từ vựng “Đây là” quanh bàn",
      lopHocTuongTac: "Học sinh, tình nguyện viên và phụ huynh trong buổi học tiếng Việt tương tác",
      timTheNguoiThan: "Các em cùng tìm thẻ hình người thân trên bàn",
      choiTheTuVung: "Nhóm học sinh cúi xem thẻ từ vựng trải trên bàn",
    },
    mission: {
      ribbon: "Sứ mệnh của dự án",
      title: "Giúp mọi trẻ em kiều bào **giữ tiếng Việt**, miễn phí",
      slides: {
        pei1: "Lớp Cô Hà, PEI, Canada: các em làm bài tập tiếng Việt quanh bàn",
        pei2: "Lớp Cô Hà, PEI, Canada: các em chăm chú viết bài",
        pei3: "Lớp Cô Hà, PEI, Canada: cả lớp ngồi học quanh bàn dài",
        pei4: "Lớp Cô Hà, PEI, Canada: giày dép của các em xếp ở cửa lớp",
        toronto1: "Lớp Cô Trang, Toronto, Canada: cô giáo và các em mặc áo dài trong lớp",
        toronto2: "Lớp Cô Trang, Toronto, Canada: các em chơi ghép thẻ “Đây là”",
        toronto3: "Lớp Cô Trang, Toronto, Canada: các em tìm thẻ hình trên bàn",
        toronto4:
          "Lớp Cô Trang, Toronto, Canada: cô giáo, tình nguyện viên và các em chụp ảnh chung",
        toronto5: "Lớp Cô Trang, Toronto, Canada: thẻ từ vựng “Đây là” và lá cờ Việt Nam",
        toronto6: "Lớp Cô Trang, Toronto, Canada: buổi học tiếng Việt tương tác",
        toronto7: "Lớp Cô Trang, Toronto, Canada: em bé giơ cao thẻ cờ Việt Nam",
      },
    },
    press: {
      ribbon: "Tin tức",
      title: "Báo chí viết về chúng tôi",
      lede: "Nền tảng học tiếng Việt, các lớp học, tủ sách và hoạt động của **Hội đồng Văn hóa Giáo dục Canada–Việt Nam** qua góc nhìn của báo chí trong nước.",
      readArticle: "Đọc bài",
      videoFailed:
        "Không phát được video ở đây. Em có thể xem bản gốc trên trang của Thông tấn xã Việt Nam.",
      watchOnVna: "Xem trên VNA",
      playVideo: (title: string) => `Phát video: ${title}`,
      readOriginal: "Xem bài gốc",
    },
    about: {
      title: "Giới thiệu",
      partnerHeading: "Đồng hành chuyên môn",
      partnerBody:
        "Dự án thực hiện dưới sự đồng hành và ủng hộ của **Ủy ban Nhà nước về người Việt Nam ở nước ngoài – Bộ Ngoại giao**.",
      digitizeHeading: "Dự án số hóa",
      digitizeBody:
        "Số hóa hai cuốn sách của **NXB ĐH Sư Phạm TP Hồ Chí Minh**, trong khuôn khổ Chương trình Tôn vinh tiếng Việt trong cộng đồng người Việt Nam ở nước ngoài do **UBNVONN – Bộ Ngoại giao** phát động.",
      ecosystemHeading: "Hệ sinh thái",
      ecosystemBody:
        "Dự án là thành viên tích cực của **Mạng lưới các cơ sở giảng dạy tiếng Việt và văn hóa Việt Nam ở nước ngoài**.",
      copyrightHeading: "Bản quyền",
      copyrightBody:
        "Được bảo hộ bản quyền bởi đồng tác giả: Phan Thị Quỳnh Trang, Nguyễn Trần Thanh Hải, Đỗ Thị Phương Mai, Trần Thanh Phúc, Trần Văn Nhật.",
    },
    thanks: {
      title: "Lời cảm ơn",
      body: 'Ban quản lý dự án xin được gửi lời cảm ơn chân thành tới **Ủy ban Nhà nước về người Việt Nam ở nước ngoài – Bộ Ngoại giao** nước Cộng hòa xã hội chủ nghĩa Việt Nam đã luôn đồng hành và định hướng. Chúng tôi xin gửi lời tri ân sâu sắc tới các Đại sứ quán, các cơ quan ban ngành tại Việt Nam và Canada, cùng Mạng lưới giảng dạy tiếng Việt đã tạo điều kiện và hỗ trợ quý báu để dự án **"Trường Tiếng Việt Của Em"** được hoàn thiện và đi vào vận hành. Sự đồng hành của quý vị là nguồn động lực to lớn giúp chúng tôi gìn giữ và lan tỏa ngôn ngữ, văn hóa Việt đến với thế hệ trẻ tại Canada nói riêng và trên toàn thế giới nói chung.',
      signature: "Ban quản lý dự án",
    },
    support: {
      title: "Kêu gọi hỗ trợ",
      heading: "Đồng hành để giữ tiếng Việt cho mọi em nhỏ.",
      body: '**"Trường Tiếng Việt Của Em"** là dự án phi lợi nhuận. Dự án luôn rộng mở đón nhận sự đồng hành, đóng góp và tài trợ từ các bậc phụ huynh, kiều bào và các mạnh thường quân. Mỗi sự đóng góp – dù là nhỏ nhất – đều quý báu.',
      email: "Email",
      phone: "Điện thoại",
      copied: (value: string) => `Đã sao chép: ${value}`,
      copyFailed: "Không thể sao chép",
      copy: (label: string) => `Sao chép ${label}`,
      pointsHeading: "Đóng góp của bạn giúp",
      freeHeading: "Giữ toàn bộ chương trình miễn phí",
      freeBody: "40+ bài học trải khắp 8 chủ đề, mở cho mọi em nhỏ, trọn đời, không thu phí.",
      contentHeading: "Số hóa thêm nội dung mới",
      contentBody: "Tiếp nối bộ sách Vui học Tiếng Việt của NXB ĐH Sư Phạm TP Hồ Chí Minh.",
      speakingHeading: "Nuôi dưỡng phần luyện nói",
      speakingBody: "Hình ảnh, âm thanh, trò chơi và ghi âm để các em nói tiếng Việt tự tin hơn.",
      thankYou: "Xin chân thành cảm ơn!",
    },
    closing: {
      title: "Học tiếng Việt mọi lúc, mọi nơi",
      lede: "Trâu con đội nón lá đã sẵn sàng. Mở bài học đầu tiên và bắt đầu hành trình của em.",
      learnNow: "Học ngay",
      speaking: "Luyện nói",
    },
  },

  mascot: {
    cheer: "Trâu con reo mừng",
    crying: "Trâu con đang khóc",
    flying: "Trâu con bay lên",
    hiking: "Trâu con đi leo núi",
    listening: "Trâu con đang lắng nghe",
    peeking: "Trâu con ló đầu ra",
    "peeking-over": "Trâu con ló đầu lên nhìn",
    reading: "Trâu con đang đọc sách",
    "reading-sitting": "Trâu con ngồi đọc sách",
    thinking: "Trâu con đang suy nghĩ",
    "thumbs-up": "Trâu con giơ ngón tay cái",
    wave: "Trâu con vẫy tay chào",
  },

  hocTap: {
    heading: "Em muốn học gì hôm nay?",
    crumb: "Học tập",
    byBook: "Học theo sách",
    practice: "Luyện thêm",
    enter: "Vào học",
    bookTitle: (n: string) => `Quyển ${n}`,
    bookBody: (n: string) => `Vui học Tiếng Việt, quyển ${n}, NXB ĐH Sư Phạm TP Hồ Chí Minh`,
    tapVietTitle: "Tập viết",
    tapVietBody: "Tô chữ theo nét trên trang vở.",
    kmdTitle: "Khai Minh Đức",
    kmdBody: "Đánh vần từng âm, từng vần.",
    luyenNoiTitle: "Luyện nói",
    luyenNoiBody: "Nghe cô đọc mẫu rồi nói theo nhé.",
    bangChuCaiTitle: "Bảng chữ cái",
    bangChuCaiBody: "Gặp bạn thú và nghe cách đọc từng chữ.",
    noData: "Chưa có dữ liệu bài học.",
    finishedAll: "🎉 Em đã hoàn thành cả lộ trình! Em giỏi lắm!",
    reviewAgain: "Ôn tập lại",
  },

  learning: {
    // Roadmap (one chủ đề's chặng list)
    breadcrumb: "Đường dẫn",
    comingSoon: "Sắp có",
    startLearning: "Bắt đầu học",
    continueLearning: "Tiếp tục học",
    reviewAgain: "Ôn tập lại",
    stagesDone: (done: number, total: number) => `${done}/${total} chặng đã hoàn thành`,
    topicInProgress:
      "Các cô đang biên soạn chủ đề này. Em quay lại chủ đề trước để luyện tập trong lúc chờ nhé!",
    backToMap: "Về bản đồ",
    topicHeading: (name: string) => `Chủ đề: ${name}`,
    topicTitle: (n: number, name: string) => `Chủ đề ${n}: ${name}`,
    topicN: (n: number) => `Chủ đề ${n}`,
    stageN: (n: number) => `Chặng ${n}`,
    lessonsCount: (n: number) => `${n} bài học`,
    studying: "Đang học",
    completed: "Đã hoàn thành",
    inProgress: (current: number, total: number) => `Đang học: ${current}/${total} bài`,
    notStarted: "Chưa bắt đầu",
    review: "Ôn tập",
    continue: "Tiếp tục",
    start: "Bắt đầu",

    // Overworld map
    backToLearn: "Quay lại học tập",
    mapHint: "Mỗi địa danh là một chủ đề. Chạm vào địa danh để vừa khám phá vừa học nhé!",
    replayTutorial: "Xem lại hướng dẫn",
    mapAlt: "Bản đồ Việt Nam với các địa danh",
    topicsDone: (done: number, total: number) => `${done}/${total} chủ đề`,
    pinStatus: {
      completed: "đã hoàn thành",
      current: "đang học",
      "coming-soon": "sắp có",
      locked: "chưa mở khoá",
    },
    pinComingSoon:
      "Các cô đang biên soạn chủ đề này. Em học các chủ đề trước trong lúc chờ nhé! ✨",
    pinLocked: "Em hoàn thành chủ đề trước để mở khoá địa danh này nhé! ✨",
    stagesCount: (done: number, total: number) => `${done}/${total} chặng`,
    explore: "Khám phá ngay",
    tutorialLabel: "Cách học ba bước",
    tutorialAlt: "Ba bước học: 1. Khám phá địa danh, 2. Hoàn thành bài học, 3. Nhận con dấu",
    tutorialDone: "Em đã hiểu",

    // Lesson page
    backToMapLabel: "Quay lại bản đồ",
    stop: "Dừng",
    listen: "Nghe",
    listenTo: (text: string) => `Nghe đọc: ${text}`,
    videoFallback: "Video không phát được? Mở trên YouTube",
    imageFallbackAlt: "Hình minh họa",
    imageFailed: "(Không tải được hình)",
    stageProgress: "Tiến độ chặng",
    prevStage: "Chặng trước",
    nextStage: "Chặng kế tiếp",
    stageOf: (n: number, count: number, title: string) => `Chặng ${n}/${count}: ${title}`,
    slideDone: "Đã học",
    slideTodo: "Chưa học",
    pageN: (n: number) => `Trang ${n}`,
    pageOf: (n: number, total: number) => `Trang ${n} / ${total}`,
    notFoundTitle: "Không tìm thấy bài học",
    notFoundBody: "Chặng học này không tồn tại hoặc đã bị xóa.",
    backToRoadmap: "Quay lại lộ trình",
    stageComplete: (n: number) => `Chặng ${n} hoàn thành! 🎉`,
    keepItUp: "Tiếp tục giỏi nhé!",
    hideLessonList: "Ẩn danh sách bài",
    showLessonList: "Hiện danh sách bài",
    lessonList: "Danh sách bài",
    contentComing: "Nội dung đang được cập nhật.",
    prevLesson: "Bài trước",
    finish: "Hoàn thành",
    close: "Đóng",
    nextLesson: "Bài kế tiếp",
    hint: "Gợi ý",
    hintFor: (label: string) => `Gợi ý: ${label}`,
  },

  alphabet: {
    title: "Bảng chữ cái",
    explored: "Đã khám phá",
    lettersCount: (seen: number, total: number) => `${seen}/${total} chữ`,
    downloadPdf: "Tải PDF bảng chữ cái",
    seen: "Đã xem",
    animalAlt: (letter: string) => `Bạn thú chữ ${letter}`,
    listenLetter: (letter: string) => `Nghe đọc chữ ${letter}`,
  },

  tapViet: {
    title: "Tập viết",
    intro: "Xem cô viết mẫu, rồi em lấy ngón tay tô theo nhé!",
    tabsLabel: "Chọn bài tập viết",
    categories: {
      net: "Nét cơ bản",
      chu: "Chữ cái",
      ghep: "Chữ ghép",
      so: "Số và dấu",
    },
    watchLabel: "Xem cô viết",
    pause: "Tạm dừng",
    play: "Phát",
    replay: "Xem lại từ đầu",
    fast: "Chạy nhanh",
    traceLabel: "Em tô theo",
    traceArea: "Chỗ để em tô theo nét xám",
    clear: "Xoá",
    done: "Xong rồi",
    feedback: {
      3: "Giỏi quá! Em viết đẹp lắm!",
      2: "Tốt lắm! Gần giống mẫu rồi.",
      1: "Cố lên! Em tô sát nét xám hơn nhé.",
      0: "Em thử lại nhé, em làm được mà!",
    },
  },

  progress: {
    saveFailed: "Chưa lưu được tiến độ",
    saveFailedHint: "Em kiểm tra kết nối mạng rồi thử lại nhé!",
    mergeFailed: "Một phần tiến độ cũ chưa lưu được vào tài khoản",
    mergeFailedHint: "Em kiểm tra mạng rồi tải lại trang nhé!",
  },

  speaking: {
    title: "Luyện nói",
    loadFailed: "Chưa tải được chủ đề luyện nói, em thử lại sau nhé!",
    topicNotFound: "Không tìm thấy chủ đề",
    topicNotFoundBody: "Chủ đề này không tồn tại hoặc đã bị đổi.",
    pickAnother: "Chọn chủ đề khác",
    noSentences: "Chủ đề này chưa có câu luyện",
    sentenceOf: (n: number, total: number) => `Câu ${n}/${total}`,
    imageAlt: "Hình minh họa",
    listenModel: "Nghe cô đọc",
    tooWrong: "Cô nghe không rõ, em thử lại nhé! 🌼",
    youSaid: "Con đã nói:",
    micDenied: "Micro chưa được bật. Không sao, em nghe cô đọc rồi đọc to theo nhé!",
    cantRecord: "Thiết bị này chưa ghi âm được. Em nghe cô đọc rồi đọc to theo nhé!",
    readAloud: "Em đã đọc to theo cô!",
    sameAsModel: "😊 Giống rồi!",
    prevSentence: "Câu trước",
    nextSentence: "Câu tiếp theo",
    stopRecording: "Dừng ghi âm",
    startRecording: "Bắt đầu ghi âm",
    listening: "Đang nghe em nói… bấm để xong",
    speakNow: "Em nói nào!",
    saveFailed: "Chưa lưu được tiến độ nói",
    saveFailedHint: "Em kiểm tra kết nối mạng rồi thử lại nhé!",
    mergeFailed: "Một phần tiến độ nói cũ chưa lưu được vào tài khoản",
    mergeFailedHint: "Em kiểm tra mạng rồi tải lại trang nhé!",
  },

  kmd: {
    title: "Khai Minh Đức",
    loadFailed: "Chưa tải được danh sách bài học, em thử lại sau nhé!",
    empty: "Chưa có bài học nào.",
    lessonN: (n: number) => `Bài ${n}`,
    notAvailable: "Bài học không có sẵn",
    notAvailableBody: "Bài học này không tồn tại.",
    viewList: "Xem danh sách bài học",
    backToList: "Danh sách bài học",
  },

  leaderboard: {
    title: "Bảng xếp hạng",
    empty: "Chưa có học sinh nào!",
    emptyHint: "Hãy là người đầu tiên bắt đầu học nhé.",
    lessonsDone: (n: number) => `${n} bài xong`,
    lessonsDoneLabel: "bài xong",
    avatarOf: (name: string) => `Ảnh đại diện của ${name}`,
  },

  profile: {
    title: "Trang cá nhân",
    avatarSaveFailed: "Không thể lưu avatar",
    avatarSaved: "Đã lưu avatar!",
    avatarBadType: "Ảnh phải là JPG, PNG, WebP hoặc GIF",
    avatarTooBig: "Ảnh phải nhỏ hơn 2MB",
    signInAgain: "Em cần đăng nhập lại",
    uploadFailed: "Không thể tải ảnh lên",
    pickAvatar: "Chọn avatar của em 🎨",
    uploadPhoto: "Tải ảnh của em lên",
    uploadHint: "JPG, PNG, WebP hoặc GIF, tối đa 2MB",
    countrySaveFailed: "Không thể lưu quốc gia",
    countrySaved: "Đã lưu quốc gia!",
    pickCountry: "Chọn quốc gia của em 🌍",
    search: "Tìm kiếm...",
    noCountry: "Không tìm thấy quốc gia",
    accountDeleted: "Tài khoản đã được xóa. Tạm biệt em! 👋",
    deleteFailed: "Không thể xóa tài khoản",
    tryAgain: "Vui lòng thử lại.",
    nameSaved: "Đã lưu tên!",
    nameSaveFailed: "Không thể lưu tên",
    resetEmailFailed: "Không thể gửi email",
    resetEmailSent: "Email đặt lại mật khẩu đã được gửi! 📬",
    progressResetFailed: "Không thể xóa tiến độ",
    progressReset: "Tiến độ đã được đặt lại! Hãy bắt đầu lại nhé 🌱",
    changeAvatar: "Đổi avatar",
    changeName: "Đổi tên",
    pickCountryTitle: "Chọn quốc gia",
    memberSince: (date: string) => `Thành viên từ ${date}`,
    lessonsCompleted: "Bài hoàn thành",
    inProgress: "Đang học",
    streak: "Ngày liên tiếp",
    doneToday: "Hôm nay xong ✓",
    notToday: "Chưa học hôm nay",
    account: "Tài khoản",
    changePassword: "Đổi mật khẩu",
    restart: "Bắt đầu lại từ đầu",
    restartTitle: "Bắt đầu lại từ đầu? 🔄",
    restartBody:
      "Tất cả tiến độ học tập của em sẽ bị xóa và em sẽ bắt đầu lại từ bài đầu tiên. Tài khoản của em vẫn được giữ lại.",
    keep: "Thôi, giữ lại",
    restartConfirm: "Bắt đầu lại",
    deleteAccount: "Xóa tài khoản",
    deleteTitle: "Xóa tài khoản vĩnh viễn? ⚠️",
    // The word the child types to confirm. The check compares against this, so it must match
    // what deleteBody and deletePlaceholder ask for.
    deleteWord: "XÓA",
    deleteBody: (word: string) =>
      `Toàn bộ hồ sơ và tiến độ học tập của em sẽ bị xóa vĩnh viễn và không thể khôi phục. Hãy gõ **${word}** vào ô bên dưới để xác nhận.`,
    deletePlaceholder: (word: string) => `Gõ ${word} để xác nhận`,
    cancel: "Hủy",
    deleteForever: "Xóa vĩnh viễn",
    version: (siteName: string) => `Phiên bản 1.0 · ${siteName} 🇻🇳`,
    userNotFound: "Không tìm thấy người dùng",
    userNotFoundBody: (username: string) => `Hồ sơ **@${username}** không tồn tại.`,
  },

  dashboard: {
    title: "Báo cáo tác động xã hội",
    students: (count: string) => `${count} học sinh`,
    zoomIn: "Phóng to",
    zoomOut: "Thu nhỏ",
    resetView: "Đặt lại",
    less: "Ít hơn",
    more: "Nhiều hơn",
    total: (count: string) => `Tổng: ${count} học sinh`,
    totalShort: "Tổng",
    completed: "Đã hoàn thành",
    inProgress: "Đang học",
    justStarted: "Mới bắt đầu",
    loading: "Đang tải dữ liệu...",
    accounts: "Tài khoản",
    recentAdds: (n: number) => `+${n} kỳ gần nhất`,
    registered: "đã đăng ký",
    completedKpi: "Hoàn thành",
    rate: (pct: string) => `${pct}% tỷ lệ`,
    inProgressSub: "đang trong tiến trình",
    countries: "Quốc gia",
    withStudents: "có học sinh",
    growthTitle: "Tốc độ tăng trưởng người dùng",
    growthSub: "Tổng học sinh tích lũy theo thời gian đăng ký",
    monthly: "Tháng",
    weekly: "Tuần",
    monthLabel: (month: number, year: number) => `T${month}/${year}`,
    completionTitle: "Tỷ lệ hoàn thành",
    byCountryTitle: "Học sinh theo quốc gia",
    byCountrySub: (students: string, countries: number) =>
      `${students} học sinh tại ${countries} quốc gia`,
    topCountries: "Quốc gia dẫn đầu",

    // Student report
    reportTitle: "Báo Cáo Học Sinh",
    reportFailed: "Không tải được báo cáo học sinh. Vui lòng thử lại.",
    reportLoading: "Đang tải báo cáo học sinh…",
    totalStudents: "Tổng học sinh",
    activeWeek: "Hoạt động trong 7 ngày",
    needAttention: "Cần hỗ trợ",
    avgProgress: "Tiến độ TB (đã bắt đầu)",
    status: {
      completed: "Hoàn thành",
      active: "Đang học",
      attention: "Cần hỗ trợ",
      new: "Mới",
    },
    all: "Tất cả",
    neverActive: "Chưa hoạt động",
    today: "Hôm nay",
    yesterday: "Hôm qua",
    daysAgo: (n: number) => `${n} ngày trước`,
    monthsAgo: (n: number) => `${n} tháng trước`,
    yearsAgo: (n: number) => `${n} năm trước`,
    studentList: "Danh sách học sinh",
    studentListHint: "Nhấp tiêu đề cột để sắp xếp, lọc theo trạng thái để tìm em cần hỗ trợ.",
    searchPlaceholder: "Tìm theo tên, quốc gia…",
    colStudent: "Học sinh",
    colCountry: "Quốc gia",
    colProgress: "Tiến độ",
    colStars: "Sao nói",
    colActive: "Hoạt động",
    colStatus: "Trạng thái",
    stagesOf: (done: number, total: number) => `${done}/${total} chặng`,
    noMatches: "Không có học sinh nào khớp bộ lọc.",
    stuckTitle: "Chặng học sinh dễ mắc kẹt",
    stuckHint:
      "Tỷ lệ hoàn thành thấp nhất trong số các chặng đã có nhiều em bắt đầu, nơi nên xem lại nội dung hoặc hỗ trợ thêm.",
    completedWord: "hoàn thành",
    unfinished: (dropoff: number, reached: number) => `${dropoff} / ${reached} còn dở`,
  },

  comingSoon: {
    title: "Góc của em",
    description: "Mục này đang được xây dựng và sẽ sớm ra mắt các bạn nhỏ nhé! 👧✏️📝🧸✈️",
  },

  meta: {
    rootDescription: "Hành trình học tiếng Việt vui nhộn dành cho trẻ em kiều bào.",
    hocTap: {
      title: "Học tập",
      description:
        "Chọn lộ trình học, bảng chữ cái, luyện nói hoặc tập viết để bắt đầu học tiếng Việt cùng Trâu con.",
    },
    alphabet: {
      title: "Bảng chữ cái",
      description:
        "Khám phá bảng chữ cái tiếng Việt cùng các bạn thú vui nhộn: nghe phát âm và học từ mới.",
    },
    speaking: {
      title: "Luyện nói",
      description: "Luyện nói tiếng Việt cùng Trâu con: nghe mẫu, ghi âm và nhận sao khích lệ.",
    },
    speakingTopic: {
      title: (topic: string) => `Luyện nói: ${topic}`,
      description: (topic: string) =>
        `Luyện nói tiếng Việt theo chủ đề "${topic}": nghe câu mẫu, ghi âm và nhận sao khích lệ cùng Trâu con.`,
    },
    leaderboard: {
      title: "Bảng xếp hạng",
      description:
        "Xem bảng xếp hạng học sinh chăm chỉ nhất Trường Tiếng Việt Của Em và theo dõi tiến độ học tập.",
    },
    terms: {
      title: "Điều khoản sử dụng",
      description:
        "Điều khoản sử dụng của Trường Tiếng Việt Của Em: quyền và trách nhiệm khi sử dụng nền tảng học tiếng Việt.",
    },
    privacy: {
      title: "Chính sách bảo mật",
      description:
        "Chính sách bảo mật của Trường Tiếng Việt Của Em: dữ liệu chúng tôi thu thập, cách sử dụng, và quyền của phụ huynh/học sinh.",
      ogDescription: "Dữ liệu chúng tôi thu thập, cách sử dụng, và quyền của phụ huynh/học sinh.",
    },
    guide: {
      title: "Hướng dẫn sử dụng",
      description:
        "Hướng dẫn sử dụng Trường Tiếng Việt Của Em: cách tạo tài khoản, học bảng chữ cái, làm bài học, luyện nói và theo dõi tiến trình.",
      ogDescription: "Cách bắt đầu học tiếng Việt cùng con trên Trường Tiếng Việt Của Em.",
    },
    faq: {
      title: "Câu hỏi thường gặp",
      description:
        "Câu hỏi thường gặp về Trường Tiếng Việt Của Em: chi phí, độ tuổi phù hợp, luyện nói, quyền riêng tư của trẻ và cách được hỗ trợ.",
      ogDescription: "Giải đáp những thắc mắc thường gặp của phụ huynh và học sinh.",
    },
    contact: {
      title: "Liên hệ",
      description:
        "Liên hệ với Trường Tiếng Việt Của Em và Canada Vietnam Cultural & Educational Council (CVCEC) qua email, WhatsApp, mạng xã hội hoặc địa chỉ tại Toronto, Canada.",
      ogDescription:
        "Kết nối với chúng tôi qua email, WhatsApp, mạng xã hội hoặc địa chỉ tại Toronto.",
    },
    dashboard: {
      title: "Báo cáo tác động",
      description:
        "Báo cáo tác động xã hội của Trường Tiếng Việt Của Em: quy mô, tăng trưởng và phân bổ địa lý.",
      ogDescription: "Quy mô, tăng trưởng và phân bổ địa lý của học sinh Trường Tiếng Việt Của Em.",
    },
    profile: {
      title: (username: string) => `Hồ sơ của ${username}`,
      description: (username: string) =>
        `Xem hồ sơ và tiến trình học tiếng Việt của ${username} trên Trường Tiếng Việt Của Em.`,
    },
    myCorner: {
      title: "Góc của em",
      description: "Sản phẩm học tập của các em học sinh Trường Tiếng Việt Của Em.",
      ogDescription:
        "Nơi trưng bày những bài làm và tác phẩm của các bạn nhỏ Trường Tiếng Việt Của Em.",
    },
    kmd: {
      title: "Khai Minh Đức",
      description: "Học đánh vần cùng chương trình Khai Minh Đức: từng bài âm, vần cùng Trâu con.",
      lessonTitle: (slug: string) => `Khai Minh Đức: ${slug}`,
      lessonDescription: "Học đánh vần cùng chương trình Khai Minh Đức, cùng Trâu con.",
    },
    tapViet: {
      title: "Tập viết",
      description:
        "Xem cô viết mẫu từng nét, chữ cái, chữ ghép và chữ số, rồi tô theo bằng ngón tay.",
    },
    quyen: {
      title: "Học Tiếng Việt",
      ogTitle: (n: string) => `Học Tiếng Việt Quyển ${n}`,
      description: (n: string) =>
        `Lộ trình học tiếng Việt Quyển ${n} qua các chủ đề dành cho trẻ em kiều bào.`,
    },
    quyenMap: {
      title: (n: string) => `Bản đồ Quyển ${n}`,
      description: (n: string) =>
        `Bản đồ Việt Nam với các chủ đề của Quyển ${n}: chọn địa danh để bắt đầu hành trình học tiếng Việt cùng con.`,
    },
    chuDe: {
      title: (chuDe: string, quyen: string) => `Chủ đề ${chuDe}, Quyển ${quyen}`,
      description: (chuDe: string, quyen: string) =>
        `Lộ trình các chặng học của chủ đề ${chuDe} trong Quyển ${quyen}: bài học, hình ảnh và bài tập cho trẻ em kiều bào.`,
    },
    chang: {
      title: (chang: string, quyen: string) => `Bài học ${chang}, Quyển ${quyen}`,
      description: (chang: string, quyen: string) =>
        `Bài học tiếng Việt (chặng ${chang}) thuộc Quyển ${quyen}: nội dung, hình ảnh và luyện tập cho trẻ em kiều bào.`,
    },
    home: {
      tagline: "Học tiếng Việt vui nhộn",
      description:
        "Hành trình học tiếng Việt vui nhộn dành cho trẻ em kiều bào 5–12 tuổi, dưới sự bảo trợ của UBNVONN – Bộ Ngoại giao.",
      ogDescription:
        "Vui học Tiếng Việt cùng Trâu con đội nón lá: 8 chủ đề, 40 chặng học dành cho trẻ em kiều bào.",
    },
    signIn: {
      title: "Đăng nhập",
      description:
        "Đăng nhập hoặc tạo tài khoản Trường Tiếng Việt Của Em để lưu tiến độ học tập của em.",
      ogDescription: "Đăng nhập để lưu tiến độ học tập của em.",
    },
    resetPassword: {
      title: "Đặt lại mật khẩu",
      description:
        "Đặt lại mật khẩu tài khoản Trường Tiếng Việt Của Em sau khi nhận liên kết khôi phục qua email.",
      ogDescription: "Đặt mật khẩu mới cho tài khoản của bạn.",
    },
  },
} as const;

export default vi;
