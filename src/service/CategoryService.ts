import { httpStatusCode } from '@customtype/index';
import db from '@db/index';
import { Category } from '@db/schema'; // Import the Category model
import { CustomError } from '@utils/CustomError';
import { Column, asc, eq, sql } from 'drizzle-orm';

class CategoryService {
    async createCategory(name: string) {
        const [existingCategory] = await db
            .select()
            .from(Category)
            .where(eq(Category.name, name));

        if (existingCategory) {
            throw new CustomError(
                `Category with name ${name} already exists`,
                httpStatusCode.BAD_REQUEST,
            );
        }

        const addedCategory = await db
            .insert(Category)
            .values({ name })
            .returning();
        return addedCategory;
    }

    lower(col: Column) {
        return sql<string>`lower(${col})`;
    }

    async readCategory() {
        const categories = await db
            .select({ id: Category.id, name: this.lower(Category.name) })
            .from(Category)
            .limit(20)
            .orderBy(asc(Category.name));
        return categories;
    }

    async updateCategory(id: string, name: string) {
        const isExist = await this.isCategoryExistById(id);
        if (!isExist) {
            throw new CustomError(
                'Category does not exist.',
                httpStatusCode.BAD_REQUEST,
            );
        }

        const updatedCategory = await db
            .update(Category)
            .set({ name })
            .where(eq(Category.id, isExist.id))
            .returning();
        return updatedCategory;
    }

    async deleteCategory(id: string) {
        const isExist = await this.isCategoryExistById(id);
        if (!isExist) {
            throw new CustomError(
                'Category does not exist.',
                httpStatusCode.BAD_REQUEST,
            );
        }

        const droppedCategory = await db
            .delete(Category)
            .where(eq(Category.id, id))
            .returning({ Name: Category.name });
        return droppedCategory[0];
    }

    async isCategoryExistByName(name: string) {
        const [isExist] = await db
            .select()
            .from(Category)
            .where(eq(Category.name, name));
        return isExist;
    }

    async isCategoryExistById(id: string) {
        const [isExist] = await db
            .select()
            .from(Category)
            .where(eq(Category.id, id));
        return isExist;
    }
}

export default CategoryService;
