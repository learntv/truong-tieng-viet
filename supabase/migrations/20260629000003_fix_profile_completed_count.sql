-- Backfill completed_count for profiles that were created before any lesson
-- completions triggered the sync trigger (trigger is no-op when no profile row exists).
UPDATE public.profiles p
SET completed_count = (
  SELECT COUNT(*) FROM public.user_progress up
  WHERE up.user_id = p.id AND up.completed_at IS NOT NULL
);

-- Init completed_count correctly when a profile is first inserted,
-- so it reflects lessons already completed before the profile row was created.
CREATE OR REPLACE FUNCTION public.init_profile_completed_count()
RETURNS TRIGGER AS $$
BEGIN
  NEW.completed_count := (
    SELECT COUNT(*) FROM public.user_progress
    WHERE user_id = NEW.id AND completed_at IS NOT NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_init_profile_completed_count
  BEFORE INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.init_profile_completed_count();
