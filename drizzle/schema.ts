import { pgTable, pgEnum, text, timestamp, foreignKey, unique, index, varchar, jsonb, boolean } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const commentType = pgEnum("comment_type", ['comment', 'article'])
export const likeType = pgEnum("like_type", ['comment', 'article'])


export const likes = pgTable("likes", {
	id: text("id").primaryKey().notNull(),
	userId: text("user_id").notNull(),
	likeType: likeType("like_type").notNull(),
	likeId: text("like_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const comments = pgTable("comments", {
	id: text("id").notNull(),
	content: text("content").notNull(),
	userId: text("user_id").notNull(),
	commentableId: text("commentable_id").notNull(),
	commentType: commentType("comment_type").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const follows = pgTable("follows", {
	id: text("id").notNull(),
	followerId: text("follower_id").notNull(),
	followeeId: text("followee_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const topics = pgTable("topics", {
	id: text("id").primaryKey().notNull(),
	name: text("name"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const articletopics = pgTable("articletopics", {
	id: text("id").primaryKey().notNull(),
	articleId: text("article_id").notNull().references(() => article.id),
	topicId: text("topic_id").notNull().references(() => topics.id),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const readinglist = pgTable("readinglist", {
	id: text("id").primaryKey().notNull(),
	articleId: text("article_id").notNull().references(() => article.id),
	userId: text("user_id").notNull().references(() => user.id),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		readinglistArticleIdUnique: unique("readinglist_article_id_unique").on(table.articleId),
	}
});

export const article = pgTable("article", {
	id: text("id").primaryKey().notNull(),
	title: varchar("title", { length: 256 }).notNull(),
	description: varchar("description", { length: 256 }),
	authorId: text("author_id").notNull(),
	content: jsonb("content"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	isPublished: boolean("is_published").default(false),
	// TODO: failed to parse database type 'tsvector'
	searchable: unknown("searchable"),
},
(table) => {
	return {
		searchableIdx: index("article_searchable_idx").on(table.searchable),
	}
});

export const userprefrence = pgTable("userprefrence", {
	id: text("id").primaryKey().notNull(),
	topicId: text("topic_id").notNull().references(() => topics.id),
	userId: text("user_id").notNull().references(() => user.id),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const user = pgTable("user", {
	id: text("id").primaryKey().notNull(),
	name: varchar("name", { length: 256 }).notNull(),
	email: varchar("email", { length: 256 }).notNull(),
	password: varchar("password", { length: 256 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		userEmailUnique: unique("user_email_unique").on(table.email),
	}
});