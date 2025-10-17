import { Injectable, Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@rolandsall24/nest-mediator';
import { GetExercisesByCategoryQuery } from './get-exercises-by-category.query';
import { Exercise } from '../../domain/entities';
import { ExerciseFetcher, EXERCISE_FETCHER } from './exercise-fetcher.port';

@Injectable()
@QueryHandler(GetExercisesByCategoryQuery)
export class GetExercisesByCategoryQueryHandler
  implements IQueryHandler<GetExercisesByCategoryQuery, Exercise[]>
{
  constructor(
    @Inject(EXERCISE_FETCHER)
    private readonly exerciseFetcher: ExerciseFetcher
  ) {}

  async execute(query: GetExercisesByCategoryQuery): Promise<Exercise[]> {
    return await this.exerciseFetcher.findByCategoryId(query.categoryId);
  }
}
