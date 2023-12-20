CREATE TABLE IF NOT EXISTS "ArticleCategory" (
	"id" text NOT NULL,
	"article_id" text NOT NULL,
	"category_id" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "articleTags" (
	"id" text NOT NULL,
	"tag_id" text NOT NULL,
	"article_id" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "category" (
	"id" text NOT NULL,
	"name" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"id" text NOT NULL,
	"name" text,
	"created_at" timestamp DEFAULT now()
);
