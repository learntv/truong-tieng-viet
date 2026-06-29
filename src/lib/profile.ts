import { supabase } from "@/integrations/supabase/client";

const VIET_MAP: Record<string, string> = {
  à: "a", á: "a", â: "a", ã: "a", ä: "a", å: "a",
  ă: "a", ắ: "a", ặ: "a", ầ: "a", ấ: "a", ẩ: "a", ẫ: "a", ậ: "a", ằ: "a", ẳ: "a", ẵ: "a",
  è: "e", é: "e", ê: "e", ë: "e", ề: "e", ế: "e", ệ: "e", ể: "e", ễ: "e",
  ì: "i", í: "i", î: "i", ï: "i", ỉ: "i", ị: "i",
  ò: "o", ó: "o", ô: "o", õ: "o", ö: "o", ơ: "o", ờ: "o", ớ: "o", ợ: "o", ở: "o", ỡ: "o",
  ồ: "o", ố: "o", ộ: "o", ổ: "o", ỗ: "o",
  ù: "u", ú: "u", û: "u", ü: "u", ư: "u", ừ: "u", ứ: "u", ự: "u", ử: "u", ữ: "u",
  ỳ: "y", ý: "y", ỷ: "y", ỹ: "y", ỵ: "y",
  đ: "d",
};

export function slugify(text: string): string {
  return text
    .split("")
    .map((c) => VIET_MAP[c] ?? VIET_MAP[c.toLowerCase()] ?? c)
    .join("")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

export function generateUsername(displayName: string, userId: string): string {
  const slug = slugify(displayName) || "hoc-sinh";
  const suffix = userId.replace(/-/g, "").slice(-6);
  return `${slug}-${suffix}`;
}

export async function upsertProfile(params: {
  userId: string;
  displayName: string;
  avatarEmoji?: string | null;
  avatarUrl?: string | null;
  country?: string | null;
}) {
  const username = generateUsername(params.displayName, params.userId);
  const { error } = await supabase.from("profiles").upsert(
    {
      id: params.userId,
      username,
      display_name: params.displayName,
      avatar_emoji: params.avatarEmoji ?? null,
      avatar_url: params.avatarUrl ?? null,
      country: params.country ?? null,
    },
    { onConflict: "id" },
  );
  return { username, error };
}
