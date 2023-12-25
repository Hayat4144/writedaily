ALTER TABLE "articletopics" DROP CONSTRAINT "articletopics_topic_id_topics_id_fk";
--> statement-breakpoint
ALTER TABLE "readinglist" DROP CONSTRAINT "readinglist_article_id_article_id_fk";
--> statement-breakpoint
ALTER TABLE "follows" ADD PRIMARY KEY ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "articleId_idx" ON "readinglist" ("article_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "userId_idx" ON "comments" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "commentable_idx" ON "comments" ("commentable_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "followerId_idx" ON "follows" ("follower_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "followeeId_idx" ON "follows" ("followee_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "userId_idx" ON "likes" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "likebleId_idx" ON "likes" ("like_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "articletopics" ADD CONSTRAINT "articletopics_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "readinglist" ADD CONSTRAINT "readinglist_article_id_article_id_fk" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "article" ADD CONSTRAINT "article_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_user_id_fk" FOREIGN KEY ("follower_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follows" ADD CONSTRAINT "follows_followee_id_user_id_fk" FOREIGN KEY ("followee_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
