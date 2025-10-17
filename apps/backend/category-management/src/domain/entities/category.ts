export class Category {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly createdAt: Date
  ) {}

  static create(params: {
    id: string;
    name: string;
    description: string;
  }): Category {
    const now = new Date();
    return new Category(
      params.id,
      params.name,
      params.description,
      now
    );
  }

  rename(newName: string): Category {
    return new Category(
      this.id,
      newName,
      this.description,
      this.createdAt
    );
  }
}
