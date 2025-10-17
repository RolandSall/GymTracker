import { ICommand } from '@rolandsall24/nest-mediator';

export class RenameExerciseCommand implements ICommand {
  constructor(
    public readonly exerciseId: string,
    public readonly newName: string
  ) {}
}
