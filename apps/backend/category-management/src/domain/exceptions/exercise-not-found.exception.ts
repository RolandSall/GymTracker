import { DomainException } from './domain.exception';

export class ExerciseNotFoundException extends DomainException {
  constructor(exerciseId: string) {
    super(`Exercise with id ${exerciseId} not found`);
  }
}
