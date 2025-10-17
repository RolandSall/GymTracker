import { Injectable, Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@rolandsall24/nest-mediator';
import { GetCategoryQuery } from './get-category.query';
import { Category } from '../../domain/entities';
import { CategoryNotFoundException } from '../../domain/exceptions';
import {CATEGORY_FETCHER, CategoryFetcher} from "./category-fetcher.port";

@Injectable()
@QueryHandler(GetCategoryQuery)
export class GetCategoryQueryHandler implements IQueryHandler<GetCategoryQuery, Category> {
  constructor(
    @Inject(CATEGORY_FETCHER)
    private readonly categoryFetcher: CategoryFetcher
  ) {}

  async execute(query: GetCategoryQuery): Promise<Category> {
    const category = await this.categoryFetcher.findById(query.id);

    if (!category) {
      throw new CategoryNotFoundException(query.id);
    }

    return category;
  }
}
