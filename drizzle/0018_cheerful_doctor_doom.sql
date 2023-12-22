ALTER TABLE "userprefrence" RENAME COLUMN "article_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "articletopics" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "topics" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "userprefrence" ADD PRIMARY KEY ("id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userprefrence" ADD CONSTRAINT "userprefrence_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userprefrence" ADD CONSTRAINT "userprefrence_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
