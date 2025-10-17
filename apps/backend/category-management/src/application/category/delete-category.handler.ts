import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@rolandsall24/nest-mediator';
import { DeleteCategoryCommand } from './delete-category.command';
import { CategoryPersistor, CATEGORY_PERSISTOR } from './category-persistor.port';
import { CategoryFetcher, CATEGORY_FETCHER } from './category-fetcher.port';
import { CategoryNotFoundException, CategoryHasExercisesException } from '../../domain/exceptions';
import { ExercisePersistor, EXERCISE_PERSISTOR } from '../exercise/exercise-persistor.port';
import {Category} from "../../domain/entities";
import {EXERCISE_FETCHER, ExerciseFetcher} from "../exercise/exercise-fetcher.port";

@Injectable()
@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryCommandHandler implements ICommandHandler<DeleteCategoryCommand> {
  constructor(
    @Inject(CATEGORY_PERSISTOR)
    private readonly categoryPersistor: CategoryPersistor,
    @Inject(CATEGORY_FETCHER)
    private readonly categoryFetcher: CategoryFetcher,
    @Inject(EXERCISE_FETCHER)
    private readonly exerciseFetcher: ExerciseFetcher
  ) {}

  async execute(command: DeleteCategoryCommand): Promise<void> {
    const category: Category = await this.categoryFetcher.findById(command.categoryId);

    if (!category) {
      throw new CategoryNotFoundException(command.categoryId);
    }

    const exerciseCount = await this.exerciseFetcher.countByCategoryId(command.categoryId);

    if (exerciseCount > 0) {
      throw new CategoryHasExercisesException(command.categoryId, exerciseCount);
    }

    await this.categoryPersistor.delete(command.categoryId);
  }
}
