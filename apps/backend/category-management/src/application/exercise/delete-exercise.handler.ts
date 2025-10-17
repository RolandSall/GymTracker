import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@rolandsall24/nest-mediator';
import { DeleteExerciseCommand } from './delete-exercise.command';
import { ExerciseNotFoundException } from '../../domain/exceptions/exercise-not-found.exception';
import { ExercisePersistor, EXERCISE_PERSISTOR } from './exercise-persistor.port';
import {EXERCISE_FETCHER, ExerciseFetcher} from "./exercise-fetcher.port";

@Injectable()
@CommandHandler(DeleteExerciseCommand)
export class DeleteExerciseCommandHandler implements ICommandHandler<DeleteExerciseCommand> {
  constructor(
    @Inject(EXERCISE_FETCHER)
    private readonly exerciseFetcher: ExerciseFetcher,
    @Inject(EXERCISE_PERSISTOR)
  private readonly exercisePersistor: ExercisePersistor
  ) {}

  async execute(command: DeleteExerciseCommand): Promise<void> {
    const exercise = await this.exerciseFetcher.findById(command.exerciseId);

    if (!exercise) {
      throw new ExerciseNotFoundException(command.exerciseId);
    }

    await this.exercisePersistor.delete(command.exerciseId);
  }
}
