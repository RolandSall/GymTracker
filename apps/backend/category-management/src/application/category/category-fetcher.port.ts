import { Category } from '../../domain/entities';

export interface CategoryFetcher {
  findById(id: string): Promise<Category | null>;
}

export const CATEGORY_FETCHER = Symbol('CATEGORY_FETCHER');
