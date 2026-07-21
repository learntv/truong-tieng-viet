import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const deleteOwnAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const userId = context.userId;

    // Fetch the avatar URL before the profile row is gone, so we can retire
    // the R2 object afterward — content-hashed keys can be shared by other
    // profiles, so we only delete it if nobody else still points at it.
    const { data: ownProfile } = await supabaseAdmin
      .from("profiles")
      .select("avatar_url")
      .eq("id", userId)
      .maybeSingle();

    // Best-effort: remove app data first. Errors are logged but don't block
    // auth deletion. profiles.id cascades from auth.users, but user_progress,
    // speaking_progress, user_badges, and user_roles have no FK cascade
    // declared on user_id, so they'd otherwise be orphaned after the user
    // row is gone.
    const cleanups = await Promise.allSettled([
      supabaseAdmin.from("user_progress").delete().eq("user_id", userId),
      supabaseAdmin.from("speaking_progress").delete().eq("user_id", userId),
      supabaseAdmin.from("user_badges").delete().eq("user_id", userId),
      supabaseAdmin.from("user_roles").delete().eq("user_id", userId),
      supabaseAdmin.from("profiles").delete().eq("id", userId),
    ]);
    for (const c of cleanups) {
      if (c.status === "rejected") console.error("[deleteOwnAccount] cleanup failed", c.reason);
      else if (c.value.error) console.error("[deleteOwnAccount] cleanup error", c.value.error);
    }

    const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;
    const avatarUrl = ownProfile?.avatar_url;
    if (publicBaseUrl && avatarUrl?.startsWith(`${publicBaseUrl}/avatars/`)) {
      try {
        const { count } = await supabaseAdmin
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("avatar_url", avatarUrl);
        if (!count) {
          const key = avatarUrl.slice(`${publicBaseUrl}/`.length);
          const { deleteObject } = await import("@/lib/tts/r2.server");
          await deleteObject(key);
        }
      } catch (err) {
        console.error("[deleteOwnAccount] avatar cleanup failed", err);
      }
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) throw new Error(error.message);

    return { ok: true };
  });
