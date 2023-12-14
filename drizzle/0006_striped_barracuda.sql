DO $$ BEGIN
 CREATE TYPE "comment_type" AS ENUM('article');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comments" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"user_id" text NOT NULL,
	"commentable_id" text NOT NULL,
	"comment_type" "comment_type" NOT NULL,
	"parent_id" text,
	"created_at" timestamp DEFAULT now()
);
