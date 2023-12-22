DO $$ BEGIN
 ALTER TABLE "articletopics" ADD CONSTRAINT "articletopics_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "articletopics" ADD CONSTRAINT "articletopics_article_id_article_id_fk" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
