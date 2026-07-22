Mục tiêu: Xóa icon `Info` (Lucide icon dấu chấm than) đang nằm ngay trước chữ "Lời cảm ơn" trong section cảm ơn của `src/components/tabs/InfoTab.tsx`.

Thay đổi:
- Trong `src/components/tabs/InfoTab.tsx`, dòng ~169 hiện có `<Info className="h-6 w-6 text-gold sm:h-7 sm:w-7" strokeWidth={2.5} />` bên trong thẻ `<h3>`.
- Xóa dòng icon này.
- Giữ nguyên tiêu đề "Lời cảm ơn" và toàn bộ style hiện có (gap-2 trên h3 không còn cần thiết nhưng không gây hại, nên có thể bỏ hoặc giữ để giảm thiểu thay đổi).

Phạm vi: Chỉ sửa file `src/components/tabs/InfoTab.tsx`, không động chạm logic hay route khác.