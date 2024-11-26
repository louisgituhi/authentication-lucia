CREATE TYPE "public"."role_enum" AS ENUM('admin', 'supervisor', 'receiver', 'sds');--> statement-breakpoint
CREATE ROLE "admin";--> statement-breakpoint
CREATE ROLE "receiver" WITH CREATEROLE;--> statement-breakpoint
CREATE ROLE "sds" WITH CREATEROLE;--> statement-breakpoint
CREATE ROLE "supervisor" WITH CREATEROLE;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "branches" (
	"id" integer PRIMARY KEY NOT NULL,
	"branch_name" text NOT NULL,
	"branch_code" text NOT NULL,
	CONSTRAINT "branches_branch_name_unique" UNIQUE("branch_name"),
	CONSTRAINT "branches_branch_code_unique" UNIQUE("branch_code")
);
--> statement-breakpoint
ALTER TABLE "branches" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "faulty_accounts" (
	"id" integer PRIMARY KEY NOT NULL,
	"account_name" text NOT NULL,
	"account_number" integer NOT NULL,
	"branch_name" text,
	"returned_by" text,
	"return_to_branch" date DEFAULT now() NOT NULL,
	"return_to_operations" date DEFAULT now(),
	CONSTRAINT "faulty_accounts_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "faulty_accounts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "session_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "session" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"hashed_password" text,
	"roles" "role_enum" DEFAULT 'sds' NOT NULL,
	"branch_name" text,
	CONSTRAINT "user_id_unique" UNIQUE("id"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "faulty_accounts" ADD CONSTRAINT "faulty_accounts_branch_name_branches_branch_name_fk" FOREIGN KEY ("branch_name") REFERENCES "public"."branches"("branch_name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "faulty_accounts" ADD CONSTRAINT "faulty_accounts_returned_by_user_username_fk" FOREIGN KEY ("returned_by") REFERENCES "public"."user"("username") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_branch_name_branches_branch_name_fk" FOREIGN KEY ("branch_name") REFERENCES "public"."branches"("branch_name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE POLICY "policy" ON "user" AS PERMISSIVE FOR ALL TO "admin";