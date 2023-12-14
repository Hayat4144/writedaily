ALTER TABLE "article" ALTER COLUMN "author_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "article" ADD COLUMN "tags" text[];