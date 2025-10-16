import { DomainException } from './domain.exception';

export class CategoryNotFoundException extends DomainException {
  constructor(categoryId: string) {
    super(`Category with id ${categoryId} not found`);
  }
}
