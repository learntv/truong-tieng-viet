CREATE TABLE public.profiles (
  id              uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username        text        UNIQUE NOT NULL,
  display_name    text        NOT NULL DEFAULT '',
  avatar_emoji    text,
  avatar_url      text,
  country         text,
  completed_count integer     NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT                    ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE    ON public.profiles TO authenticated;
GRANT ALL                       ON public.profiles TO service_role;

CREATE POLICY "Public read profiles"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Keep completed_count in sync when user_progress changes
CREATE OR REPLACE FUNCTION sync_profile_completed_count()
RETURNS TRIGGER AS $$
DECLARE
  target_user_id uuid;
BEGIN
  target_user_id := COALESCE(NEW.user_id, OLD.user_id);
  UPDATE public.profiles
  SET completed_count = (
    SELECT COUNT(*) FROM public.user_progress
    WHERE user_id = target_user_id AND completed_at IS NOT NULL
  )
  WHERE id = target_user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_sync_profile_completed_count
  AFTER INSERT OR UPDATE OR DELETE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION sync_profile_completed_count();
