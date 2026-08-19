create type "public"."app_role" as enum ('staff');


  create table "public"."badge_rule" (
    "slug" text not null,
    "rule_type" text not null,
    "rule_ref" text
      );


alter table "public"."badge_rule" enable row level security;


  create table "public"."speaking_progress" (
    "user_id" uuid not null,
    "sentence_id" text not null,
    "attempts" integer not null default 0,
    "best_stars" smallint not null default 0,
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."speaking_progress" enable row level security;


  create table "public"."speaking_sentence" (
    "id" text not null,
    "topic_id" text not null,
    "text" text not null,
    "position" integer not null
      );


alter table "public"."speaking_sentence" enable row level security;


  create table "public"."speaking_topic" (
    "id" text not null,
    "emoji" text not null,
    "title" text not null,
    "position" integer not null
      );


alter table "public"."speaking_topic" enable row level security;


  create table "public"."user_badges" (
    "user_id" uuid not null,
    "badge_slug" text not null,
    "earned_at" timestamp with time zone not null default now()
      );


alter table "public"."user_badges" enable row level security;


  create table "public"."user_roles" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "role" public.app_role not null
      );


alter table "public"."user_roles" enable row level security;

alter table "public"."hinh" drop column "storage_bucket";

alter table "public"."hinh" drop column "uploaded_at";

CREATE UNIQUE INDEX badge_rule_pkey ON public.badge_rule USING btree (slug);

CREATE UNIQUE INDEX speaking_progress_pkey ON public.speaking_progress USING btree (user_id, sentence_id);

CREATE UNIQUE INDEX speaking_sentence_pkey ON public.speaking_sentence USING btree (id);

CREATE UNIQUE INDEX speaking_topic_pkey ON public.speaking_topic USING btree (id);

CREATE UNIQUE INDEX user_badges_pkey ON public.user_badges USING btree (user_id, badge_slug);

CREATE INDEX user_badges_user_id_idx ON public.user_badges USING btree (user_id);

CREATE UNIQUE INDEX user_roles_pkey ON public.user_roles USING btree (id);

CREATE INDEX user_roles_user_id_idx ON public.user_roles USING btree (user_id);

CREATE UNIQUE INDEX user_roles_user_id_role_key ON public.user_roles USING btree (user_id, role);

alter table "public"."badge_rule" add constraint "badge_rule_pkey" PRIMARY KEY using index "badge_rule_pkey";

alter table "public"."speaking_progress" add constraint "speaking_progress_pkey" PRIMARY KEY using index "speaking_progress_pkey";

alter table "public"."speaking_sentence" add constraint "speaking_sentence_pkey" PRIMARY KEY using index "speaking_sentence_pkey";

alter table "public"."speaking_topic" add constraint "speaking_topic_pkey" PRIMARY KEY using index "speaking_topic_pkey";

alter table "public"."user_badges" add constraint "user_badges_pkey" PRIMARY KEY using index "user_badges_pkey";

alter table "public"."user_roles" add constraint "user_roles_pkey" PRIMARY KEY using index "user_roles_pkey";

alter table "public"."speaking_progress" add constraint "speaking_progress_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."speaking_progress" validate constraint "speaking_progress_user_id_fkey";

alter table "public"."speaking_sentence" add constraint "speaking_sentence_topic_id_fkey" FOREIGN KEY (topic_id) REFERENCES public.speaking_topic(id) ON DELETE CASCADE not valid;

alter table "public"."speaking_sentence" validate constraint "speaking_sentence_topic_id_fkey";

alter table "public"."user_badges" add constraint "user_badges_badge_slug_fkey" FOREIGN KEY (badge_slug) REFERENCES public.badge_rule(slug) ON DELETE CASCADE not valid;

alter table "public"."user_badges" validate constraint "user_badges_badge_slug_fkey";

alter table "public"."user_badges" add constraint "user_badges_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_badges" validate constraint "user_badges_user_id_fkey";

alter table "public"."user_roles" add constraint "user_roles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_roles" validate constraint "user_roles_user_id_fkey";

alter table "public"."user_roles" add constraint "user_roles_user_id_role_key" UNIQUE using index "user_roles_user_id_role_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$function$
;

