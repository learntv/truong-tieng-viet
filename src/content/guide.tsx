import type { ReactNode } from "react";
import { Strong, TextLink, type ContentLocale } from "./prose";

export const guideContent: Record<
  ContentLocale,
  { steps: { title: string; body: ReactNode }[]; help: ReactNode }
> = {
  vi: {
    steps: [
      {
        title: "Tạo tài khoản",
        body: (
          <>
            Nhấn nút <Strong>Đăng nhập</Strong> ở góc trên bên phải, rồi đăng ký bằng email hoặc
            đăng nhập nhanh bằng tài khoản Google. Phụ huynh nên tạo tài khoản và đồng hành cùng con
            trong quá trình học.
          </>
        ),
      },
      {
        title: "Học bảng chữ cái",
        body: (
          <>
            Vào mục <TextLink href="/hoc-tap/bang-chu-cai">Bảng chữ cái</TextLink> để làm quen với
            các chữ cái tiếng Việt qua hình ảnh và âm thanh. Nhấn vào mỗi chữ để nghe cách phát âm
            chuẩn.
          </>
        ),
      },
      {
        title: "Làm bài học theo chủ đề",
        body: (
          <>
            Trong mục <TextLink href="/hoc-tap">Học tập</TextLink>, các bài học được sắp xếp theo
            chủ đề và mức độ. Bé hoàn thành từng bài để mở khoá bài tiếp theo và nhận điểm.
          </>
        ),
      },
      {
        title: "Luyện nói",
        body: (
          <>
            Tính năng <TextLink href="/hoc-tap/luyen-noi">Luyện nói</TextLink> dùng micro của thiết
            bị để bé tập phát âm và được chấm điểm ngay lập tức. Hãy cho phép trình duyệt sử dụng
            micro khi được hỏi. Giọng nói không được ghi âm hay lưu trữ.
          </>
        ),
      },
      {
        title: "Theo dõi tiến trình",
        body: (
          <>
            Bé tích luỹ điểm và leo lên <TextLink href="/bang-xep-hang">bảng xếp hạng</TextLink>.
            Vào trang cá nhân để xem lại thành tích và chuỗi ngày học của bé.
          </>
        ),
      },
    ],
    help: (
      <>
        Gặp khó khăn khi sử dụng? Xem{" "}
        <TextLink href="/cau-hoi-thuong-gap">Câu hỏi thường gặp</TextLink> hoặc{" "}
        <TextLink href="/lien-he">liên hệ với chúng tôi</TextLink>.
      </>
    ),
  },
  en: {
    steps: [
      {
        title: "Create an account",
        body: (
          <>
            Tap the <Strong>Sign in</Strong> button in the top right corner, then sign up with your
            email or sign in quickly with your Google account. We recommend that parents create the
            account and learn alongside their child.
          </>
        ),
      },
      {
        title: "Learn the alphabet",
        body: (
          <>
            Open <TextLink href="/hoc-tap/bang-chu-cai">Alphabet</TextLink> to get to know the
            Vietnamese letters through pictures and sounds. Tap each letter to hear how it is
            pronounced.
          </>
        ),
      },
      {
        title: "Do lessons by topic",
        body: (
          <>
            In <TextLink href="/hoc-tap">Learn</TextLink>, lessons are sorted by topic and level.
            Your child finishes each lesson to unlock the next one and earn points.
          </>
        ),
      },
      {
        title: "Speaking practice",
        body: (
          <>
            <TextLink href="/hoc-tap/luyen-noi">Speaking practice</TextLink> uses your device's
            microphone so your child can practise pronunciation and get a score right away. Please
            allow the browser to use the microphone when asked. Voices are never recorded or stored.
          </>
        ),
      },
      {
        title: "Track progress",
        body: (
          <>
            Your child collects points and climbs the{" "}
            <TextLink href="/bang-xep-hang">leaderboard</TextLink>. Open the profile page to look
            back at your child's achievements and learning streak.
          </>
        ),
      },
    ],
    help: (
      <>
        Having trouble? See the <TextLink href="/cau-hoi-thuong-gap">FAQ</TextLink> or{" "}
        <TextLink href="/lien-he">contact us</TextLink>.
      </>
    ),
  },
};
