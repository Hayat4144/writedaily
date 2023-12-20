import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
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
    authorId: text('author_id').notNull(),
    content: jsonb('content'),
    tags: text('tags').array(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const articlesRelations = relations(articles, ({ one, many }) => ({
    author: one(users, {
        fields: [articles.authorId],
        references: [users.id],
    }),
    comments: many(comments),
    likes: many(likes),
    categories: many(ArticleCategory),
    tags: many(ArticleTags),
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

export const Category = pgTable('category', {
    id: text('id')
        .notNull()
        .$defaultFn(() => createId()),
    name: text('name'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const CategoryRelation = relations(Category, ({ many }) => ({
    articlesCategory: many(ArticleCategory),
}));

export const ArticleCategory = pgTable('ArticleCategory', {
    id: text('id')
        .notNull()
        .$defaultFn(() => createId()),
    articleId: text('article_id').notNull(),
    categoryId: text('category_id').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const ArticleCategoryRelation = relations(
    ArticleCategory,
    ({ one }) => ({
        article: one(articles, {
            fields: [ArticleCategory.articleId],
            references: [articles.id],
        }),
        category: one(Category, {
            fields: [ArticleCategory.categoryId],
            references: [Category.id],
        }),
    }),
);

export const Tags = pgTable('tags', {
    id: text('id')
        .notNull()
        .$defaultFn(() => createId()),
    name: text('name'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const ArticleTags = pgTable('articleTags', {
    id: text('id')
        .notNull()
        .$defaultFn(() => createId()),
    tagId: text('tag_id').notNull(),
    articleId: text('article_id').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const ArticleTagsRelation = relations(ArticleTags, ({ one }) => ({
    article: one(articles, {
        fields: [ArticleTags.articleId],
        references: [articles.id],
    }),
    tag: one(Tags, {
        fields: [ArticleTags.tagId],
        references: [Tags.id],
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
export type NewTag = typeof Tags.$inferInsert;
export type TagData = typeof Tags.$inferSelect;
export type NewArticleTags = typeof Tags.$inferInsert;
export type ArticleTagsData = typeof Tags.$inferSelect;
export type NewCategory = typeof Tags.$inferInsert;
export type CategoryData = typeof Tags.$inferSelect;
export type ArticleCategoryData = typeof Tags.$inferSelect;
export type NewArticleCategory = typeof Tags.$inferInsert;
