import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { CategoryPersistor } from '../../../application/category/category-persistor.port';
import { Category } from '../../../domain/entities';
import { DrizzleClient } from '../drizzle-client.service';
import { categories } from './category.entity';

@Injectable()
export class CategoryPersistenceAdapter implements CategoryPersistor {
  constructor(private readonly drizzleClient: DrizzleClient) {}

  async save(category: Category): Promise<Category> {
    const result = await this.drizzleClient.db
      .insert(categories)
      .values({
        id: category.id,
        name: category.name,
        description: category.description,
        createdAt: category.createdAt,
      })
      .returning();

    const saved = result[0];
    return new Category(
      saved.id,
      saved.name,
      saved.description,
      saved.createdAt
    );
  }

  async findById(id: string): Promise<Category | null> {
    const result = await this.drizzleClient.db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const row = result[0];
    return new Category(
      row.id,
      row.name,
      row.description,
      row.createdAt
    );
  }

  async findAll(): Promise<Category[]> {
    const result = await this.drizzleClient.db.select().from(categories);

    return result.map(
      (row) =>
        new Category(row.id, row.name, row.description, row.createdAt)
    );
  }
}
