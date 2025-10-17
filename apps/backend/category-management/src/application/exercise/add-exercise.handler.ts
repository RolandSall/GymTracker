import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@rolandsall24/nest-mediator';
import { randomUUID } from 'crypto';
import { AddExerciseCommand } from './add-exercise.command';
import { Exercise } from '../../domain/entities';
import { Target } from '../../domain/value-objects';
import { MuscleGroupType } from '../../domain/value-objects';
import { InvalidExerciseException } from '../../domain/exceptions/invalid-exercise.exception';
import { ExercisePersistor, EXERCISE_PERSISTOR } from './exercise-persistor.port';

@Injectable()
@CommandHandler(AddExerciseCommand)
export class AddExerciseCommandHandler implements ICommandHandler<AddExerciseCommand> {
  constructor(
    @Inject(EXERCISE_PERSISTOR)
    private readonly exercisePersistor: ExercisePersistor
  ) {}

  async execute(command: AddExerciseCommand): Promise<void> {
    const id = randomUUID();

    const targets = command.targets.map((target) =>
      Target.create({
        categoryId: target.categoryId,
        type: MuscleGroupType[target.type],
      })
    );

    this.validateTargets(targets);

    const exercise = Exercise.create({
      id,
      name: command.name,
      description: command.description,
      equipmentType: command.equipmentType,
      targets,
    });

    await this.exercisePersistor.save(exercise);
  }

  private validateTargets(targets: Target[]): void {
    if (!targets || targets.length === 0) {
      throw new InvalidExerciseException(
        'Exercise must be linked to at least one category'
      );
    }

    const primaryTargets = targets.filter((target) => target.isPrimary());

    if (primaryTargets.length === 0) {
      throw new InvalidExerciseException(
        'Exercise must have exactly one primary muscle group'
      );
    }

    if (primaryTargets.length > 1) {
      throw new InvalidExerciseException(
        `Exercise can only have one primary muscle group, but ${primaryTargets.length} were provided`
      );
    }
  }
}
