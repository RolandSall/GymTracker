import { Category } from '../../domain/entities';

export interface CategoryFetcher {
  findById(id: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
}

export const CATEGORY_FETCHER = Symbol('CATEGORY_FETCHER');
