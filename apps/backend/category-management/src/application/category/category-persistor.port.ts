import { Category } from '../../domain/entities';

export interface CategoryPersistor {
  save(category: Category): Promise<Category>;
  findById(id: string): Promise<Category | null>;
}

export const CATEGORY_PERSISTOR = Symbol('CATEGORY_PERSISTOR');