CREATE OR REPLACE FUNCTION public.recompute_user_badges(target_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.trg_recompute_user_badges()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  PERFORM recompute_user_badges(COALESCE(NEW.user_id, OLD.user_id));
  RETURN NULL;
END;
$function$
;

grant delete on table "public"."badge_rule" to "anon";

grant insert on table "public"."badge_rule" to "anon";

grant references on table "public"."badge_rule" to "anon";

grant select on table "public"."badge_rule" to "anon";

grant trigger on table "public"."badge_rule" to "anon";

grant truncate on table "public"."badge_rule" to "anon";

grant update on table "public"."badge_rule" to "anon";

grant delete on table "public"."badge_rule" to "authenticated";

grant insert on table "public"."badge_rule" to "authenticated";

grant references on table "public"."badge_rule" to "authenticated";

grant select on table "public"."badge_rule" to "authenticated";

grant trigger on table "public"."badge_rule" to "authenticated";

grant truncate on table "public"."badge_rule" to "authenticated";

grant update on table "public"."badge_rule" to "authenticated";

grant delete on table "public"."badge_rule" to "service_role";

grant insert on table "public"."badge_rule" to "service_role";

grant references on table "public"."badge_rule" to "service_role";

grant select on table "public"."badge_rule" to "service_role";

grant trigger on table "public"."badge_rule" to "service_role";

grant truncate on table "public"."badge_rule" to "service_role";

grant update on table "public"."badge_rule" to "service_role";

grant delete on table "public"."speaking_progress" to "anon";

grant insert on table "public"."speaking_progress" to "anon";

grant references on table "public"."speaking_progress" to "anon";

grant select on table "public"."speaking_progress" to "anon";

grant trigger on table "public"."speaking_progress" to "anon";

grant truncate on table "public"."speaking_progress" to "anon";

grant update on table "public"."speaking_progress" to "anon";

grant delete on table "public"."speaking_progress" to "authenticated";

grant insert on table "public"."speaking_progress" to "authenticated";

grant references on table "public"."speaking_progress" to "authenticated";

grant select on table "public"."speaking_progress" to "authenticated";

grant trigger on table "public"."speaking_progress" to "authenticated";

grant truncate on table "public"."speaking_progress" to "authenticated";

grant update on table "public"."speaking_progress" to "authenticated";

grant delete on table "public"."speaking_progress" to "service_role";

grant insert on table "public"."speaking_progress" to "service_role";

grant references on table "public"."speaking_progress" to "service_role";

grant select on table "public"."speaking_progress" to "service_role";

grant trigger on table "public"."speaking_progress" to "service_role";

grant truncate on table "public"."speaking_progress" to "service_role";

grant update on table "public"."speaking_progress" to "service_role";

grant delete on table "public"."speaking_sentence" to "anon";

grant insert on table "public"."speaking_sentence" to "anon";

grant references on table "public"."speaking_sentence" to "anon";

grant select on table "public"."speaking_sentence" to "anon";

grant trigger on table "public"."speaking_sentence" to "anon";

grant truncate on table "public"."speaking_sentence" to "anon";

grant update on table "public"."speaking_sentence" to "anon";

grant delete on table "public"."speaking_sentence" to "authenticated";

grant insert on table "public"."speaking_sentence" to "authenticated";

grant references on table "public"."speaking_sentence" to "authenticated";

grant select on table "public"."speaking_sentence" to "authenticated";

grant trigger on table "public"."speaking_sentence" to "authenticated";

grant truncate on table "public"."speaking_sentence" to "authenticated";

grant update on table "public"."speaking_sentence" to "authenticated";

grant delete on table "public"."speaking_sentence" to "service_role";

grant insert on table "public"."speaking_sentence" to "service_role";

grant references on table "public"."speaking_sentence" to "service_role";

grant select on table "public"."speaking_sentence" to "service_role";

grant trigger on table "public"."speaking_sentence" to "service_role";

grant truncate on table "public"."speaking_sentence" to "service_role";

grant update on table "public"."speaking_sentence" to "service_role";

grant delete on table "public"."speaking_topic" to "anon";

grant insert on table "public"."speaking_topic" to "anon";

grant references on table "public"."speaking_topic" to "anon";

grant select on table "public"."speaking_topic" to "anon";

grant trigger on table "public"."speaking_topic" to "anon";

grant truncate on table "public"."speaking_topic" to "anon";

grant update on table "public"."speaking_topic" to "anon";

grant delete on table "public"."speaking_topic" to "authenticated";

grant insert on table "public"."speaking_topic" to "authenticated";

grant references on table "public"."speaking_topic" to "authenticated";

grant select on table "public"."speaking_topic" to "authenticated";

grant trigger on table "public"."speaking_topic" to "authenticated";

grant truncate on table "public"."speaking_topic" to "authenticated";

grant update on table "public"."speaking_topic" to "authenticated";

grant delete on table "public"."speaking_topic" to "service_role";

grant insert on table "public"."speaking_topic" to "service_role";

grant references on table "public"."speaking_topic" to "service_role";

grant select on table "public"."speaking_topic" to "service_role";

grant trigger on table "public"."speaking_topic" to "service_role";

grant truncate on table "public"."speaking_topic" to "service_role";

grant update on table "public"."speaking_topic" to "service_role";

grant delete on table "public"."user_badges" to "anon";

grant insert on table "public"."user_badges" to "anon";

grant references on table "public"."user_badges" to "anon";

grant select on table "public"."user_badges" to "anon";

grant trigger on table "public"."user_badges" to "anon";

grant truncate on table "public"."user_badges" to "anon";

grant update on table "public"."user_badges" to "anon";

grant delete on table "public"."user_badges" to "authenticated";

grant insert on table "public"."user_badges" to "authenticated";

grant references on table "public"."user_badges" to "authenticated";

grant select on table "public"."user_badges" to "authenticated";

grant trigger on table "public"."user_badges" to "authenticated";

grant truncate on table "public"."user_badges" to "authenticated";

grant update on table "public"."user_badges" to "authenticated";

grant delete on table "public"."user_badges" to "service_role";

grant insert on table "public"."user_badges" to "service_role";

grant references on table "public"."user_badges" to "service_role";

grant select on table "public"."user_badges" to "service_role";

grant trigger on table "public"."user_badges" to "service_role";

grant truncate on table "public"."user_badges" to "service_role";

grant update on table "public"."user_badges" to "service_role";

grant delete on table "public"."user_roles" to "anon";

grant insert on table "public"."user_roles" to "anon";

grant references on table "public"."user_roles" to "anon";

grant select on table "public"."user_roles" to "anon";

grant trigger on table "public"."user_roles" to "anon";

grant truncate on table "public"."user_roles" to "anon";

grant update on table "public"."user_roles" to "anon";

grant delete on table "public"."user_roles" to "authenticated";

grant insert on table "public"."user_roles" to "authenticated";

grant references on table "public"."user_roles" to "authenticated";

grant select on table "public"."user_roles" to "authenticated";

grant trigger on table "public"."user_roles" to "authenticated";

grant truncate on table "public"."user_roles" to "authenticated";

grant update on table "public"."user_roles" to "authenticated";

grant delete on table "public"."user_roles" to "service_role";

grant insert on table "public"."user_roles" to "service_role";

grant references on table "public"."user_roles" to "service_role";

grant select on table "public"."user_roles" to "service_role";

grant trigger on table "public"."user_roles" to "service_role";

grant truncate on table "public"."user_roles" to "service_role";

grant update on table "public"."user_roles" to "service_role";


  create policy "Public read badge rules"
  on "public"."badge_rule"
  as permissive
  for select
  to public
using (true);



  create policy "Staff read all speaking progress"
  on "public"."speaking_progress"
  as permissive
  for select
  to public
using (public.has_role(auth.uid(), 'staff'::public.app_role));



  create policy "Users delete own speaking progress"
  on "public"."speaking_progress"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users insert own speaking progress"
  on "public"."speaking_progress"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users read own speaking progress"
  on "public"."speaking_progress"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users update own speaking progress"
  on "public"."speaking_progress"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Public read speaking_sentence"
  on "public"."speaking_sentence"
  as permissive
  for select
  to public
using (true);



  create policy "Public read speaking_topic"
  on "public"."speaking_topic"
  as permissive
  for select
  to public
using (true);



  create policy "Public read badges"
  on "public"."user_badges"
  as permissive
  for select
  to public
using (true);



  create policy "Staff read all progress"
  on "public"."user_progress"
  as permissive
  for select
  to public
using (public.has_role(auth.uid(), 'staff'::public.app_role));



  create policy "Users read own roles"
  on "public"."user_roles"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));


CREATE TRIGGER trg_user_progress_badges_delete AFTER DELETE ON public.user_progress FOR EACH ROW WHEN ((old.completed_at IS NOT NULL)) EXECUTE FUNCTION public.trg_recompute_user_badges();

CREATE TRIGGER trg_user_progress_badges_insert AFTER INSERT ON public.user_progress FOR EACH ROW WHEN ((new.completed_at IS NOT NULL)) EXECUTE FUNCTION public.trg_recompute_user_badges();

CREATE TRIGGER trg_user_progress_badges_update AFTER UPDATE ON public.user_progress FOR EACH ROW WHEN ((new.completed_at IS DISTINCT FROM old.completed_at)) EXECUTE FUNCTION public.trg_recompute_user_badges();


