CREATE TABLE IF NOT EXISTS "follows" (
	"id" text NOT NULL,
	"follower_id" text NOT NULL,
	"followee_id" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
