import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { ExercisePersistor } from '../../../application/exercise/exercise-persistor.port';
import { Exercise } from '../../../domain/entities';
import { EquipmentType, Target, MuscleGroupType } from '../../../domain/value-objects';
import { DrizzleClient } from '../drizzle-client.service';
import { exercises, exerciseTargets } from './exercise.entity';

@Injectable()
export class ExercisePersistenceAdapter implements ExercisePersistor {
  constructor(private readonly drizzleClient: DrizzleClient) {}

  async save(exercise: Exercise): Promise<Exercise> {
    return await this.drizzleClient.db.transaction(async (tx) => {
      const exerciseResult = await tx
        .insert(exercises)
        .values({
          id: exercise.id,
          name: exercise.name,
          description: exercise.description,
          equipmentType: exercise.equipmentType,
          createdAt: exercise.createdAt,
        })
        .returning();

      const savedExercise = exerciseResult[0];

      const targetValues = exercise.targets.map((target) => ({
        id: randomUUID(),
        exerciseId: savedExercise.id,
        categoryId: target.categoryId,
        type: target.type,
      }));

      await tx.insert(exerciseTargets).values(targetValues);

      return new Exercise(
        savedExercise.id,
        savedExercise.name,
        savedExercise.description,
        savedExercise.equipmentType as EquipmentType,
        exercise.targets,
        savedExercise.createdAt
      );
    });
  }

  async findById(id: string): Promise<Exercise | null> {
    const result = await this.drizzleClient.db
      .select()
      .from(exercises)
      .where(eq(exercises.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const exerciseRow = result[0];

    const targetResult = await this.drizzleClient.db
      .select()
      .from(exerciseTargets)
      .where(eq(exerciseTargets.exerciseId, exerciseRow.id));

    const targets = targetResult.map(
      (row) =>
        new Target(row.categoryId, row.type as MuscleGroupType)
    );

    return new Exercise(
      exerciseRow.id,
      exerciseRow.name,
      exerciseRow.description,
      exerciseRow.equipmentType as EquipmentType,
      targets,
      exerciseRow.createdAt
    );
  }

  async findByCategoryId(categoryId: string): Promise<Exercise[]> {
    const linkedExercises = await this.drizzleClient.db
      .select()
      .from(exerciseTargets)
      .where(eq(exerciseTargets.categoryId, categoryId));

    if (linkedExercises.length === 0) {
      return [];
    }

    const exerciseIds = linkedExercises.map((link) => link.exerciseId);

    const exerciseResults = await Promise.all(
      exerciseIds.map((id) => this.findById(id))
    );

    return exerciseResults.filter((ex) => ex !== null) as Exercise[];
  }

  async delete(id: string): Promise<void> {
    await this.drizzleClient.db.delete(exercises).where(eq(exercises.id, id));
  }
}
