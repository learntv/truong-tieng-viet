SET statement_timeout = 0;

SET lock_timeout = 0;

SET idle_in_transaction_session_timeout = 0;

SET client_encoding = 'UTF8';

SET standard_conforming_strings = on;

SELECT pg_catalog.set_config('search_path', '', false);

SET check_function_bodies = false;

SET xmloption = content;

SET client_min_messages = warning;

SET row_security = off;

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."init_profile_completed_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  NEW.completed_count := (
    SELECT COUNT(*) FROM public.user_progress
    WHERE user_id = NEW.id AND completed_at IS NOT NULL
  );
  RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."init_profile_completed_count"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."sync_profile_completed_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;

ALTER FUNCTION "public"."sync_profile_completed_count"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."bai" (
    "id" "text" NOT NULL,
    "noidung_id" "text" NOT NULL,
    "position" integer NOT NULL,
    "text" "jsonb" NOT NULL,
    "meta" "jsonb"
);

ALTER TABLE "public"."bai" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."chang" (
    "id" "text" NOT NULL,
    "chude_id" "text" NOT NULL,
    "position" integer NOT NULL,
    "text" "jsonb" NOT NULL
);

ALTER TABLE "public"."chang" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."chude" (
    "id" "text" NOT NULL,
    "quyen_id" "text" NOT NULL,
    "position" integer NOT NULL,
    "text" "jsonb" NOT NULL
);

ALTER TABLE "public"."chude" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."hinh" (
    "id" "text" NOT NULL,
    "bai_id" "text" NOT NULL,
    "position" integer NOT NULL,
    "text" "jsonb" NOT NULL,
    "storage_bucket" "text" DEFAULT 'sgk'::"text" NOT NULL,
    "storage_path" "text" NOT NULL,
    "uploaded_at" timestamp with time zone
);

ALTER TABLE "public"."hinh" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."noidung" (
    "id" "text" NOT NULL,
    "chang_id" "text" NOT NULL,
    "position" integer NOT NULL,
    "text" "jsonb" NOT NULL
);

ALTER TABLE "public"."noidung" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "username" "text" NOT NULL,
    "display_name" "text" DEFAULT ''::"text" NOT NULL,
    "avatar_emoji" "text",
    "avatar_url" "text",
    "country" "text",
    "completed_count" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."quyen" (
    "id" "text" NOT NULL,
    "source_file" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."quyen" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."user_progress" (
    "user_id" "uuid" NOT NULL,
    "chang_id" "text" NOT NULL,
    "noidung_index" integer DEFAULT 0 NOT NULL,
    "completed_at" timestamp with time zone
);

ALTER TABLE "public"."user_progress" OWNER TO "postgres";

ALTER TABLE ONLY "public"."bai"
    ADD CONSTRAINT "bai_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."chang"
    ADD CONSTRAINT "chang_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."chude"
    ADD CONSTRAINT "chude_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."hinh"
    ADD CONSTRAINT "hinh_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."noidung"
    ADD CONSTRAINT "noidung_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");

ALTER TABLE ONLY "public"."quyen"
    ADD CONSTRAINT "quyen_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user_progress"
    ADD CONSTRAINT "user_progress_pkey" PRIMARY KEY ("user_id", "chang_id");

CREATE OR REPLACE TRIGGER "trg_init_profile_completed_count" BEFORE INSERT ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."init_profile_completed_count"();

CREATE OR REPLACE TRIGGER "trg_sync_profile_completed_count" AFTER INSERT OR DELETE OR UPDATE ON "public"."user_progress" FOR EACH ROW EXECUTE FUNCTION "public"."sync_profile_completed_count"();

