import type { ReactNode } from "react";
import { Strong, TextLink, type ContentLocale } from "./prose";

export const faqContent: Record<ContentLocale, { q: string; a: ReactNode }[]> = {
  vi: [
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
      a: (
        <>
          Không. Giọng nói được xử lý ngay trên trình duyệt để chấm điểm phát âm và{" "}
          <Strong>không được ghi âm, lưu trữ hay gửi lên máy chủ</Strong> của chúng tôi. Xem thêm
          tại <TextLink href="/chinh-sach-bao-mat">Chính sách bảo mật</TextLink>.
        </>
      ),
    },
    {
      q: "Tôi có cần đăng nhập để học không?",
      a: "Bạn có thể xem một số nội dung mà không cần đăng nhập, nhưng cần tài khoản để lưu tiến trình học và tham gia bảng xếp hạng.",
    },
    {
      q: "Làm sao để xoá tài khoản và dữ liệu?",
      a: (
        <>
          Bạn có thể xoá tài khoản ngay trong phần cài đặt tài khoản, hoặc liên hệ chúng tôi qua{" "}
          <TextLink href="mailto:contact@cvcec.org">contact@cvcec.org</TextLink>.
        </>
      ),
    },
    {
      q: "Tôi gặp lỗi hoặc cần hỗ trợ thì làm thế nào?",
      a: (
        <>
          Hãy ghé trang <TextLink href="/lien-he">Liên hệ</TextLink> để gửi thắc mắc. Chúng tôi luôn
          sẵn lòng hỗ trợ bạn và bé.
        </>
      ),
    },
  ],
  en: [
    {
      q: "Does Trường Tiếng Việt Của Em cost anything?",
      a: "The platform is a non-profit project to help children keep their Vietnamese. You can create an account and learn for free.",
    },
    {
      q: "What ages is the platform for?",
      a: "We made it for children, but beginners of any age who are starting to learn Vietnamese can use it.",
    },
    {
      q: "What does my child need to start learning?",
      a: "Just a device with a web browser and an Internet connection. For speaking practice, the device needs a microphone, and you allow the browser to use it when asked.",
    },
    {
      q: "Does speaking practice record my child's voice?",
      a: (
        <>
          No. The voice is processed right in the browser to grade pronunciation and{" "}
          <Strong>is never recorded, stored, or sent to our servers</Strong>. Read more in our{" "}
          <TextLink href="/chinh-sach-bao-mat">Privacy policy</TextLink>.
        </>
      ),
    },
    {
      q: "Do I need to sign in to learn?",
      a: "You can view some content without signing in, but you need an account to save learning progress and join the leaderboard.",
    },
    {
      q: "How do I delete my account and data?",
      a: (
        <>
          You can delete your account in your account settings, or contact us at{" "}
          <TextLink href="mailto:contact@cvcec.org">contact@cvcec.org</TextLink>.
        </>
      ),
    },
    {
      q: "What should I do if something goes wrong or I need help?",
      a: (
        <>
          Visit the <TextLink href="/lien-he">Contact</TextLink> page to send us your question. We
          are always happy to help you and your child.
        </>
      ),
    },
  ],
};
