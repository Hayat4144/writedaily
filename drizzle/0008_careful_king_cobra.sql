DO $$ BEGIN
 CREATE TYPE "like_type" AS ENUM('article', 'comment');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "likes" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"like_type" "like_type" NOT NULL,
	"like_id" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "media";