-- Badges are gone from the app. They were awarded by triggers on user_progress that read
-- public.chang, the frozen copy of the learning tree the CMS replaced — so the badge rules
-- judged "every chặng of a chủ đề" against content that no longer changes, and they stood in the
-- way of dropping that copy (a missing public.chang would make every completion fail to save).
--
-- Triggers go first: they call the functions, and a completion must never run one half-dropped.
drop trigger if exists "trg_user_progress_badges_insert" on "public"."user_progress";
drop trigger if exists "trg_user_progress_badges_update" on "public"."user_progress";
drop trigger if exists "trg_user_progress_badges_delete" on "public"."user_progress";

drop function if exists "public"."trg_recompute_user_badges"();
drop function if exists "public"."recompute_user_badges"(uuid);

-- user_badges references badge_rule, so it goes first.
drop table if exists "public"."user_badges";
drop table if exists "public"."badge_rule";
