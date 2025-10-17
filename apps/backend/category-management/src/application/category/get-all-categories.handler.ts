import { Injectable, Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@rolandsall24/nest-mediator';
import { GetAllCategoriesQuery } from './get-all-categories.query';
import { Category } from '../../domain/entities';
import { CategoryFetcher, CATEGORY_FETCHER } from './category-fetcher.port';

@Injectable()
@QueryHandler(GetAllCategoriesQuery)
export class GetAllCategoriesQueryHandler
  implements IQueryHandler<GetAllCategoriesQuery, Category[]>
{
  constructor(
    @Inject(CATEGORY_FETCHER)
    private readonly categoryFetcher: CategoryFetcher
  ) {}

  async execute(_query: GetAllCategoriesQuery): Promise<Category[]> {
    return await this.categoryFetcher.findAll();
  }
}
