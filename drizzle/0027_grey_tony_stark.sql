DROP INDEX IF EXISTS "userId_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "userID_idx" ON "likes" ("user_id");