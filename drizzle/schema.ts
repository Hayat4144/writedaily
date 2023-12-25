import { pgTable, unique, pgEnum, text, varchar, timestamp, index, foreignKey, boolean, jsonb, serial, real } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const commentType = pgEnum("comment_type", ['comment', 'article'])
export const likeType = pgEnum("like_type", ['comment', 'article'])


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

export const readinglist = pgTable("readinglist", {
	id: text("id").primaryKey().notNull(),
	articleId: text("article_id").notNull().references(() => article.id, { onDelete: "cascade" } ),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		articleIdIdx: index("articleId_idx").on(table.articleId),
		readinglistArticleIdUnique: unique("readinglist_article_id_unique").on(table.articleId),
	}
});

export const comments = pgTable("comments", {
	id: text("id").notNull(),
	content: text("content").notNull(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	commentableId: text("commentable_id").notNull(),
	commentType: commentType("comment_type").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		userIdIdx: index("userId_idx").on(table.userId),
		commentableIdx: index("commentable_idx").on(table.commentableId),
	}
});

export const userprefrence = pgTable("userprefrence", {
	id: text("id").primaryKey().notNull(),
	topicId: text("topic_id").notNull().references(() => topics.id),
	userId: text("user_id").notNull().references(() => user.id),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const follows = pgTable("follows", {
	id: text("id").primaryKey().notNull(),
	followerId: text("follower_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	followeeId: text("followee_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		followerIdIdx: index("followerId_idx").on(table.followerId),
		followeeIdIdx: index("followeeId_idx").on(table.followeeId),
	}
});

export const likes = pgTable("likes", {
	id: text("id").primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	likeType: likeType("like_type").notNull(),
	likeId: text("like_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		likebleIdIdx: index("likebleId_idx").on(table.likeId),
	}
});

export const token = pgTable("token", {
	id: text("id").primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	token: text("token").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		tokenUserIdUnique: unique("token_user_id_unique").on(table.userId),
	}
});

export const article = pgTable("article", {
	id: text("id").primaryKey().notNull(),
	title: varchar("title", { length: 256 }).notNull(),
	description: varchar("description", { length: 256 }),
	isPublished: boolean("is_published").default(false),
	authorId: text("author_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	content: jsonb("content"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	// TODO: failed to parse database type 'tsvector'
	searchable: unknown("searchable"),
},
(table) => {
	return {
		searchableIdx: index("article_searchable_idx").on(table.searchable),
	}
});

export const topics = pgTable("topics", {
	id: text("id").primaryKey().notNull(),
	name: text("name"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const articletopics = pgTable("articletopics", {
	id: text("id").primaryKey().notNull(),
	topicId: text("topic_id").notNull().references(() => topics.id, { onDelete: "cascade" } ),
	articleId: text("article_id").notNull().references(() => article.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const playingWithNeon = pgTable("playing_with_neon", {
	id: serial("id").primaryKey().notNull(),
	name: text("name").notNull(),
	value: real("value"),
});