import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { NestMediatorModule } from '@rolandsall24/nest-mediator';
import { CategoryController } from './category-management/src/presentation/category/category.controller';
import { AddCategoryCommandHandler } from './category-management/src/application/category/add-category.handler';
import { RenameCategoryCommandHandler } from './category-management/src/application/category/rename-category.handler';
import { DeleteCategoryCommandHandler } from './category-management/src/application/category/delete-category.handler';
import { GetCategoryQueryHandler } from './category-management/src/application/category/get-category.handler';
import { GetAllCategoriesQueryHandler } from './category-management/src/application/category/get-all-categories.handler';
import { GetExerciseQueryHandler } from './category-management/src/application/exercise/get-exercise.handler';
import { CATEGORY_PERSISTOR } from './category-management/src/application/category/category-persistor.port';
import { CATEGORY_FETCHER } from './category-management/src/application/category/category-fetcher.port';
import { CategoryPersistenceAdapter } from './category-management/src/infrastructure/persistence/category/category-persistence.adapter';
import { CategoryNotFoundExceptionFilter } from './category-management/src/presentation/category/category-not-found-exception.filter';
import { ExerciseController } from './category-management/src/presentation/exercise/exercise.controller';
import { AddExerciseCommandHandler } from './category-management/src/application/exercise/add-exercise.handler';
import { RenameExerciseCommandHandler } from './category-management/src/application/exercise/rename-exercise.handler';
import { GetExercisesByCategoryQueryHandler } from './category-management/src/application/exercise/get-exercises-by-category.handler';
import { DeleteExerciseCommandHandler } from './category-management/src/application/exercise/delete-exercise.handler';
import { EXERCISE_PERSISTOR } from './category-management/src/application/exercise/exercise-persistor.port';
import { EXERCISE_FETCHER } from './category-management/src/application/exercise/exercise-fetcher.port';
import { ExercisePersistenceAdapter } from './category-management/src/infrastructure/persistence/exercise/exercise-persistence.adapter';
import { DrizzleClient } from './category-management/src/infrastructure/persistence/drizzle-client.service';
import databaseConfig from './config/database.config';

@Module({
  controllers: [CategoryController, ExerciseController],
  imports: [
    ConfigModule.forFeature(databaseConfig),
    NestMediatorModule.forRoot(),
  ],
  providers: [
    DrizzleClient,
    {
      provide: CATEGORY_PERSISTOR,
      useClass: CategoryPersistenceAdapter,
    },
    {
      provide: CATEGORY_FETCHER,
      useExisting: CATEGORY_PERSISTOR,
    },
    {
      provide: EXERCISE_PERSISTOR,
      useClass: ExercisePersistenceAdapter,
    },
    {
      provide: EXERCISE_FETCHER,
      useExisting: EXERCISE_PERSISTOR,
    },
    {
      provide: APP_FILTER,
      useClass: CategoryNotFoundExceptionFilter,
    },
    AddCategoryCommandHandler,
    RenameCategoryCommandHandler,
    DeleteCategoryCommandHandler,
    GetCategoryQueryHandler,
    GetAllCategoriesQueryHandler,
    AddExerciseCommandHandler,
    RenameExerciseCommandHandler,
    GetExerciseQueryHandler,
    GetExercisesByCategoryQueryHandler,
    DeleteExerciseCommandHandler,
  ],
})
export class AppModule {}
