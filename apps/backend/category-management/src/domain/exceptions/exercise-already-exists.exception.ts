export class ExerciseAlreadyExistsException extends Error {
  constructor(exerciseName: string) {
    super(`Exercise with name "${exerciseName}" already exists.`);
    this.name = 'ExerciseAlreadyExistsException';
  }
}
