-- The learning tree and the speaking topics live in the Payload CMS now (payload.chu_de and
-- payload.speaking_topics, read over its REST API by src/lib/learning.ts and
-- src/hooks/useSpeakingContent.ts). These public tables are the frozen copies the CMS was seeded
-- from, and nothing reads them any more.
--
-- Progress is unaffected: user_progress.chang_id and speaking_progress.sentence_id are plain
-- text with no foreign key into these tables, and the CMS reproduces the same ids.
--
-- Children before parents, so no drop leans on CASCADE to take out anything unnamed here.
drop table if exists "public"."hinh";
drop table if exists "public"."bai";
drop table if exists "public"."noidung";
drop table if exists "public"."chang";
drop table if exists "public"."chude";
drop table if exists "public"."quyen";

drop table if exists "public"."speaking_sentence";
drop table if exists "public"."speaking_topic";
