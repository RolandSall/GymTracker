import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@rolandsall24/nest-mediator';
import { RenameExerciseCommand } from './rename-exercise.command';
import { ExercisePersistor, EXERCISE_PERSISTOR } from './exercise-persistor.port';
import { ExerciseNotFoundException } from '../../domain/exceptions';
import {EXERCISE_FETCHER, ExerciseFetcher} from "./exercise-fetcher.port";

@Injectable()
@CommandHandler(RenameExerciseCommand)
export class RenameExerciseCommandHandler implements ICommandHandler<RenameExerciseCommand> {
  constructor(
    @Inject(EXERCISE_PERSISTOR)
    private readonly exercisePersistor: ExercisePersistor,
    @Inject(EXERCISE_FETCHER)
  private readonly  exerciseFetcher: ExerciseFetcher
  ) {}

  async execute(command: RenameExerciseCommand): Promise<void> {
    const exercise = await this.exerciseFetcher.findById(command.exerciseId);

    if (!exercise) {
      throw new ExerciseNotFoundException(command.exerciseId);
    }

    const renamedExercise = exercise.rename(command.newName);
    await this.exercisePersistor.update(renamedExercise);
  }
}
