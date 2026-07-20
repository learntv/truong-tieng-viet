import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type AppRole = "staff" | "admin";

/**
 * True when the signed-in user has the given role. Reads user_roles, which RLS
 * restricts to the caller's own rows — so this only ever reveals your own roles.
 * The database is the real gate (staff-read RLS on the progress tables); this
 * hook just drives UI (showing the "Báo cáo" menu item).
 */
export function useHasRole(role: AppRole) {
  const { user } = useAuth();
  const [hasRole, setHasRole] = useState(false);

  useEffect(() => {
    if (!user) {
      setHasRole(false);
      return;
    }
    let cancelled = false;
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", role)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setHasRole(!!data);
      });
    return () => {
      cancelled = true;
    };
  }, [user, role]);

  return hasRole;
}
