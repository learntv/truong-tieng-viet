-- Collectible badges.
--
-- Badges live in their own table rather than being derived from user_progress because
-- user_progress is private (own-rows-only RLS) and badges must be publicly visible so children
-- can look at each other's collections. Awarding happens in the database; the client never
-- writes here.
--
-- A badge is identified by a slug and says nothing about *how* it is earned — the earning rule
-- is a row in badge_rule. Today the only rule type is 'chude_complete' (finish every chặng in a
-- chủ đề), but streaks, the alphabet, speaking practice or one-off awards can be added by
-- inserting a new rule type and teaching `recompute_user_badges` to evaluate it. Neither this
-- table nor the client needs to change.

CREATE TABLE public.badge_rule (
  slug      text    PRIMARY KEY,
  -- Discriminator understood by `recompute_user_badges`. See that function for the supported
  -- values and what `rule_ref` means for each. A new kind of badge adds a value here rather
  -- than a column; add columns only when a rule genuinely needs a parameter of its own.
  rule_type text    NOT NULL,
  -- Optional id the rule points at, e.g. a chude_id for 'chude_complete'.
  rule_ref  text
);

CREATE TABLE public.user_badges (
  user_id    uuid        NOT NULL REFERENCES auth.users(id)        ON DELETE CASCADE,
  badge_slug text        NOT NULL REFERENCES public.badge_rule(slug) ON DELETE CASCADE,
  earned_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, badge_slug)
);

CREATE INDEX user_badges_user_id_idx ON public.user_badges (user_id);

ALTER TABLE public.badge_rule  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Read-only to everyone; only the SECURITY DEFINER function below ever writes user_badges.
GRANT SELECT ON public.badge_rule, public.user_badges TO anon, authenticated;
GRANT ALL    ON public.badge_rule, public.user_badges TO service_role;

CREATE POLICY "Public read badge rules" ON public.badge_rule  FOR SELECT USING (true);
CREATE POLICY "Public read badges"      ON public.user_badges FOR SELECT USING (true);

-- Re-evaluate every badge rule for one user and sync the collection to the result.
--
-- This is the single entry point for awarding. Any future source of badges (a speaking streak,
-- the alphabet game, a manual award) calls this same function from its own trigger; all that
-- changes here is a new branch for the new rule_type.
--
-- It recomputes rather than only inserting, so resetting progress correctly removes a badge.
CREATE OR REPLACE FUNCTION recompute_user_badges(target_user_id uuid)
RETURNS void AS $$
DECLARE
  rule    public.badge_rule%ROWTYPE;
  qualifies boolean;
BEGIN
  FOR rule IN SELECT * FROM public.badge_rule LOOP
    qualifies := false;

    IF rule.rule_type = 'chude_complete' THEN
      -- Earned when the user has completed every chặng belonging to rule_ref (a chude_id).
      SELECT COUNT(*) > 0
         AND COUNT(*) FILTER (WHERE up.completed_at IS NOT NULL) >= COUNT(*)
        INTO qualifies
        FROM public.chang c
        LEFT JOIN public.user_progress up
               ON up.chang_id = c.id AND up.user_id = target_user_id
       WHERE c.chude_id = rule.rule_ref;

    END IF;

    IF qualifies THEN
      INSERT INTO public.user_badges (user_id, badge_slug)
      VALUES (target_user_id, rule.slug)
      ON CONFLICT (user_id, badge_slug) DO NOTHING;
    ELSE
      DELETE FROM public.user_badges
       WHERE user_id = target_user_id AND badge_slug = rule.slug;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- These run as the owner and bypass RLS, so they must not be callable by clients. Postgres
-- grants EXECUTE to PUBLIC by default, which PostgREST would happily expose as an RPC endpoint
-- taking an arbitrary user_id. Only the triggers and service_role need them.
REVOKE EXECUTE ON FUNCTION recompute_user_badges(uuid) FROM public, anon, authenticated;
GRANT  EXECUTE ON FUNCTION recompute_user_badges(uuid) TO service_role;

CREATE OR REPLACE FUNCTION trg_recompute_user_badges()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM recompute_user_badges(COALESCE(NEW.user_id, OLD.user_id));
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION trg_recompute_user_badges() FROM public, anon, authenticated;

-- Three triggers rather than one, each guarded by a WHEN clause, because no single condition can
-- reference both OLD and NEW across INSERT/UPDATE/DELETE.
--
-- The guards matter a lot: `savePosition` writes to user_progress on *every slide advance*, and
-- an unguarded trigger would re-evaluate every badge rule on each one, to reach the answer it
-- already had. Badges can only change when completed_at changes, so that is the only thing that
-- wakes this up — reducing recomputation from once per page turn to once per chặng finished.
CREATE TRIGGER trg_user_progress_badges_insert
  AFTER INSERT ON public.user_progress
  FOR EACH ROW WHEN (NEW.completed_at IS NOT NULL)
  EXECUTE FUNCTION trg_recompute_user_badges();

CREATE TRIGGER trg_user_progress_badges_update
  AFTER UPDATE ON public.user_progress
  FOR EACH ROW WHEN (NEW.completed_at IS DISTINCT FROM OLD.completed_at)
  EXECUTE FUNCTION trg_recompute_user_badges();

CREATE TRIGGER trg_user_progress_badges_delete
  AFTER DELETE ON public.user_progress
  FOR EACH ROW WHEN (OLD.completed_at IS NOT NULL)
  EXECUTE FUNCTION trg_recompute_user_badges();

-- Seed the eight landmark badges. The first four map to the Quyển 1 chủ đề by their position in
-- the ordered chude list — the same ordering the client uses. The remaining four have no rule
-- target yet (their chủ đề isn't written), so they can never be earned and the client shows them
-- as "sắp có"; give them a rule_ref once the content exists.
INSERT INTO public.badge_rule (slug, rule_type, rule_ref)
SELECT s.slug, 'chude_complete', c.id
  FROM (VALUES
         ('ha-long',     0),
         ('hoi-an',      1),
         ('landmark-81', 2),
         ('cau-vang',    3)
       ) AS s(slug, chude_position)
  LEFT JOIN (
    SELECT id, ROW_NUMBER() OVER (ORDER BY position) - 1 AS idx FROM public.chude
  ) c ON c.idx = s.chude_position;

-- Display order lives in the client catalogue (`BADGES`), so it is not duplicated here.
INSERT INTO public.badge_rule (slug, rule_type, rule_ref) VALUES
  ('ho-hoan-kiem',          'chude_complete', NULL),
  ('co-do-hue',             'chude_complete', NULL),
  ('cho-ben-thanh',         'chude_complete', NULL),
  ('quang-truong-lam-vien', 'chude_complete', NULL);

-- Backfill for progress that already exists. Driven off user_progress rather than profiles:
-- those are exactly the users who could have earned anything, and it does not assume every
-- account has a profile row.
SELECT recompute_user_badges(u.user_id)
  FROM (SELECT DISTINCT user_id FROM public.user_progress) u;
