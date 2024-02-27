import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { index } from 'drizzle-orm/pg-core';
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
    provider: varchar('provider'),
    providerId: varchar('providerId'),
    profilePic: varchar('profilePic'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const tokens = pgTable('token', {
    id: text('id')
        .notNull()
        .primaryKey()
        .$defaultFn(() => createId()),
    userId: text('user_id')
        .unique()
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    token: text('token')
        .notNull()
        .$defaultFn(() => createId()),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tokenRelation = relations(tokens, ({ one }) => ({
    user: one(users, {
        fields: [tokens.userId],
        references: [users.id],
    }),
}));

export const usersRelations = relations(users, ({ many, one }) => ({
    articles: many(articles),
    comments: many(comments),
    likes: many(likes),
    follows: many(follows, { relationName: 'follows' }),
    followers: many(follows, { relationName: 'followers' }),
    prefrence: many(UserPrefrences),
    token: one(tokens),
}));

export const articles = pgTable('article', {
    id: text('id')
        .notNull()
        .primaryKey()
        .$defaultFn(() => createId()),
    title: varchar('title', { length: 256 }).notNull(),
    description: varchar('description', { length: 256 }),
    isPublished: boolean('is_published').default(false),
    authorId: text('author_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),

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

export const likes = pgTable(
    'likes',
    {
        id: text('id')
            .notNull()
            .primaryKey()
            .$defaultFn(() => createId()),
        userId: text('user_id')
            .references(() => users.id, { onDelete: 'cascade' })
            .notNull(),
        likeType: likeEnum('like_type').notNull(),
        likebleId: text('like_id').notNull(),
        createdAt: timestamp('created_at').defaultNow(),
    },
    (table) => ({
        userIdx: index('userID_idx').on(table.userId),
        likeableIdx: index('likebleId_idx').on(table.likebleId),
    }),
);

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

export const comments = pgTable(
    'comments',
    {
        id: text('id')
            .notNull()
            .$defaultFn(() => createId()),
        content: text('content').notNull(),
        userId: text('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        commentableId: text('commentable_id').notNull(),
        commentType: commentEnum('comment_type').notNull(),
        createdAt: timestamp('created_at').defaultNow(),
    },
    (table) => ({
        userIdx: index('userId_idx').on(table.userId),
        commentableIdx: index('commentable_idx').on(table.commentableId),
    }),
);

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

export const follows = pgTable(
    'follows',
    {
        id: text('id')
            .notNull()
            .primaryKey()
            .$defaultFn(() => createId()),
        followerId: text('follower_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        followeeId: text('followee_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        createdAt: timestamp('created_at').defaultNow(),
    },
    (table) => ({
        followerIdx: index('followerId_idx').on(table.followerId),
        followeeIdx: index('followeeId_idx').on(table.followeeId),
    }),
);

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
        .$defaultFn(() => createId())
        .primaryKey(),
    name: text('name'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const ArticleTopics = pgTable('articletopics', {
    id: text('id')
        .notNull()
        .$defaultFn(() => createId())
        .primaryKey(),
    topicId: text('topic_id')
        .notNull()
        .references(() => Topics.id, { onDelete: 'cascade' }),
    articleId: text('article_id')
        .notNull()
        .references(() => articles.id, { onDelete: 'cascade' }),
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

export const UserPrefrences = pgTable('userprefrence', {
    id: text('id')
        .notNull()
        .$defaultFn(() => createId())
        .primaryKey(),
    topicId: text('topic_id')
        .notNull()
        .references(() => Topics.id),
    userId: text('user_id')
        .notNull()
        .references(() => users.id),
    createdAt: timestamp('created_at').defaultNow(),
});

export const UserPrefrencesRelations = relations(UserPrefrences, ({ one }) => ({
    user: one(users, {
        fields: [UserPrefrences.userId],
        references: [users.id],
    }),
    topics: one(Topics, {
        fields: [UserPrefrences.topicId],
        references: [Topics.id],
    }),
}));

export const ReadingList = pgTable(
    'readinglist',
    {
        id: text('id')
            .notNull()
            .$defaultFn(() => createId())
            .primaryKey(),
        articleId: text('article_id')
            .notNull()
            .unique()
            .references(() => articles.id, { onDelete: 'cascade' }),
        userId: text('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        createdAt: timestamp('created_at').defaultNow(),
    },
    (table) => ({
        articleIdx: index('articleId_idx').on(table.articleId),
    }),
);

export const ReadingListRelation = relations(ReadingList, ({ one }) => ({
    user: one(users, {
        fields: [ReadingList.userId],
        references: [users.id],
    }),
    artilce: one(articles, {
        fields: [ReadingList.articleId],
        references: [articles.id],
    }),
}));

export type NewToken = typeof tokens.$inferInsert;
export type TokenData = typeof tokens.$inferSelect;
export type ReadingListData = typeof ReadingList.$inferSelect;
export type NewreadingList = typeof ReadingList.$inferInsert;
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
