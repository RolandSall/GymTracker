import { IQuery } from '@rolandsall24/nest-mediator';

export class GetExerciseQuery implements IQuery {
  constructor(public readonly exerciseId: string) {}
}
