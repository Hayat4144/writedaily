import { commentType, httpStatusCode } from '@customtype/index';
import db from '@db/index';
import { CommentData, Article, Newcomment, comments } from '@db/schema';
import { and, eq, sql } from 'drizzle-orm';
import BlogService from './BlogService';
import { CustomError } from '@utils/CustomError';
import { queryRemoveField } from '@utils/constant';

type CommentType = keyof typeof commentType;

interface CommentServiceInterface {
    addComment(
        userId: string,
        content: string,
        commentableId: string,
        commentType: CommentType,
    ): Promise<Newcomment[]>;
    deleteComment(userId: string, commentId: string): Promise<CommentData>;
    editComment(
        userId: string,
        commentId: string,
        content: string,
    ): Promise<CommentData>;
    isCommentExist(commentId: string): Promise<CommentData | undefined>;
    articleComments(commentId: string): void;
}

type targetType = CommentData | Article | undefined;

class CommentService implements CommentServiceInterface {
    article: BlogService;

    constructor(article: BlogService) {
        this.article = article;
    }

    async addComment(
        userId: string,
        content: string,
        commentableId: string,
        commentType: CommentType,
    ): Promise<Newcomment[]> {
        let target: targetType;
        let data: Newcomment = {
            content,
            userId,
            commentType,
            commentableId,
        };

        if (commentType !== 'article') {
            target = await this.isCommentExist(commentableId);
            data = { ...data };
        } else {
            target = await this.article.isArticleExist(commentableId);
        }

        if (!target) {
            throw new CustomError(
                `${commentType} does not exist.`,
                httpStatusCode.BAD_REQUEST,
            );
        }
        const insertComment = await db
            .insert(comments)
            .values(data)
            .returning();
        return insertComment;
    }

    async deleteComment(
        userId: string,
        commentId: string,
    ): Promise<CommentData> {
        const isExist = await this.isCommentExist(commentId);
        if (!isExist) {
            throw new CustomError(
                `Comment does'n exist`,
                httpStatusCode.BAD_REQUEST,
            );
        }
        if (isExist.userId !== userId) {
            throw new CustomError(
                "You don't have rights to update the blog.",
                httpStatusCode.FORBIDDEN,
            );
        }
        const isCommentDeleted = await db
            .delete(comments)
            .where(and(eq(comments.userId, userId), eq(comments.id, commentId)))
            .returning();

        return isCommentDeleted[0];
    }
    async editComment(
        userId: string,
        commentId: string,
        content: string,
    ): Promise<CommentData> {
        const isExist = await this.isCommentExist(commentId);
        if (!isExist) {
            throw new CustomError(
                `Comment does'n exist`,
                httpStatusCode.BAD_REQUEST,
            );
        }
        if (isExist.userId !== userId) {
            throw new CustomError(
                "You don't have rights to update the blog.",
                httpStatusCode.FORBIDDEN,
            );
        }

        const editedComment = await db
            .update(comments)
            .set({ content })
            .where(and(eq(comments.id, commentId), eq(comments.userId, userId)))
            .returning();
        return editedComment[0];
    }

    async isCommentExist(commentId: string): Promise<CommentData | undefined> {
        const isExist = await db.query.comments.findFirst({
            where: eq(comments.id, commentId),
        });
        return isExist;
    }

    async articleComments(articleId: string): Promise<any> {
        const allarticles = await db.query.comments.findMany({
            where: eq(comments.commentableId, articleId),
            with: {
                user: queryRemoveField.user,
                like: {
                    columns: queryRemoveField.userIdField,
                    with: {
                        user: queryRemoveField.user,
                    },
                },
                commentReply: {
                    columns: queryRemoveField.userIdField,
                    with: {
                        user: queryRemoveField.user,
                    },
                },
            },
        });
        return allarticles;
    }
}

export default CommentService;
