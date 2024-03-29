import { httpStatusCode, likeType } from '@customtype/index';
import db from '@db/index';
import { Article, CommentData, NewLike, likes, users } from '@db/schema';
import { and, eq, getTableColumns } from 'drizzle-orm';
import CommentService from './CommentService';
import { CustomError } from '@utils/CustomError';
import ArticleService from './ArticleService';

type LikeType = keyof typeof likeType;
type ArticleExistData = Omit<Article, 'content'>;

type targetType = ArticleExistData | CommentData | undefined | null;
const { userId, ...likeColumns } = getTableColumns(likes);
const {
    password,
    email,
    createdAt,
    provider,
    providerId,
    publicId,
    ...userfield
} = getTableColumns(users);

const articleService = new ArticleService();
const commentService = new CommentService(articleService);

class LikeService {
    async getArticleLikes(articleId: string) {
        const alllikes = db
            .select({ ...likeColumns, user: userfield })
            .from(likes)
            .leftJoin(users, eq(likes.userId, users.id))
            .where(
                and(
                    eq(likes.likebleId, articleId),
                    eq(likes.likeType, 'article'),
                ),
            )
            .groupBy(likes.id, users.id);
        return alllikes;
    }

    async addlikes(likeType: LikeType, userId: string, likebleId: string) {
        let target: targetType;
        let newLike: NewLike = {
            likeType,
            likebleId,
            userId,
        };
        if (likeType !== 'article') {
            target = await commentService.isCommentExist(likebleId);
        } else {
            target = await commentService.article.isArticleExist(likebleId);
        }
        if (!target) {
            throw new CustomError(
                `${likeType} does not exist.`,
                httpStatusCode.BAD_REQUEST,
            );
        }
        const isLikedAlreadyExist = await this.islikeExistByUser(
            likebleId,
            likeType,
            userId,
        );
        if (isLikedAlreadyExist) {
            const dropedLike = await this.deleteLike(isLikedAlreadyExist.id);
            return dropedLike;
        }
        const insertnewLike = await db
            .insert(likes)
            .values(newLike)
            .returning();
        return insertnewLike;
    }

    async deleteLike(likedId: string) {
        const dropLike = await db
            .delete(likes)
            .where(eq(likes.id, likedId))
            .returning({ deletedId: likes.id });
        return dropLike[0];
    }

    async islikeExistByUser(
        likeableId: string,
        likeType: LikeType,
        userId: string,
    ) {
        const isExist = await db.query.likes.findFirst({
            where: and(
                eq(likes.userId, userId),
                eq(likes.likebleId, likeableId),
                eq(likes.likeType, likeType),
            ),
        });
        return isExist;
    }
}

export default LikeService;
