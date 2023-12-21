DROP TABLE "articleTags";--> statement-breakpoint
DROP TABLE "tags";--> statement-breakpoint
ALTER TABLE "ArticleCategory" RENAME TO "articletopics";--> statement-breakpoint
ALTER TABLE "category" RENAME TO "topics";--> statement-breakpoint
ALTER TABLE "articletopics" RENAME COLUMN "category_id" TO "topic_id";