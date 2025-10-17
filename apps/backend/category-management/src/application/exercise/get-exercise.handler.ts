import { Injectable, Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@rolandsall24/nest-mediator';
import { GetExerciseQuery } from './get-exercise.query';
import { Exercise } from '../../domain/entities';
import { EXERCISE_FETCHER } from './exercise-fetcher.port';
import { ExerciseFetcher } from './exercise-fetcher.port';
import { ExerciseNotFoundException } from '../../domain/exceptions';

@Injectable()
@QueryHandler(GetExerciseQuery)
export class GetExerciseQueryHandler implements IQueryHandler<GetExerciseQuery, Exercise> {
  constructor(
    @Inject(EXERCISE_FETCHER)
    private readonly exerciseFetcher: ExerciseFetcher
  ) {}

  async execute(query: GetExerciseQuery): Promise<Exercise> {
    const exercise = await this.exerciseFetcher.findById(query.exerciseId);

    if (!exercise) {
      throw new ExerciseNotFoundException(query.exerciseId);
    }

    return exercise;
  }
}
