// ============================================================================
// Vùng gợi ý tương tác trên hình bài học ("hotspot")
//
// Rê chuột (desktop) hoặc chạm (mobile) vào một vùng sẽ hiện khung đỏ quanh
// nhân vật/thẻ hình đó. Hình KHÔNG có trong LESSON_HIGHLIGHTS hiển thị y như cũ.
//
// Cách thêm hình mới:
//   1. Lấy id của hình, ví dụ "quyen_1:chude01.chang03.noidung01.bai01.hinh01".
//      Id này được ghép từ VỊ TRÍ của hình trong CMS (xem src/lib/learning.ts):
//      quyển → chủ đề thứ mấy → chặng thứ mấy → nội dung → bài → hình, mỗi cấp
//      đánh số từ 01. Đếm trên trang admin của chủ đề là ra.
//      LƯU Ý: chèn/xoá/kéo đổi thứ tự một hình sẽ làm đổi id của những hình sau
//      nó, nên phải sửa lại khóa ở đây cho khớp.
//   2. Thêm một khóa mới vào LESSON_HIGHLIGHTS với id đó.
//   3. Khai báo các vùng gợi ý:
//      - Thẻ xếp đều dạng lưới (2×3, 3×2, ...) → dùng makeGridTargets cho gọn.
//      - Vị trí tự do → liệt kê từng HighlightTarget một.
//
// Tọa độ tính theo PHẦN TRĂM kích thước hình, nên luôn khớp khi hình co giãn:
//   x = mép trái (%), y = mép trên (%), width = chiều rộng (%), height = chiều cao (%)
// Ví dụ hình gốc 1000×800px, thẻ nằm ở px (100, 200) cỡ 300×200px
//   → x: 10, y: 25, width: 30, height: 25.
//
// shape:
//   - bỏ trống hoặc "rect"  → khung chữ nhật bo góc (thẻ hình, khung ảnh chữ nhật)
//   - "circle"              → khung tròn (ảnh chân dung tròn); nên giữ width/height
//                             tương ứng số px gần bằng nhau để khung tròn đẹp
// ============================================================================

export type HighlightTarget = {
  id: string;
  /** Nhãn đọc cho trình đọc màn hình, ví dụ "bác" */
  label?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  /** "circle" cho ảnh chân dung tròn; mặc định là khung chữ nhật bo góc */
  shape?: "rect" | "circle";
};

/**
 * Tạo nhanh các vùng gợi ý cho thẻ hình xếp đều dạng lưới (trái→phải, trên→xuống).
 * - x/y: mép trái/trên của Ô ĐẦU TIÊN (%)
 * - width/height: kích thước MỖI Ô (%)
 * - stepX: khoảng cách mép trái giữa 2 cột kề nhau (%) — thường ≈ width + khe hở
 * - stepY: khoảng cách mép trên giữa 2 hàng kề nhau (%)
 * Id sinh ra: `${prefix}-1`, `${prefix}-2`, ... theo thứ tự labels.
 */
export function makeGridTargets(opts: {
  prefix: string;
  labels: string[];
  columns: number;
  x: number;
  y: number;
  width: number;
  height: number;
  stepX: number;
  stepY: number;
  shape?: "rect" | "circle";
}): HighlightTarget[] {
  return opts.labels.map((label, i) => ({
    id: `${opts.prefix}-${i + 1}`,
    label,
    x: opts.x + (i % opts.columns) * opts.stepX,
    y: opts.y + Math.floor(i / opts.columns) * opts.stepY,
    width: opts.width,
    height: opts.height,
    shape: opts.shape,
  }));
}

export const LESSON_HIGHLIGHTS: Record<string, HighlightTarget[]> = {
  // Quyển 1 · Chủ đề 1 · Chặng 3 (Em Làm Gì Đó?) · TỪ NGỮ
  // Lưới 3×2 thẻ hình có khung nét đứt + nhãn từ bên dưới; khung gợi ý ôm cả thẻ lẫn nhãn.
  "quyen_1:chude01.chang03.noidung01.bai01.hinh01": makeGridTargets({
    prefix: "tu-ngu",
    labels: ["chơi", "hát", "xem ti vi", "ăn cơm", "rửa bát (chén)", "đi học"],
    columns: 3,
    x: 1,
    y: 0.5,
    width: 32,
    height: 47.5,
    stepX: 32.85,
    stepY: 50.5,
  }),

  // Quyển 1 · Chủ đề 1 · Chặng 5 (Ôn Tập) · "Nghe, chỉ vào hình phù hợp"
  // Sơ đồ gia đình: vị trí không đều nên liệt kê từng vùng một.
  "quyen_1:chude01.chang05.noidung01.bai01.hinh01": [
    // Ảnh tròn hàng trên — con của các bác/chú/cô (bên bố)
    { id: "anh-noi", label: "anh", x: 4.3, y: 1.5, width: 11.5, height: 10, shape: "circle" },
    { id: "chi-noi", label: "chị", x: 22.5, y: 1.5, width: 11.5, height: 10, shape: "circle" },
    { id: "em-noi-1", label: "em", x: 65, y: 2, width: 11.5, height: 10, shape: "circle" },
    { id: "em-noi-2", label: "em", x: 83.3, y: 2, width: 11.5, height: 10, shape: "circle" },
    // Hàng trên — họ nội (bên bố)
    { id: "bac-noi-1", label: "bác", x: 1, y: 19.5, width: 17.5, height: 19.5 },
    { id: "bac-noi-2", label: "bác", x: 20, y: 19.5, width: 16.5, height: 19.5 },
    { id: "bo", label: "bố", x: 38.5, y: 15.5, width: 22, height: 23.5 },
    { id: "chu", label: "chú", x: 62, y: 19.5, width: 17, height: 19.5 },
    { id: "co", label: "cô", x: 80.5, y: 19.5, width: 17, height: 19.5 },
    // Hàng dưới — họ ngoại (bên mẹ)
    { id: "bac-ngoai-1", label: "bác", x: 1, y: 60.5, width: 16.5, height: 18.5 },
    { id: "bac-ngoai-2", label: "bác", x: 20, y: 60.5, width: 16.5, height: 18.5 },
    { id: "me", label: "mẹ", x: 38.5, y: 57, width: 22, height: 22.5 },
    { id: "cau", label: "cậu", x: 62, y: 60.5, width: 17, height: 18.5 },
    { id: "di", label: "dì", x: 80.5, y: 60.5, width: 17, height: 18.5 },
    // Ảnh tròn hàng dưới — con của các bác/cậu/dì (bên mẹ)
    { id: "anh-ngoai", label: "anh", x: 4.4, y: 84.5, width: 11.5, height: 10, shape: "circle" },
    { id: "chi-ngoai", label: "chị", x: 22.7, y: 84.5, width: 11.5, height: 10, shape: "circle" },
    { id: "em-ngoai-1", label: "em", x: 65, y: 84.5, width: 11.5, height: 10, shape: "circle" },
    { id: "em-ngoai-2", label: "em", x: 83.5, y: 84.5, width: 11.5, height: 10, shape: "circle" },
  ],
};
