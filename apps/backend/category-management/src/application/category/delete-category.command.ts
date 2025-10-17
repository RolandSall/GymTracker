import { ICommand } from '@rolandsall24/nest-mediator';

export class DeleteCategoryCommand implements ICommand {
  constructor(public readonly categoryId: string) {}
}
