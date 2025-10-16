import { Injectable, Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@gym-tracker/nest-mediator';
import { GetCategoryQuery } from './get-category.query';
import { Category } from '../../domain/entities';
import { CategoryNotFoundException } from '../../domain/exceptions';
import { CategoryPersistor, CATEGORY_PERSISTOR } from './category-persistor.port';

@Injectable()
@QueryHandler(GetCategoryQuery)
export class GetCategoryQueryHandler implements IQueryHandler<GetCategoryQuery, Category> {
  constructor(
    @Inject(CATEGORY_PERSISTOR)
    private readonly categoryPersistor: CategoryPersistor
  ) {}

  async execute(query: GetCategoryQuery): Promise<Category> {
    const category = await this.categoryPersistor.findById(query.id);

    if (!category) {
      throw new CategoryNotFoundException(query.id);
    }

    return category;
  }
}
