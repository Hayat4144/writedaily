import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { boolean } from 'drizzle-orm/pg-core';
import { pgEnum } from 'drizzle-orm/pg-core';
import { varchar, text, jsonb, timestamp, pgTable } from 'drizzle-orm/pg-core';

export const users = pgTable('user', {
    id: text('id')
        .notNull()
        .primaryKey()
        .$defaultFn(() => createId()),
    name: varchar('name', { length: 256 }).notNull(),
    email: varchar('email', { length: 256 }).notNull().unique(),
    password: varchar('password', { length: 256 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
    articles: many(articles),
    comments: many(comments),
    likes: many(likes),
    follows: many(follows, { relationName: 'follows' }),
    followers: many(follows, { relationName: 'followers' }),
}));

export const articles = pgTable('article', {
    id: text('id')
        .notNull()
        .primaryKey()
        .$defaultFn(() => createId()),
    title: varchar('title', { length: 256 }).notNull(),
    description: varchar('description', { length: 256 }),
    isPublished: boolean('is_published').default(true),
    authorId: text('author_id').notNull(),
    content: jsonb('content'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const articlesRelations = relations(articles, ({ one, many }) => ({
    author: one(users, {
        fields: [articles.authorId],
        references: [users.id],
    }),
    comments: many(comments),
    likes: many(likes),
    topics: many(ArticleTopics),
}));

export const commentEnum = pgEnum('comment_type', ['article', 'comment']);
export const likeEnum = pgEnum('like_type', ['article', 'comment']);

export const likes = pgTable('likes', {
    id: text('id')
        .notNull()
        .primaryKey()
        .$defaultFn(() => createId()),
    userId: text('user_id').notNull(),
    likeType: likeEnum('like_type').notNull(),
    likebleId: text('like_id').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const likesRelations = relations(likes, ({ one }) => ({
    user: one(users, {
        fields: [likes.userId],
        references: [users.id],
    }),
    article: one(articles, {
        fields: [likes.likebleId],
        references: [articles.id],
    }),
    comment: one(comments, {
        fields: [likes.likebleId],
        references: [comments.id],
    }),
}));

export const comments = pgTable('comments', {
    id: text('id')
        .notNull()
        .$defaultFn(() => createId()),
    content: text('content').notNull(),
    userId: text('user_id').notNull(),
    commentableId: text('commentable_id').notNull(),
    commentType: commentEnum('comment_type').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const commentRelations = relations(comments, ({ one, many }) => ({
    user: one(users, {
        fields: [comments.userId],
        references: [users.id],
    }),
    comment: one(comments, {
        fields: [comments.commentableId],
        references: [comments.id],
        relationName: 'commenteReply',
    }),
    commentReply: many(comments, {
        relationName: 'commenteReply',
    }),
    article: one(articles, {
        fields: [comments.commentableId],
        references: [articles.id],
    }),
    like: many(likes),
}));

export const follows = pgTable('follows', {
    id: text('id')
        .notNull()
        .$defaultFn(() => createId()),
    followerId: text('follower_id').notNull(),
    followeeId: text('followee_id').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const followsRelations = relations(follows, ({ one }) => ({
    follower: one(users, {
        fields: [follows.followerId],
        references: [users.id],
        relationName: 'follows',
    }),
    followee: one(users, {
        fields: [follows.followeeId],
        references: [users.id],
        relationName: 'followers',
    }),
}));

export const Topics = pgTable('topics', {
    id: text('id')
        .notNull()
        .$defaultFn(() => createId()),
    name: text('name'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const ArticleTopics = pgTable('articletopics', {
    id: text('id')
        .notNull()
        .$defaultFn(() => createId()),
    topicId: text('topic_id').notNull(),
    articleId: text('article_id').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const ArticleTopicsRelation = relations(ArticleTopics, ({ one }) => ({
    article: one(articles, {
        fields: [ArticleTopics.articleId],
        references: [articles.id],
    }),
    topics: one(Topics, {
        fields: [ArticleTopics.topicId],
        references: [Topics.id],
    }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Newcomment = typeof comments.$inferInsert;
export type CommentData = typeof comments.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type NewLike = typeof likes.$inferInsert;
export type LikedData = typeof likes.$inferSelect;
export type NewFollows = typeof follows.$inferInsert;
export type FollowsData = typeof follows.$inferSelect;
export type NewTopic = typeof Topics.$inferInsert;
export type TopicData = typeof Topics.$inferSelect;
export type NewArticleTopics = typeof ArticleTopics.$inferInsert;
export type ArticleTopicsData = typeof ArticleTopics.$inferSelect;
