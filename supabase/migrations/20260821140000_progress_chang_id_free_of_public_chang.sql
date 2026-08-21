-- The learning tree moved to the Payload CMS: src/lib/learning.ts reads chủ đề / chặng / nội
-- dung / bài / hình over the CMS's REST API and no longer touches public.chude, public.chang,
-- public.noidung, public.bai or public.hinh. Those tables now hold nothing but the frozen
-- import the CMS was seeded from.
--
-- user_progress.chang_id kept a foreign key into public.chang, which makes the frozen copy
-- authoritative over content it no longer owns: a chặng added in the admin panel has no row
-- there, so the first student to finish it hits a 23503 and their progress silently fails to
-- save. Drop the constraint — chang_id is now just the chặng's id as the CMS composes it
-- (`quyen_1:chude01.chang03`), with no table to point at.
--
-- Nothing else about the column changes: same text ids, same primary key, same RLS. Existing
-- rows still match the chặng they always did, because the ids the CMS produces are rebuilt
-- from position and are identical to the ones public.chang held.
alter table "public"."user_progress"
  drop constraint if exists "user_progress_chang_id_fkey";
