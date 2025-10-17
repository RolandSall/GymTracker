import { IQuery } from '@rolandsall24/nest-mediator';

export class GetExercisesByCategoryQuery implements IQuery {
  constructor(public readonly categoryId: string) {}
}
