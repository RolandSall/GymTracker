export class CategoryHasExercisesException extends Error {
  constructor(categoryId: string, exerciseCount: number) {
    super(
      `Cannot delete category with id "${categoryId}" because it has ${exerciseCount} linked exercise(s). Please delete all exercises first.`
    );
    this.name = 'CategoryHasExercisesException';
  }
}
