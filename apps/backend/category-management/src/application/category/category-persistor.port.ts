import { Category } from '../../domain/entities';

export interface CategoryPersistor {
  save(category: Category): Promise<Category>;
  update(category: Category): Promise<Category>;
  delete(id: string): Promise<void>;
}

export const CATEGORY_PERSISTOR = Symbol('CATEGORY_PERSISTOR');
