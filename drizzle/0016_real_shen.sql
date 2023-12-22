CREATE TABLE IF NOT EXISTS "userprefrence" (
	"id" text NOT NULL,
	"topic_id" text NOT NULL,
	"article_id" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "article" ADD COLUMN "is_published" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "article" DROP COLUMN IF EXISTS "tags";