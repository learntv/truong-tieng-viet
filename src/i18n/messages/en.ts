import pagesEn from "./pages.en";
import type { Messages } from "./types";

const en: Messages = {
  pages: pagesEn,

  site: {
    name: "Trường Tiếng Việt Của Em",
  },

  common: {
    close: "Close",
  },

  lang: {
    label: "Language",
    vi: "Tiếng Việt",
    en: "English",
  },

  nav: {
    home: "Home",
    learn: "Learn",
    myCorner: "My corner",
    leaderboard: "Leaderboard",
    signIn: "Sign in",
    signOut: "Sign out",
    profile: "My profile",
    report: "Reports",
    studentFallback: "Student",
    avatarAlt: "Avatar",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    mainNav: "Main navigation",
  },

  footer: {
    blurb:
      "A Vietnamese learning platform for Vietnamese children in Vietnam and around the world.",
    ministryAlt: "Ministry of Foreign Affairs of Vietnam",
    aboutTitle: "About us",
    learnTitle: "Learn",
    policyTitle: "Policies",
    links: {
      about: "About",
      guide: "How to use",
      faq: "FAQ",
      contact: "Contact",
      alphabet: "Alphabet",
      lessons: "Lessons",
      speaking: "Speaking practice",
      leaderboard: "Leaderboard",
      terms: "Terms of use",
      privacy: "Privacy policy",
    },
    copyright: (year, siteName) => `© ${year} ${siteName}. All rights reserved.`,
  },

  errors: {
    genericTitle: "This page didn't load",
    genericBody: "Something went wrong on our side. Try reloading, or head back to the home page.",
    retry: "Try again",
    backHome: "Back to home",
    notFoundTitle: "Page not found",
    notFoundBody: "The page you're looking for doesn't exist or has moved.",
  },

  auth: {
    loginTab: "Sign in",
    registerTab: "Sign up",
    loginHeading: "Welcome back!",
    registerHeading: "Create an account",
    intro: "Sign in to save your learning progress.",
    backHomeLabel: "Back to home",
    google: "Continue with Google",
    or: "or",
    email: "Email",
    emailPlaceholder: "you@example.com",
    password: "Password",
    forgotPassword: "Forgot password?",
    submitLogin: "Sign in",
    submitRegister: "Sign up",
    invalidEmail: "Invalid email",
    passwordTooShort: "Password must be at least 6 characters",
    loginFailed: "Sign-in failed",
    loginSuccess: "Signed in!",
    registerFailed: "Sign-up failed",
    registerCheckEmail: "Check your email to confirm your account!",
    googleFailed: "Couldn't connect to Google",
    forgotBack: "Back",
    forgotIntro: "Enter your email and we'll send you a link to reset your password.",
    forgotSubmit: "Send reset email",
    forgotSendFailed: "Couldn't send the email",
    forgotSent: "We've sent a password reset email. Check your inbox.",
    forgotBackToLogin: "Back to sign in",
  },

  resetPassword: {
    heading: "Reset password",
    intro: "Enter a new password for your account.",
    newPassword: "New password",
    confirmPassword: "Confirm password",
    submit: "Update password",
    mismatch: "Passwords don't match",
    invalidLink: "This link is invalid or has expired.",
    failed: "Couldn't reset your password",
    success: "Your password has been updated!",
  },

  profileSetup: {
    title: "Welcome! 🎉",
    intro: "Let's set up your profile",
    googleAvatar: "We'll use your Google profile picture 👍",
    pickAvatar: "Pick your avatar",
    name: "Your name",
    namePlaceholder: "Enter your name...",
    nameRequired: "Please enter your name!",
    where: "Where do you live?",
    pickCountry: "Choose a country...",
    search: "Search...",
    noResults: "No matches",
    start: "Start learning! 🚀",
    saveFailed: "Couldn't save your profile",
  },

  home: {
    curtain: {
      label: "Open the curtain",
      tap: "TAP TO OPEN THE CURTAIN",
    },
    gallery: {
      beGioTheCo: "A little girl in a red áo dài holds up a Vietnamese flag card",
      coGiaoKhaiMac:
        "A teacher holds a Vietnamese flag card at the opening of an interactive Vietnamese class on Hùng Kings' Commemoration Day",
      caLopChupChung:
        "A teacher, volunteers and students in áo dài pose together, holding Vietnamese books",
      ghepTheDayLa: "Children play a “Đây là” vocabulary card matching game around a table",
      lopHocTuongTac: "Students, volunteers and parents at an interactive Vietnamese class",
      timTheNguoiThan: "Children look for family member picture cards on the table",
      choiTheTuVung: "A group of students lean over vocabulary cards spread on a table",
    },
    mission: {
      ribbon: "Our mission",
      title: "Helping every Vietnamese child abroad **keep their Vietnamese**, for free",
      slides: {
        pei1: "Cô Hà's class, PEI, Canada: children doing Vietnamese exercises around a table",
        pei2: "Cô Hà's class, PEI, Canada: children concentrating on their writing",
        pei3: "Cô Hà's class, PEI, Canada: the whole class studying around a long table",
        pei4: "Cô Hà's class, PEI, Canada: the children's shoes lined up at the classroom door",
        toronto1: "Cô Trang's class, Toronto, Canada: the teacher and children in áo dài in class",
        toronto2: "Cô Trang's class, Toronto, Canada: children playing the “Đây là” card game",
        toronto3:
          "Cô Trang's class, Toronto, Canada: children looking for picture cards on the table",
        toronto4:
          "Cô Trang's class, Toronto, Canada: the teacher, volunteers and children in a group photo",
        toronto5:
          "Cô Trang's class, Toronto, Canada: “Đây là” vocabulary cards and a Vietnamese flag",
        toronto6: "Cô Trang's class, Toronto, Canada: an interactive Vietnamese lesson",
        toronto7:
          "Cô Trang's class, Toronto, Canada: a little girl holds up a Vietnamese flag card",
      },
    },
    press: {
      ribbon: "News",
      title: "In the press",
      lede: "The Vietnamese learning platform, classes, library and activities of the **Canada–Vietnam Cultural and Educational Council** as seen by the press in Vietnam.",
      readArticle: "Read article",
      videoFailed:
        "The video can't play here. You can watch the original on the Vietnam News Agency website.",
      watchOnVna: "Watch on VNA",
      playVideo: (title) => `Play video: ${title}`,
      readOriginal: "Read the original",
    },
    about: {
      title: "About us",
      partnerHeading: "Expert partnership",
      partnerBody:
        "The project is carried out with the support and partnership of the **State Committee for Overseas Vietnamese, Ministry of Foreign Affairs of Vietnam**.",
      digitizeHeading: "Digitization project",
      digitizeBody:
        "Digitizing two books from the **Ho Chi Minh City University of Education Publishing House**, as part of the Honouring the Vietnamese Language in Overseas Vietnamese Communities programme launched by the **State Committee for Overseas Vietnamese, Ministry of Foreign Affairs**.",
      ecosystemHeading: "Ecosystem",
      ecosystemBody:
        "The project is an active member of the **Network of Vietnamese Language and Culture Teaching Centres Abroad**.",
      copyrightHeading: "Copyright",
      copyrightBody:
        "Copyright held by co-authors Phan Thị Quỳnh Trang, Nguyễn Trần Thanh Hải, Đỗ Thị Phương Mai, Trần Thanh Phúc and Trần Văn Nhật.",
    },
    thanks: {
      title: "Thank you",
      body: 'The project team sincerely thanks the **State Committee for Overseas Vietnamese, Ministry of Foreign Affairs** of the Socialist Republic of Vietnam for its constant support and guidance. We are deeply grateful to the embassies, the agencies in Vietnam and Canada, and the Vietnamese teaching network, whose generous help made it possible for **"Trường Tiếng Việt Của Em"** to be completed and launched. Your support is a great motivation for us to preserve and share the Vietnamese language and culture with young people in Canada and around the world.',
      signature: "The project team",
    },
    support: {
      title: "Support us",
      heading: "Help keep Vietnamese alive for every child.",
      body: '**"Trường Tiếng Việt Của Em"** is a non-profit project. We welcome support, contributions and sponsorship from parents, the Vietnamese community abroad and generous donors. Every contribution, however small, makes a difference.',
      email: "Email",
      phone: "Phone",
      copied: (value) => `Copied: ${value}`,
      copyFailed: "Couldn't copy",
      copy: (label) => `Copy ${label}`,
      pointsHeading: "Your contribution helps",
      freeHeading: "Keep the whole programme free",
      freeBody: "40+ lessons across 8 topics, open to every child, for life, free of charge.",
      contentHeading: "Digitize new content",
      contentBody:
        "Continuing the Vui học Tiếng Việt book series from the Ho Chi Minh City University of Education Publishing House.",
      speakingHeading: "Grow speaking practice",
      speakingBody:
        "Pictures, sounds, games and recordings to help children speak Vietnamese with confidence.",
      thankYou: "Thank you so much!",
    },
    closing: {
      title: "Learn Vietnamese anytime, anywhere",
      lede: "Trâu con in his nón lá is ready. Open your first lesson and start your journey.",
      learnNow: "Start learning",
      speaking: "Speaking practice",
    },
  },

  mascot: {
    cheer: "Trâu con cheering",
    crying: "Trâu con crying",
    flying: "Trâu con flying up",
    hiking: "Trâu con hiking",
    listening: "Trâu con listening",
    peeking: "Trâu con peeking out",
    "peeking-over": "Trâu con peeking over the edge",
    reading: "Trâu con reading a book",
    "reading-sitting": "Trâu con sitting and reading",
    thinking: "Trâu con thinking",
    "thumbs-up": "Trâu con giving a thumbs up",
    wave: "Trâu con waving hello",
  },

  hocTap: {
    heading: "What would you like to learn today?",
    crumb: "Learn",
    byBook: "Learn with the books",
    practice: "More practice",
    enter: "Start",
    bookTitle: (n) => `Book ${n}`,
    bookBody: (n) =>
      `Vui học Tiếng Việt, book ${n}, Ho Chi Minh City University of Education Publishing House`,
    tapVietTitle: "Handwriting",
    tapVietBody: "Trace each letter stroke by stroke on the notebook page.",
    kmdTitle: "Khai Minh Đức",
    kmdBody: "Spell out each sound and each rhyme.",
    luyenNoiTitle: "Speaking",
    luyenNoiBody: "Listen to the teacher, then say it yourself.",
    bangChuCaiTitle: "Alphabet",
    bangChuCaiBody: "Meet an animal friend and hear how each letter sounds.",
    noData: "No lesson data yet.",
    finishedAll: "🎉 You've finished the whole path! Well done!",
    reviewAgain: "Review again",
  },

  learning: {
    // Roadmap (one chủ đề's chặng list)
    breadcrumb: "Breadcrumb",
    comingSoon: "Coming soon",
    startLearning: "Start learning",
    continueLearning: "Keep learning",
    reviewAgain: "Review again",
    stagesDone: (done, total) => `${done}/${total} stages completed`,
    topicInProgress:
      "Our teachers are still writing this topic. Go back to an earlier topic and practise while you wait!",
    backToMap: "Back to the map",
    topicHeading: (name) => `Topic: ${name}`,
    topicTitle: (n, name) => `Topic ${n}: ${name}`,
    topicN: (n) => `Topic ${n}`,
    stageN: (n) => `Stage ${n}`,
    lessonsCount: (n) => (n === 1 ? "1 lesson" : `${n} lessons`),
    studying: "In progress",
    completed: "Completed",
    inProgress: (current, total) => `In progress: ${current}/${total} lessons`,
    notStarted: "Not started",
    review: "Review",
    continue: "Continue",
    start: "Start",

    // Overworld map
    backToLearn: "Back to Learn",
    mapHint: "Each place is a topic. Tap a place to explore and learn!",
    replayTutorial: "Show the guide again",
    mapAlt: "Map of Vietnam with its landmarks",
    topicsDone: (done, total) => `${done}/${total} topics`,
    pinStatus: {
      completed: "completed",
      current: "in progress",
      "coming-soon": "coming soon",
      locked: "locked",
    },
    pinComingSoon:
      "Our teachers are still writing this topic. Learn the earlier topics while you wait! ✨",
    pinLocked: "Finish the previous topic to unlock this place! ✨",
    stagesCount: (done, total) => `${done}/${total} stages`,
    explore: "Explore now",
    tutorialLabel: "Learn in three steps",
    tutorialAlt: "Three steps: 1. Explore a place, 2. Finish the lessons, 3. Collect a stamp",
    tutorialDone: "Got it",

    // Lesson page
    backToMapLabel: "Back to the map",
    stop: "Stop",
    listen: "Listen",
    listenTo: (text) => `Listen: ${text}`,
    videoFallback: "Video not playing? Open it on YouTube",
    imageFallbackAlt: "Illustration",
    imageFailed: "(The picture didn't load)",
    stageProgress: "Stage progress",
    prevStage: "Previous stage",
    nextStage: "Next stage",
    stageOf: (n, count, title) => `Stage ${n}/${count}: ${title}`,
    slideDone: "Done",
    slideTodo: "Not yet",
    pageN: (n) => `Page ${n}`,
    pageOf: (n, total) => `Page ${n} / ${total}`,
    notFoundTitle: "Lesson not found",
    notFoundBody: "This stage doesn't exist or has been removed.",
    backToRoadmap: "Back to the path",
    stageComplete: (n) => `Stage ${n} complete! 🎉`,
    keepItUp: "Keep up the great work!",
    hideLessonList: "Hide the lesson list",
    showLessonList: "Show the lesson list",
    lessonList: "Lesson list",
    contentComing: "This content is on its way.",
    prevLesson: "Previous",
    finish: "Finish",
    close: "Close",
    nextLesson: "Next lesson",
    hint: "Hint",
    hintFor: (label) => `Hint: ${label}`,
  },

  alphabet: {
    title: "Alphabet",
    explored: "Explored",
    lettersCount: (seen, total) => `${seen}/${total} letters`,
    downloadPdf: "Download the alphabet PDF",
    seen: "Seen",
    animalAlt: (letter) => `Animal friend for the letter ${letter}`,
    listenLetter: (letter) => `Listen to the letter ${letter}`,
  },

  tapViet: {
    title: "Handwriting",
    intro: "Watch the teacher write, then trace it with your finger!",
    tabsLabel: "Choose a handwriting exercise",
    categories: {
      net: "Basic strokes",
      chu: "Letters",
      ghep: "Letter pairs",
      so: "Numbers and marks",
    },
    watchLabel: "Watch the teacher write",
    pause: "Pause",
    play: "Play",
    replay: "Watch again from the start",
    fast: "Fast",
    traceLabel: "Trace it yourself",
    traceArea: "Area for tracing the grey strokes",
    clear: "Clear",
    done: "Done",
    feedback: {
      3: "Amazing! Beautiful writing!",
      2: "Great job! Very close to the model.",
      1: "Keep going! Try to stay closer to the grey strokes.",
      0: "Try again, you can do it!",
    },
  },

  progress: {
    saveFailed: "Your progress wasn't saved",
    saveFailedHint: "Check your internet connection and try again!",
    mergeFailed: "Some of your earlier progress wasn't saved to your account",
    mergeFailedHint: "Check your connection and reload the page!",
  },

  speaking: {
    title: "Speaking",
    loadFailed: "The speaking topics didn't load. Please try again later!",
    topicNotFound: "Topic not found",
    topicNotFoundBody: "This topic doesn't exist or has changed.",
    pickAnother: "Choose another topic",
    noSentences: "This topic has no practice sentences yet",
    sentenceOf: (n, total) => `Sentence ${n}/${total}`,
    imageAlt: "Illustration",
    listenModel: "Listen to the teacher",
    tooWrong: "The teacher couldn't hear that clearly. Try again! 🌼",
    youSaid: "You said:",
    micDenied:
      "The microphone isn't on. That's okay, listen to the teacher and read it aloud after her!",
    cantRecord: "This device can't record yet. Listen to the teacher and read it aloud after her!",
    readAloud: "I read it aloud!",
    sameAsModel: "😊 Sounds the same!",
    prevSentence: "Previous sentence",
    nextSentence: "Next sentence",
    stopRecording: "Stop recording",
    startRecording: "Start recording",
    listening: "Listening to you… tap when you're done",
    speakNow: "Your turn to speak!",
    saveFailed: "Your speaking progress wasn't saved",
    saveFailedHint: "Check your internet connection and try again!",
    mergeFailed: "Some of your earlier speaking progress wasn't saved to your account",
    mergeFailedHint: "Check your connection and reload the page!",
  },

  kmd: {
    title: "Khai Minh Đức",
    loadFailed: "The lesson list didn't load. Please try again later!",
    empty: "No lessons yet.",
    lessonN: (n) => `Lesson ${n}`,
    notAvailable: "Lesson not available",
    notAvailableBody: "This lesson doesn't exist.",
    viewList: "See the lesson list",
    backToList: "Lesson list",
  },

  leaderboard: {
    title: "Leaderboard",
    empty: "No students yet!",
    emptyHint: "Be the first to start learning.",
    lessonsDone: (n) => (n === 1 ? "1 lesson done" : `${n} lessons done`),
    lessonsDoneLabel: "lessons done",
    avatarOf: (name) => `${name}'s avatar`,
  },

  profile: {
    title: "My profile",
    avatarSaveFailed: "Couldn't save your avatar",
    avatarSaved: "Avatar saved!",
    avatarBadType: "The picture must be a JPG, PNG, WebP or GIF",
    avatarTooBig: "The picture must be smaller than 2MB",
    signInAgain: "Please sign in again",
    uploadFailed: "Couldn't upload the picture",
    pickAvatar: "Pick your avatar 🎨",
    uploadPhoto: "Upload your own picture",
    uploadHint: "JPG, PNG, WebP or GIF, up to 2MB",
    countrySaveFailed: "Couldn't save your country",
    countrySaved: "Country saved!",
    pickCountry: "Pick your country 🌍",
    search: "Search...",
    noCountry: "No matching country",
    accountDeleted: "Your account has been deleted. Goodbye! 👋",
    deleteFailed: "Couldn't delete your account",
    tryAgain: "Please try again.",
    nameSaved: "Name saved!",
    nameSaveFailed: "Couldn't save your name",
    resetEmailFailed: "Couldn't send the email",
    resetEmailSent: "Password reset email sent! 📬",
    progressResetFailed: "Couldn't reset your progress",
    progressReset: "Your progress has been reset! Time for a fresh start 🌱",
    changeAvatar: "Change avatar",
    changeName: "Change name",
    pickCountryTitle: "Choose country",
    memberSince: (date) => `Member since ${date}`,
    lessonsCompleted: "Lessons completed",
    inProgress: "In progress",
    streak: "Day streak",
    doneToday: "Done today ✓",
    notToday: "Not studied today",
    account: "Account",
    changePassword: "Change password",
    restart: "Start over",
    restartTitle: "Start over from the beginning? 🔄",
    restartBody:
      "All your learning progress will be cleared and you'll start again from the first lesson. Your account will be kept.",
    keep: "No, keep it",
    restartConfirm: "Start over",
    deleteAccount: "Delete account",
    deleteTitle: "Delete your account forever? ⚠️",
    deleteWord: "DELETE",
    deleteBody: (word) =>
      `Your whole profile and learning progress will be deleted forever and can't be recovered. Type **${word}** in the box below to confirm.`,
    deletePlaceholder: (word) => `Type ${word} to confirm`,
    cancel: "Cancel",
    deleteForever: "Delete forever",
    version: (siteName) => `Version 1.0 · ${siteName} 🇻🇳`,
    userNotFound: "User not found",
    userNotFoundBody: (username) => `The profile **@${username}** doesn't exist.`,
  },

  dashboard: {
    title: "Social impact report",
    students: (count) => `${count} students`,
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    resetView: "Reset",
    less: "Fewer",
    more: "More",
    total: (count) => `Total: ${count} students`,
    totalShort: "Total",
    completed: "Completed",
    inProgress: "In progress",
    justStarted: "Just started",
    loading: "Loading data...",
    accounts: "Accounts",
    recentAdds: (n) => `+${n} latest period`,
    registered: "registered",
    completedKpi: "Completed",
    rate: (pct) => `${pct}% rate`,
    inProgressSub: "currently learning",
    countries: "Countries",
    withStudents: "with students",
    growthTitle: "User growth",
    growthSub: "Cumulative students by sign-up date",
    monthly: "Month",
    weekly: "Week",
    monthLabel: (month, year) =>
      new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }),
    completionTitle: "Completion rate",
    byCountryTitle: "Students by country",
    byCountrySub: (students, countries) =>
      `${students} students in ${countries} ${countries === 1 ? "country" : "countries"}`,
    topCountries: "Top countries",

    // Student report
    reportTitle: "Student report",
    reportFailed: "The student report didn't load. Please try again.",
    reportLoading: "Loading the student report…",
    totalStudents: "Total students",
    activeWeek: "Active in the last 7 days",
    needAttention: "Need support",
    avgProgress: "Avg. progress (started)",
    status: {
      completed: "Completed",
      active: "Learning",
      attention: "Needs support",
      new: "New",
    },
    all: "All",
    neverActive: "Not active yet",
    today: "Today",
    yesterday: "Yesterday",
    daysAgo: (n) => `${n} days ago`,
    monthsAgo: (n) => (n === 1 ? "1 month ago" : `${n} months ago`),
    yearsAgo: (n) => (n === 1 ? "1 year ago" : `${n} years ago`),
    studentList: "Student list",
    studentListHint:
      "Click a column heading to sort, or filter by status to find who needs support.",
    searchPlaceholder: "Search by name or country…",
    colStudent: "Student",
    colCountry: "Country",
    colProgress: "Progress",
    colStars: "Speaking stars",
    colActive: "Last active",
    colStatus: "Status",
    stagesOf: (done, total) => `${done}/${total} stages`,
    noMatches: "No students match the filter.",
    stuckTitle: "Stages where students get stuck",
    stuckHint:
      "The lowest completion rates among stages many students have started. Worth reviewing the content or adding support.",
    completedWord: "completed",
    unfinished: (dropoff, reached) => `${dropoff} / ${reached} unfinished`,
  },

  comingSoon: {
    title: "My corner",
    description: "This section is being built and will be ready for you soon! 👧✏️📝🧸✈️",
  },

  meta: {
    rootDescription: "A fun journey into Vietnamese for children of the Vietnamese diaspora.",
    hocTap: {
      title: "Learn",
      description:
        "Choose a learning path, the alphabet, speaking or handwriting practice to start learning Vietnamese with Trâu con.",
    },
    alphabet: {
      title: "Alphabet",
      description:
        "Explore the Vietnamese alphabet with fun animal friends: hear each letter and learn new words.",
    },
    speaking: {
      title: "Speaking",
      description:
        "Practise speaking Vietnamese with Trâu con: listen to the model, record yourself and earn encouraging stars.",
    },
    speakingTopic: {
      title: (topic) => `Speaking: ${topic}`,
      description: (topic) =>
        `Practise speaking Vietnamese on the topic "${topic}": listen to model sentences, record yourself and earn stars with Trâu con.`,
    },
    leaderboard: {
      title: "Leaderboard",
      description:
        "See the most hard-working students at Trường Tiếng Việt Của Em and follow their learning progress.",
    },
    terms: {
      title: "Terms of Service",
      description:
        "Terms of Service for Trường Tiếng Việt Của Em: your rights and responsibilities when using the Vietnamese learning platform.",
    },
    privacy: {
      title: "Privacy Policy",
      description:
        "Privacy Policy for Trường Tiếng Việt Của Em: the data we collect, how we use it, and the rights of parents and students.",
      ogDescription: "The data we collect, how we use it, and the rights of parents and students.",
    },
    guide: {
      title: "How to use",
      description:
        "How to use Trường Tiếng Việt Của Em: creating an account, learning the alphabet, doing lessons, practising speaking and following progress.",
      ogDescription:
        "How to start learning Vietnamese with your child on Trường Tiếng Việt Của Em.",
    },
    faq: {
      title: "Frequently asked questions",
      description:
        "Frequently asked questions about Trường Tiếng Việt Của Em: cost, suitable ages, speaking practice, children's privacy and getting help.",
      ogDescription: "Answers to common questions from parents and students.",
    },
    contact: {
      title: "Contact",
      description:
        "Contact Trường Tiếng Việt Của Em and the Canada Vietnam Cultural & Educational Council (CVCEC) by email, WhatsApp, social media or at our address in Toronto, Canada.",
      ogDescription: "Reach us by email, WhatsApp, social media or at our address in Toronto.",
    },
    dashboard: {
      title: "Impact report",
      description:
        "The social impact report of Trường Tiếng Việt Của Em: scale, growth and geographic reach.",
      ogDescription: "Scale, growth and geographic reach of Trường Tiếng Việt Của Em's students.",
    },
    profile: {
      title: (username) => `${username}'s profile`,
      description: (username) =>
        `See ${username}'s profile and Vietnamese learning progress on Trường Tiếng Việt Của Em.`,
    },
    myCorner: {
      title: "My corner",
      description: "Learning work by the students of Trường Tiếng Việt Của Em.",
      ogDescription:
        "A showcase of the work and creations of the children at Trường Tiếng Việt Của Em.",
    },
    kmd: {
      title: "Khai Minh Đức",
      description:
        "Learn to spell with the Khai Minh Đức programme: sound by sound, rhyme by rhyme, with Trâu con.",
      lessonTitle: (slug) => `Khai Minh Đức: ${slug}`,
      lessonDescription: "Learn to spell with the Khai Minh Đức programme and Trâu con.",
    },
    tapViet: {
      title: "Handwriting",
      description:
        "Watch the teacher write each stroke, letter, letter pair and number, then trace it with your finger.",
    },
    quyen: {
      title: "Learn Vietnamese",
      ogTitle: (n) => `Learn Vietnamese, Book ${n}`,
      description: (n) =>
        `The Book ${n} learning path, topic by topic, for children of the Vietnamese diaspora.`,
    },
    quyenMap: {
      title: (n) => `Book ${n} map`,
      description: (n) =>
        `A map of Vietnam with the topics of Book ${n}: pick a place to start your Vietnamese learning journey.`,
    },
    chuDe: {
      title: (chuDe, quyen) => `Topic ${chuDe}, Book ${quyen}`,
      description: (chuDe, quyen) =>
        `The stages of topic ${chuDe} in Book ${quyen}: lessons, pictures and exercises for children of the Vietnamese diaspora.`,
    },
    chang: {
      title: (chang, quyen) => `Lesson ${chang}, Book ${quyen}`,
      description: (chang, quyen) =>
        `Vietnamese lesson (stage ${chang}) from Book ${quyen}: content, pictures and practice for children of the Vietnamese diaspora.`,
    },
    home: {
      tagline: "Learn Vietnamese the fun way",
      description:
        "A fun Vietnamese learning journey for children of the Vietnamese diaspora aged 5 to 12, under the patronage of the State Committee for Overseas Vietnamese, Ministry of Foreign Affairs.",
      ogDescription:
        "Learn Vietnamese the fun way with Trâu con in his nón lá: 8 topics and 40 lesson stages for children of the Vietnamese diaspora.",
    },
    signIn: {
      title: "Sign in",
      description:
        "Sign in or create a Trường Tiếng Việt Của Em account to save your learning progress.",
      ogDescription: "Sign in to save your learning progress.",
    },
    resetPassword: {
      title: "Reset password",
      description:
        "Reset your Trường Tiếng Việt Của Em password after receiving a recovery link by email.",
      ogDescription: "Set a new password for your account.",
    },
  },
};

export default en;
