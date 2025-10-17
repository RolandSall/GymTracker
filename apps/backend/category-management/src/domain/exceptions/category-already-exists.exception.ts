export class CategoryAlreadyExistsException extends Error {
  constructor(categoryName: string) {
    super(`Category with name "${categoryName}" already exists.`);
    this.name = 'CategoryAlreadyExistsException';
  }
}
