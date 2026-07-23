import { useState } from "react";
import type { HighlightTarget } from "@/data/lessonHighlights";

// Lớp vùng gợi ý tương tác đè lên hình bài học. Phần tử cha phải là
// `position: relative` và ôm sát đúng kích thước hình, vì tọa độ target tính theo %.
// Desktop: rê chuột vào vùng nào thì khung đỏ hiện quanh vùng đó, rời chuột thì tắt.
// Mobile: chạm vào vùng để hiện khung, chạm vùng khác để chuyển, chạm nền hình để tắt.
export function ImageHighlightOverlay({ targets }: { targets: HighlightTarget[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const boxStyle = (t: HighlightTarget): React.CSSProperties => ({
    left: `${t.x}%`,
    top: `${t.y}%`,
    width: `${t.width}%`,
    height: `${t.height}%`,
  });

  // Bo tròn theo hình dạng vùng: ảnh chân dung tròn dùng khung tròn.
  // Áp cho cả nút hotspot vì border-radius cũng giới hạn vùng nhận chuột/chạm.
  const shapeClass = (t: HighlightTarget) => (t.shape === "circle" ? "rounded-full" : "rounded-xl");

  return (
    <div
      className="absolute inset-0"
      data-testid="image-highlight-overlay"
      // Chạm/bấm vào nền hình (ngoài mọi vùng gợi ý) thì tắt khung đỏ
      onClick={() => setActiveId(null)}
    >
      {targets.map((t) => (
        <button
          key={t.id}
          type="button"
          aria-label={t.label ? `Gợi ý: ${t.label}` : "Gợi ý"}
          aria-pressed={t.id === activeId}
          className={["absolute cursor-default bg-transparent outline-none", shapeClass(t)].join(" ")}
          style={boxStyle(t)}
          onPointerEnter={(e) => {
            if (e.pointerType !== "touch") setActiveId(t.id);
          }}
          onPointerLeave={(e) => {
            if (e.pointerType !== "touch") {
              setActiveId((cur) => (cur === t.id ? null : cur));
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            setActiveId((cur) => (cur === t.id ? null : t.id));
          }}
          onFocus={() => setActiveId(t.id)}
          onBlur={() => setActiveId((cur) => (cur === t.id ? null : cur))}
        />
      ))}
    </div>
  );
}
