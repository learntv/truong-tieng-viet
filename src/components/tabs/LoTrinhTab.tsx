import type { QuyenNumber } from "@/lib/learning";
import { LearningTab } from "@/components/tabs/LearningTab";

export function QuyenRoadmap({
  quyenNumber,
  chuDeIndex,
}: {
  quyenNumber: QuyenNumber;
  chuDeIndex: number;
}) {
  return (
    <div className="relative flex w-full flex-col">
      <LearningTab quyenNumber={quyenNumber} chuDeIndex={chuDeIndex} />
    </div>
  );
}
