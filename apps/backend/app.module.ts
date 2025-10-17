import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { NestMediatorModule } from '@rolandsall24/nest-mediator';
import { CategoryController } from './category-management/src/presentation/category/category.controller';
import { AddCategoryCommandHandler } from './category-management/src/application/category/add-category.handler';
import { GetCategoryQueryHandler } from './category-management/src/application/category/get-category.handler';
import { CATEGORY_PERSISTOR } from './category-management/src/application/category/category-persistor.port';
import { CategoryPersistenceAdapter } from './category-management/src/infrastructure/persistence/category/category-persistence.adapter';
import { CategoryNotFoundExceptionFilter } from './category-management/src/presentation/filters/category-not-found-exception.filter';
import { DrizzleClient } from './category-management/src/infrastructure/persistence/drizzle-client.service';
import databaseConfig from './config/database.config';
import {CATEGORY_FETCHER} from "./category-management/src/application/category/category-fetcher.port";

@Module({
  controllers: [CategoryController],
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
      provide: APP_FILTER,
      useClass: CategoryNotFoundExceptionFilter,
    },
    AddCategoryCommandHandler,
    GetCategoryQueryHandler,
  ],
})
export class AppModule {}
