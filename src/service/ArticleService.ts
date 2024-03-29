import { httpStatusCode } from '@customtype/index';
import { CustomError } from '@utils/CustomError';
import db from 'db';
import {
    Article,
    ArticleTopics,
    NewArticle,
    articles,
    comments,
    likes,
    users,
} from 'db/schema';
import { and, asc, desc, eq, getTableColumns, sql } from 'drizzle-orm';
import TopicsService from './TopicService';

type ExistArticledata = Omit<Article, 'content'>;

interface Articles {
    createArticle(data: NewArticle): Promise<Article[]>;
    updateArticle(
        update: any,
        user_id: string,
        ArticleId: string,
    ): Promise<Article>;
    deleteArticle(id: string, userId: string): Promise<Article>;
    getArticles(
        userId: string,
        Skip: number,
        ResultPerPage: number,
    ): Promise<any>;
    isArticleExist(id: string): Promise<ExistArticledata | undefined>;
    ArtcleById(id: string): Promise<any>;
    PublishArticle(
        articleData: any,
        publishUnderTopicId: string[],
        userId: string,
        updatedData: any,
    ): Promise<publishArticleReturnType>;
    searchArticles(query: string): Promise<any>;
    articleFeed(Skip: number, ResultPerPage: number): Promise<any>;
    articleData(id: string): Promise<any>;
    UnpublishArticle(
        id: string,
        user_id: string,
    ): Promise<UnpublishArticleResponse>;
}

type UnpublishArticleResponse = {
    unpublised: boolean;
    message: string;
};

type publishArticleReturnType = {
    data: { title: string };
};

const topicService = new TopicsService();

