import { ICommand } from '@rolandsall24/nest-mediator';

export class AddCategoryCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly description: string
  ) {}
}
