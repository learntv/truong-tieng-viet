import haLongBadge from "@/assets/badges/ha-long.png";
import hoiAnBadge from "@/assets/badges/hoi-an.png";
import landmark81Badge from "@/assets/badges/landmark-81.png";
import cauVangBadge from "@/assets/badges/cau-vang.png";
import hoHoanKiemBadge from "@/assets/badges/ho-hoan-kiem.png";
import coDoHueBadge from "@/assets/badges/co-do-hue.png";
import choBenThanhBadge from "@/assets/badges/cho-ben-thanh.png";
import quangTruongLamVienBadge from "@/assets/badges/quang-truong-lam-vien.png";

/**
 * A collectible badge, identified by its slug.
 *
 * This file is presentation only — artwork and wording. Whether a badge has been earned is
 * decided entirely in the database by the matching `badge_rule` row (see the `user_badges`
 * migration), so a badge earned some future way — a streak, the alphabet game, a one-off award —
 * needs nothing here beyond artwork and a sentence saying how to get it.
 */
export type Badge = {
  /** Stable key. Matches `badge_rule.slug` in the database and the artwork's filename. */
  slug: string;
  name: string;
  art: string;
  /** One line telling the child how to earn it, shown under the badge. */
  howToEarn: string;
  /**
   * Set when the badge exists as artwork but its rule can't be satisfied yet (e.g. the chủ đề
   * isn't written). Shown as a permanently locked "sắp có" slot.
   */
  upcoming?: boolean;
  /**
   * Only for badges that happen to be tied to a chủ đề: which one, so the roadmap page can show
   * the badge in context and light it up the instant the last chặng is done, without waiting for
   * the server. Purely a display shortcut — it is not what makes the badge earnable.
   */
  chuDeIndex?: number;
};

const COMPLETE_CHU_DE = "Hoàn thành tất cả các chặng của chủ đề này.";

export const BADGES: Badge[] = [
  {
    slug: "ha-long",
    name: "Vịnh Hạ Long",
    art: haLongBadge,
    howToEarn: COMPLETE_CHU_DE,
    chuDeIndex: 0,
  },
  {
    slug: "hoi-an",
    name: "Phố cổ Hội An",
    art: hoiAnBadge,
    howToEarn: COMPLETE_CHU_DE,
    chuDeIndex: 1,
  },
  {
    slug: "landmark-81",
    name: "Tòa nhà Landmark 81",
    art: landmark81Badge,
    howToEarn: COMPLETE_CHU_DE,
    chuDeIndex: 2,
  },
  {
    slug: "cau-vang",
    name: "Cầu Vàng",
    art: cauVangBadge,
    howToEarn: COMPLETE_CHU_DE,
    chuDeIndex: 3,
  },
  {
    slug: "ho-hoan-kiem",
    name: "Hồ Hoàn Kiếm",
    art: hoHoanKiemBadge,
    howToEarn: COMPLETE_CHU_DE,
    upcoming: true,
  },
  {
    slug: "co-do-hue",
    name: "Cố đô Huế",
    art: coDoHueBadge,
    howToEarn: COMPLETE_CHU_DE,
    upcoming: true,
  },
  {
    slug: "cho-ben-thanh",
    name: "Chợ Bến Thành",
    art: choBenThanhBadge,
    howToEarn: COMPLETE_CHU_DE,
    upcoming: true,
  },
  {
    slug: "quang-truong-lam-vien",
    name: "Quảng trường Lâm Viên",
    art: quangTruongLamVienBadge,
    howToEarn: COMPLETE_CHU_DE,
    upcoming: true,
  },
];

/** The badge tied to a chủ đề, if there is one. Used by the roadmap page for local display. */
export function badgeForChuDe(chuDeIndex: number): Badge | undefined {
  return BADGES.find((b) => b.chuDeIndex === chuDeIndex && !b.upcoming);
}
