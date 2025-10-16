export class AddCategoryCommand {
  constructor(
    public readonly name: string,
    public readonly description: string
  ) {}
}
