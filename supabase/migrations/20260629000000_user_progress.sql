CREATE TABLE public.user_progress (
  user_id       uuid        NOT NULL REFERENCES auth.users(id)   ON DELETE CASCADE,
  chang_id      text        NOT NULL REFERENCES public.chang(id) ON DELETE CASCADE,
  noidung_index integer     NOT NULL DEFAULT 0,
  completed_at  timestamptz,
  PRIMARY KEY (user_id, chang_id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_progress TO authenticated;
GRANT ALL                             ON public.user_progress TO service_role;

CREATE POLICY "Users read own progress"
  ON public.user_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own progress"
  ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own progress"
  ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users delete own progress"
  ON public.user_progress FOR DELETE USING (auth.uid() = user_id);
