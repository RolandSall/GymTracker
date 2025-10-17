import { Category } from '../../domain/entities';

export interface CategoryPersistor {
  save(category: Category): Promise<Category>;
}

export const CATEGORY_PERSISTOR = Symbol('CATEGORY_PERSISTOR');
