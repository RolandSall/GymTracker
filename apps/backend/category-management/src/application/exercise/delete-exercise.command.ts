import { ICommand } from '@rolandsall24/nest-mediator';

export class DeleteExerciseCommand implements ICommand {
  constructor(public readonly exerciseId: string) {}
}
