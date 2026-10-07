import { MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import phanThiQuynhTrang from "@/assets/teachers/phan-thi-quynh-trang.webp";
import ngoNguyenNgocDieuAnh from "@/assets/teachers/ngo-nguyen-ngoc-dieu-anh.webp";
import nguyenThiThanhBinh from "@/assets/teachers/nguyen-thi-thanh-binh.webp";
import hoangMinhHa from "@/assets/teachers/hoang-minh-ha.webp";
import doThiPhuongMai from "@/assets/teachers/do-thi-phuong-mai.webp";

type Teacher = {
  name: string;
  photo: string;
  role: string;
  place: string;
  bio: string;
};

const TEACHERS: Teacher[] = [
  {
    name: "Phan Thị Quỳnh Trang",
    photo: phanThiQuynhTrang,
    role: "Chủ tịch Hội đồng văn hoá và giáo dục Canada Việt Nam (CVCEC)",
    place: "CVCEC tại Canada",
    bio: "Phó Tổng thư ký Mạng lưới giảng dạy tiếng Việt và văn hóa Việt Nam toàn cầu.",
  },
  {
    name: "Hoàng Minh Hà",
    photo: hoangMinhHa,
    role: "Giám đốc Học thuật Tiếng Việt",
    place: "CVCEC tại PEI, Canada",
    bio: "Là Giám đốc Học thuật và Tiếng Việt tại CVCEC (PEI), cô Hoàng Minh Hà dẫn dắt việc phát triển chương trình giảng dạy ngôn ngữ cùng các sáng kiến bảo tồn văn hóa, góp phần củng cố bản sắc kiều bào và thúc đẩy sự tham gia của thế hệ trẻ.",
  },
  {
    name: "Đỗ Thị Phương Mai",
    photo: doThiPhuongMai,
    role: "Cố vấn Học thuật và Công nghệ Giáo dục",
    place: "CVCEC tại Phần Lan",
    bio: "Với tư cách là Cố vấn Học thuật tại CVCEC (Phần Lan), cô Đỗ Thị Phương Mai chuyên sâu về phương pháp giảng dạy tiếng Việt, thiết kế các chương trình học dựa trên nền tảng di sản nhằm đảm bảo trải nghiệm học tập hiệu quả, lôi cuốn và mang đậm bản sắc văn hóa.",
  },
  {
    name: "Nguyễn Thị Thanh Bình",
    photo: nguyenThiThanhBinh,
    role: "Giáo viên Tiếng Việt",
    place: "CVCEC tại PEI, Canada",
    bio: "Cô Nguyễn Thị Thanh Bình là nhà giáo dục tiếng Việt tận tâm thuộc CVCEC tại PEI, mang trong mình tình yêu nhiệt huyết với sứ mệnh bảo tồn di sản văn hóa và thúc đẩy sự gắn kết cộng đồng.",
  },
  {
    name: "Ngô Nguyễn Ngọc Diệu Anh",
    photo: ngoNguyenNgocDieuAnh,
    role: "Giáo viên Tiếng Việt",
    place: "CVCEC tại Manitoba, Canada",
    bio: "Với vai trò giáo viên tiếng Việt thuộc CVCEC tại Manitoba, cô Ngô Nguyễn Ngọc Diệu Anh luôn truyền cảm hứng và tiếp thêm sức mạnh cho học sinh thông qua ngôn ngữ và các hoạt động kết nối văn hóa.",
  },
];

/**
 * Five equal cards. A six-column grid with every card spanning two lets the
 * second row of two start at column 2, so it sits centred under the three.
 * At two columns the odd last card spans both and is held to half width.
 */
export function TeachersTab() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
        {TEACHERS.map((t) => (
          <li
            key={t.name}
            className="lg:col-span-2 lg:[&:nth-child(4)]:col-start-2 sm:last:col-span-2 sm:last:mx-auto sm:last:w-1/2 lg:last:mx-0 lg:last:w-auto"
          >
            <TeacherCard teacher={t} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function TeacherCard({ teacher: t }: { teacher: Teacher }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex h-full w-full cursor-pointer flex-col items-center rounded-2xl border border-border bg-card p-6 text-center transition-colors hover:border-primary"
        >
          <Portrait teacher={t} className="h-32 w-32" />
          <span className="mt-4 font-display text-lg font-bold leading-snug text-foreground">
            {t.name}
          </span>
          <span className="mt-1 text-sm text-muted-foreground">{t.role}</span>
          <Place place={t.place} className="mt-2" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-2xl">
        <div className="flex flex-col items-center text-center">
          <Portrait teacher={t} className="h-36 w-36" />
          <DialogTitle className="mt-4 font-display text-xl font-bold leading-snug text-foreground">
            {t.name}
          </DialogTitle>
          <p className="mt-1 text-sm text-muted-foreground">{t.role}</p>
          <Place place={t.place} className="mt-2" />
        </div>
        <DialogDescription className="text-base leading-relaxed text-foreground">
          {t.bio}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

function Portrait({ teacher: t, className }: { teacher: Teacher; className: string }) {
  return (
    <img
      src={t.photo}
      alt={t.name}
      loading="lazy"
      className={`${className} shrink-0 rounded-full object-cover object-top`}
    />
  );
}

function Place({ place, className }: { place: string; className: string }) {
  return (
    <span className={`${className} inline-flex items-center gap-1.5 text-sm text-muted-foreground`}>
      <MapPin className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
      {place}
    </span>
  );
}
