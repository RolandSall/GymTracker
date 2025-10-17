import { ICommand } from '@rolandsall24/nest-mediator';

export class RenameCategoryCommand implements ICommand {
  constructor(
    public readonly categoryId: string,
    public readonly newName: string
  ) {}
}
