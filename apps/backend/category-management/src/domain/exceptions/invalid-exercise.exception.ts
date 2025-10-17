import { DomainException } from './domain.exception';

export class InvalidExerciseException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
