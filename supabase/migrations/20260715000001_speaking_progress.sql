-- sentence_id is a plain text column (no FK) because it must also hold ids
-- for lesson-derived speaking sentences (e.g. "${bai.id}#t${i}"), which are
-- not rows in speaking_sentence.
CREATE TABLE public.speaking_progress (
  user_id     uuid     NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sentence_id text     NOT NULL,
  attempts    integer  NOT NULL DEFAULT 0,
  best_stars  smallint NOT NULL DEFAULT 0,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, sentence_id)
);

ALTER TABLE public.speaking_progress ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.speaking_progress TO authenticated;
GRANT ALL                             ON public.speaking_progress TO service_role;

CREATE POLICY "Users read own speaking progress"
  ON public.speaking_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own speaking progress"
  ON public.speaking_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own speaking progress"
  ON public.speaking_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users delete own speaking progress"
  ON public.speaking_progress FOR DELETE USING (auth.uid() = user_id);
