import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AddCategoryCommand } from './add-category.command';
import { Category } from '../../domain/entities';
import { CategoryPersistor, CATEGORY_PERSISTOR } from './category-persistor.port';

@Injectable()
export class AddCategoryHandler {
  constructor(
    @Inject(CATEGORY_PERSISTOR)
    private readonly categoryPersistor: CategoryPersistor
  ) {}

  async execute(command: AddCategoryCommand): Promise<Category> {
    // Generate ID at application/core level
    const id = randomUUID();

    // Create domain object
    const category = Category.create({
      id,
      name: command.name,
      description: command.description,
    });

    // Persist through port
    return await this.categoryPersistor.save(category);
  }
}