ALTER TABLE ONLY "public"."bai"
    ADD CONSTRAINT "bai_noidung_id_fkey" FOREIGN KEY ("noidung_id") REFERENCES "public"."noidung"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."chang"
    ADD CONSTRAINT "chang_chude_id_fkey" FOREIGN KEY ("chude_id") REFERENCES "public"."chude"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."chude"
    ADD CONSTRAINT "chude_quyen_id_fkey" FOREIGN KEY ("quyen_id") REFERENCES "public"."quyen"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."hinh"
    ADD CONSTRAINT "hinh_bai_id_fkey" FOREIGN KEY ("bai_id") REFERENCES "public"."bai"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."noidung"
    ADD CONSTRAINT "noidung_chang_id_fkey" FOREIGN KEY ("chang_id") REFERENCES "public"."chang"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_progress"
    ADD CONSTRAINT "user_progress_chang_id_fkey" FOREIGN KEY ("chang_id") REFERENCES "public"."chang"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_progress"
    ADD CONSTRAINT "user_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

CREATE POLICY "Public read bai" ON "public"."bai" FOR SELECT USING (true);

CREATE POLICY "Public read chang" ON "public"."chang" FOR SELECT USING (true);

CREATE POLICY "Public read chude" ON "public"."chude" FOR SELECT USING (true);

CREATE POLICY "Public read hinh" ON "public"."hinh" FOR SELECT USING (true);

CREATE POLICY "Public read noidung" ON "public"."noidung" FOR SELECT USING (true);

CREATE POLICY "Public read profiles" ON "public"."profiles" FOR SELECT USING (true);

CREATE POLICY "Public read quyen" ON "public"."quyen" FOR SELECT USING (true);

CREATE POLICY "Users delete own progress" ON "public"."user_progress" FOR DELETE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Users insert own profile" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));

CREATE POLICY "Users insert own progress" ON "public"."user_progress" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Users read own progress" ON "public"."user_progress" FOR SELECT USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Users update own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));

CREATE POLICY "Users update own progress" ON "public"."user_progress" FOR UPDATE USING (("auth"."uid"() = "user_id"));

ALTER TABLE "public"."bai" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."chang" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."chude" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."hinh" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."noidung" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."quyen" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_progress" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "anon";

GRANT USAGE ON SCHEMA "public" TO "authenticated";

GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."init_profile_completed_count"() TO "anon";

GRANT ALL ON FUNCTION "public"."init_profile_completed_count"() TO "authenticated";

GRANT ALL ON FUNCTION "public"."init_profile_completed_count"() TO "service_role";

GRANT ALL ON FUNCTION "public"."sync_profile_completed_count"() TO "anon";

GRANT ALL ON FUNCTION "public"."sync_profile_completed_count"() TO "authenticated";

GRANT ALL ON FUNCTION "public"."sync_profile_completed_count"() TO "service_role";

GRANT ALL ON TABLE "public"."bai" TO "anon";

GRANT ALL ON TABLE "public"."bai" TO "authenticated";

GRANT ALL ON TABLE "public"."bai" TO "service_role";

GRANT ALL ON TABLE "public"."chang" TO "anon";

GRANT ALL ON TABLE "public"."chang" TO "authenticated";

GRANT ALL ON TABLE "public"."chang" TO "service_role";

GRANT ALL ON TABLE "public"."chude" TO "anon";

GRANT ALL ON TABLE "public"."chude" TO "authenticated";

GRANT ALL ON TABLE "public"."chude" TO "service_role";

GRANT ALL ON TABLE "public"."hinh" TO "anon";

GRANT ALL ON TABLE "public"."hinh" TO "authenticated";

GRANT ALL ON TABLE "public"."hinh" TO "service_role";

GRANT ALL ON TABLE "public"."noidung" TO "anon";

GRANT ALL ON TABLE "public"."noidung" TO "authenticated";

GRANT ALL ON TABLE "public"."noidung" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";

GRANT ALL ON TABLE "public"."profiles" TO "authenticated";

GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON TABLE "public"."quyen" TO "anon";

GRANT ALL ON TABLE "public"."quyen" TO "authenticated";

GRANT ALL ON TABLE "public"."quyen" TO "service_role";

GRANT ALL ON TABLE "public"."user_progress" TO "anon";

GRANT ALL ON TABLE "public"."user_progress" TO "authenticated";

GRANT ALL ON TABLE "public"."user_progress" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";

drop extension if exists "pg_net";

create policy "Public read sgk bucket"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'sgk'::text));
