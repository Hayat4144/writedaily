import { httpStatusCode } from '@customtype/index';
import db from '@db/index';
import { Topics } from '@db/schema';
import { CustomError } from '@utils/CustomError';
import { Column, asc, eq, sql } from 'drizzle-orm';

class TopicsService {
    async createTag(name: string) {
        const [existingTopic] = await db
            .select()
            .from(Topics)
            .where(eq(Topics.name, name));

        if (existingTopic) {
            throw new CustomError(
                `Topic with name ${name} already exists`,
                httpStatusCode.BAD_REQUEST,
            );
        }
        const addtopic = await db.insert(Topics).values({ name }).returning();
        return addtopic;
    }

    lower(col: Column) {
        return sql<string>`lower(${col})`;
    }

    async readTopics() {
        const topics = await db
            .select({ id: Topics.id, name: this.lower(Topics.name) })
            .from(Topics)
            .limit(20)
            .orderBy(asc(Topics.name));
        return topics;
    }

    async updateTopics(id: string, name: string) {
        const isExist = await this.isTopicExistById(id);
        if (!isExist) {
            throw new CustomError(
                'Topic  does  not exist.',
                httpStatusCode.BAD_REQUEST,
            );
        }
        const updatedTopic = await db
            .update(Topics)
            .set({ name })
            .where(eq(Topics.id, isExist.id))
            .returning();
        return updatedTopic;
    }

    async deleteTopic(id: string) {
        const isExist = await this.isTopicExistById(id);
        if (!isExist) {
            throw new CustomError(
                'Tag  does  not exist.',
                httpStatusCode.BAD_REQUEST,
            );
        }
        const drop = await db
            .delete(Topics)
            .where(eq(Topics.id, id))
            .returning({ Name: Topics.name });
        return drop[0];
    }

    async isTopicExistByName(name: string) {
        const [isExist] = await db
            .select()
            .from(Topics)
            .where(eq(Topics.name, name));
        return isExist;
    }
    async isTopicExistById(id: string) {
        const [isExist] = await db
            .select()
            .from(Topics)
            .where(eq(Topics.id, id));
        return isExist;
    }
}

export default TopicsService;
