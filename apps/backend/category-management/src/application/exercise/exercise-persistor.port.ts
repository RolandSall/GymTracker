import { Exercise } from '../../domain/entities';

export interface ExercisePersistor {
  save(exercise: Exercise): Promise<Exercise>;
  update(exercise: Exercise): Promise<Exercise>;
  delete(id: string): Promise<void>;
}

export const EXERCISE_PERSISTOR = Symbol('EXERCISE_PERSISTOR');
