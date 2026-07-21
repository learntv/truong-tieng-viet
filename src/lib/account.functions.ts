import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const deleteOwnAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const userId = context.userId;

    // Best-effort: remove app data first. Errors are logged but don't block
    // auth deletion — the row-level cleanups may already be handled by FK
    // cascade on auth.users, but we run them explicitly for safety.
    const cleanups = await Promise.allSettled([
      supabaseAdmin.from("user_progress").delete().eq("user_id", userId),
      supabaseAdmin.from("profiles").delete().eq("id", userId),
    ]);
    for (const c of cleanups) {
      if (c.status === "rejected") console.error("[deleteOwnAccount] cleanup failed", c.reason);
      else if (c.value.error) console.error("[deleteOwnAccount] cleanup error", c.value.error);
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) throw new Error(error.message);

    return { ok: true };
  });
