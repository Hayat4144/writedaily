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

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const usersRelations = relations(users, ({ many }) => ({
    articles: many(articles),
    comments: many(comments),
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

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;

export const images = pgTable('media', {
    id: text('id')
        .notNull()
        .primaryKey()
        .$defaultFn(() => createId()),
    url: text('url'),
});

export const articlesRelations = relations(articles, ({ one, many }) => ({
    author: one(users, {
        fields: [articles.authorId],
        references: [users.id],
    }),
    comments: many(comments),
}));

export const commentEnum = pgEnum('comment_type', ['article']);

export const comments = pgTable('comments', {
    id: text('id')
        .notNull()
        .primaryKey()
        .$defaultFn(() => createId()),
    content: text('content').notNull(),
    userId: text('user_id').notNull(),
    commentableId: text('commentable_id').notNull(),
    commentType: commentEnum('comment_type').notNull(),
    parentId: text('parent_id'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const commentRelations = relations(comments, ({ one }) => ({
    user: one(users, {
        fields: [comments.userId],
        references: [users.id],
    }),
    commentReply: one(comments, {
        fields: [comments.commentableId],
        references: [comments.id],
    }),
    article: one(articles, {
        fields: [comments.commentableId],
        references: [articles.id],
    }),
    parent: one(comments, {
        fields: [comments.parentId],
        references: [comments.id],
        relationName: 'parent',
    }),
}));
