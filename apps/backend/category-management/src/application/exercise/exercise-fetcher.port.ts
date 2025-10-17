import { Exercise } from '../../domain/entities';

export interface ExerciseFetcher {
  findById(id: string): Promise<Exercise | null>;
  findByCategoryId(categoryId: string): Promise<Exercise[]>;
}

export const EXERCISE_FETCHER = Symbol('EXERCISE_FETCHER');
