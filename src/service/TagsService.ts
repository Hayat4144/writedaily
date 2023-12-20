import { httpStatusCode } from '@customtype/index';
import db from '@db/index';
import { Tags } from '@db/schema';
import { CustomError } from '@utils/CustomError';
import { Column, asc, eq, sql } from 'drizzle-orm';

class TagsService {
    async createTag(name: string) {
        const [existingTag] = await db
            .select()
            .from(Tags)
            .where(eq(Tags.name, name));

        if (existingTag) {
            throw new CustomError(
                `Tag with name ${name} already exists`,
                httpStatusCode.BAD_REQUEST,
            );
        }
        const addtag = await db.insert(Tags).values({ name }).returning();
        return addtag;
    }

    lower(col: Column) {
        return sql<string>`lower(${col})`;
    }

    async readTags() {
        const tags = await db
            .select({ id: Tags.id, name: this.lower(Tags.name) })
            .from(Tags)
            .limit(20)
            .orderBy(asc(Tags.name));
        return tags;
    }

    async updateTag(id: string, name: string) {
        const isExist = await this.isTagExistById(id);
        if (!isExist) {
            throw new CustomError(
                'Tag  does  not exist.',
                httpStatusCode.BAD_REQUEST,
            );
        }
        const updatedTag = await db
            .update(Tags)
            .set({ name })
            .where(eq(Tags.id, isExist.id))
            .returning();
        return updatedTag;
    }

    async deleteTag(id: string) {
        const isExist = await this.isTagExistById(id);
        if (!isExist) {
            throw new CustomError(
                'Tag  does  not exist.',
                httpStatusCode.BAD_REQUEST,
            );
        }
        const drop = await db
            .delete(Tags)
            .where(eq(Tags.id, id))
            .returning({ Name: Tags.name });
        return drop[0];
    }

    async isTagExistByName(name: string) {
        const [isExist] = await db
            .select()
            .from(Tags)
            .where(eq(Tags.name, name));
        return isExist;
    }
    async isTagExistById(id: string) {
        const [isExist] = await db.select().from(Tags).where(eq(Tags.id, id));
        return isExist;
    }
}

export default TagsService;
