-- App-level roles, stored as data keyed by user id.
--
-- This is deliberately a separate table rather than a column on `profiles`:
-- users can UPDATE their own profile row (see profiles RLS), so a role column
-- there would let anyone promote themselves. `user_roles` has no client-facing
-- INSERT/UPDATE/DELETE policy, so roles can only be granted from the Supabase
-- dashboard / service_role.
CREATE TYPE public.app_role AS ENUM ('staff', 'admin');

CREATE TABLE public.user_roles (
  id      uuid           PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid           NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role    public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

CREATE INDEX user_roles_user_id_idx ON public.user_roles (user_id);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL    ON public.user_roles TO service_role;

-- Users may read their own roles so the UI can decide what to show. There is
-- intentionally no write policy: granting a role is an admin action done out of
-- band (SQL / dashboard), never from the client.
CREATE POLICY "Users read own roles"
  ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- SECURITY DEFINER so it can read user_roles without the caller needing direct
-- access to other people's role rows, and so it is safe to reference from other
-- tables' RLS policies without recursion. STABLE: same result within a query.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Staff can read everyone's progress (for the Báo cáo dashboard). RLS policies
-- are OR'd together, so this is purely additive on top of the existing
-- "own rows only" SELECT policies — non-staff are unaffected. SELECT only:
-- staff view student progress, they do not modify it.
CREATE POLICY "Staff read all progress"
  ON public.user_progress FOR SELECT
  USING (public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Staff read all speaking progress"
  ON public.speaking_progress FOR SELECT
  USING (public.has_role(auth.uid(), 'staff'));