class ArticleService implements Articles {
    async UnpublishArticle(
        id: string,
        user_id: string,
    ): Promise<UnpublishArticleResponse> {
        const isExist = await this.isArticleExist(id);
        if (!isExist)
            return { unpublised: false, message: 'Article does not exist.' };
        const updated = await db
            .update(articles)
            .set({ isPublished: false })
            .where(and(eq(articles.id, id), eq(articles.authorId, user_id)))
            .returning({ isPublished: articles.isPublished });
        if (!updated[0].isPublished)
            return {
                unpublised: true,
                message: 'Article has been unpublished successfully.',
            };
        else
            return {
                unpublised: false,
                message: "You don't have any right to unpublished it.",
            };
    }
    async articleData(id: string): Promise<any> {
        return db.query.articles.findFirst({
            columns: {
                publicId: false,
                content: false,
            },
            where: eq(articles.id, id),
            with: {
                topics: {
                    with: {
                        topics: {
                            columns: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                    columns: {
                        id: false,
                        articleId: false,
                        topicId: false,
                        createdAt: false,
                    },
                },
            },
        });
    }
    async articleFeed(
        Skip: number,
        ResultPerPage: number,
    ): Promise<[any, number]> {
        const { content, publicId, authorId, ...articlesColumns } =
            getTableColumns(articles);
        const {
            password,
            email,
            provider,
            providerId,
            bio,
            username,
            ...authorField
        } = getTableColumns(users);
        const datas = db
            .select({
                ...articlesColumns,
                author: authorField,
                totalLikes: sql<number>`cast(count(distinct ${likes.id}) as int)`,
                totalComments: sql<number>`cast(count(distinct ${comments.id}) as int)`,
            })
            .from(articles)
            .where(eq(articles.isPublished, true))
            .limit(ResultPerPage)
            .offset(Skip)
            .leftJoin(likes, eq(articles.id, likes.likebleId))
            .leftJoin(comments, eq(articles.id, comments.commentableId))
            .leftJoin(users, eq(articles.authorId, users.id))
            .groupBy(articles.id, users.id);

        const [{ count }] = await db
            .select({
                count: sql`count(*)`.mapWith(Number).as('count'),
            })
            .from(articles)
            .where(eq(articles.isPublished, true));

        const feedPromise = await Promise.all([datas, count]);
        return feedPromise;
    }
    async PublishArticle(
        articleData: ExistArticledata,
        publishUnderTopicId: string[],
        userId: string,
        updatedData: any,
    ): Promise<publishArticleReturnType> {
        if (userId !== articleData.authorId) {
            throw new CustomError(
                "you are unauthorized, you don't have rights to publish it. ",
                httpStatusCode.FORBIDDEN,
            );
        }
        const publishedArticle = await db.transaction(async (trx) => {
            const updatedArticle = await trx
                .update(articles)
                .set(updatedData)
                .where(eq(articles.id, articleData.id))
                .returning({ title: articles.title });
            if (articleData.publishedImage) {
                await trx
                    .delete(ArticleTopics)
                    .where(eq(ArticleTopics.articleId, articleData.id));
            }
            const articleTopicPromises = publishUnderTopicId.map((topic) =>
                trx.insert(ArticleTopics).values({
                    articleId: articleData.id,
                    topicId: topic,
                }),
            );
            await Promise.allSettled(articleTopicPromises);

            return {
                data: {
                    title: `${updatedArticle[0].title} has been published successfully.`,
                },
            };
        });

        return publishedArticle;
    }

    async searchArticles(query: string) {
        const { authorId, ...articleColumns } = getTableColumns(articles);
        const { password, email, createdAt, ...userfield } =
            getTableColumns(users);

        const result = await db
            .select({
                ...articleColumns,
                author: userfield,
                rank: sql`ts_rank(searchable,to_tsquery(${query}))`.as('rank'),
                totalLikes: sql<number>`cast(count(distinct ${likes.id}) as int)`,
                totalComments: sql<number>`cast(count(distinct ${comments.id}) as int)`,
            })
            .from(articles)
            .where(
                sql`searchable @@ to_tsquery(${query}) AND is_published=true`,
            )
            .leftJoin(users, eq(articles.authorId, users.id))
            .leftJoin(likes, eq(articles.id, likes.likebleId))
            .leftJoin(comments, eq(articles.id, comments.commentableId))
            .limit(20)
            .groupBy(articles.id, users.id)
            .orderBy(desc(sql`rank`));

        return result;
    }

    async ArtcleById(id: string) {
        const isExist = await this.isArticleExist(id);
        if (!isExist)
            throw new CustomError(
                'Article does not exist.',
                httpStatusCode.BAD_REQUEST,
            );
        const { ...rest } = getTableColumns(articles);
        const {
            password,
            email,
            publicId,
            provider,
            providerId,
            createdAt,
            ...userfield
        } = getTableColumns(users);
        const article = await db
            .select({
                ...rest,
                author: userfield,
                totalLikes: sql<number>`cast(count(distinct ${likes.id}) as int)`,
                totalComments: sql<number>`cast(count(distinct ${comments.id}) as int)`,
            })
            .from(articles)
            .where(eq(articles.id, id))
            .leftJoin(users, eq(articles.authorId, users.id))
            .leftJoin(likes, eq(articles.id, likes.likebleId))
            .leftJoin(ArticleTopics, eq(articles.id, ArticleTopics.articleId))
            .leftJoin(comments, eq(articles.id, comments.commentableId))
            .groupBy(articles.id, users.id, ArticleTopics.id)
            .orderBy(asc(articles.title));
        return article;
    }

    async createArticle(data: NewArticle): Promise<Article[]> {
        const createnewArticle = await db
            .insert(articles)
            .values(data)
            .returning();
        return createnewArticle;
    }

    async updateArticle(
        updateData: any,
        userId: string,
        ArticleId: string,
    ): Promise<Article> {
        const isArticleExist = await this.isArticleExist(ArticleId);
        if (!isArticleExist)
            throw new CustomError(
                'Article does not exist.',
                httpStatusCode.BAD_REQUEST,
            );
        if (isArticleExist.authorId !== userId) {
            throw new CustomError(
                "You don't have rights to update the Article.",
                httpStatusCode.FORBIDDEN,
            );
        }
        const updatedArticle = await db
            .update(articles)
            .set(updateData)
            .where(
                and(eq(articles.id, ArticleId), eq(articles.authorId, userId)),
            )
            .returning();
        return updatedArticle[0];
    }

    async deleteArticle(id: string, userId: string): Promise<Article> {
        const isArticleExist = await this.isArticleExist(id);
        if (!isArticleExist)
            throw new CustomError(
                'Article does not exist.',
                httpStatusCode.BAD_REQUEST,
            );
        if (isArticleExist.authorId !== userId) {
            throw new CustomError(
                "You don't have rights to update the Article.",
                httpStatusCode.FORBIDDEN,
            );
        }
        const isArticleDeleted = await db
            .delete(articles)
            .where(and(eq(articles.authorId, userId), eq(articles.id, id)))
            .returning();

        return isArticleDeleted[0];
    }

    async getArticles(
        userId: string,
        skip: number,
        ResultPerPage: number,
    ): Promise<[any[], number]> {
        const Articles = await db.query.articles.findMany({
            columns: {
                content: false,
                publicId: false,
            },
            with: {
                author: {
                    columns: {
                        password: false,
                        email: false,
                        provider: false,
                        providerId: false,
                        publicId: false,
                        bio: false,
                        username: false,
                    },
                },
                likes: {
                    columns: {
                        id: true,
                    },
                },
                comments: {
                    columns: {
                        id: true,
                    },
                },
            },
            where: and(eq(articles.authorId, userId)),
            limit: ResultPerPage,
            offset: skip,
            orderBy: [asc(articles.title)],
        });
        const [{ count }] = await db
            .select({
                count: sql`count(*)`.mapWith(Number).as('count'),
            })
            .from(articles)
            .where(
                and(
                    eq(articles.authorId, userId),
                    eq(articles.isPublished, true),
                ),
            );
        const ArticlePromise = await Promise.all([Articles, count]);
        return ArticlePromise;
    }

    async isArticleExist(id: string): Promise<ExistArticledata | undefined> {
        const isArticleExist = await db.query.articles.findFirst({
            where: eq(articles.id, id),
            columns: {
                content: false,
            },
        });
        return isArticleExist;
    }
}

export default ArticleService;
