import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { NestMediatorModule } from '@rolandsall24/nest-mediator';
import { CategoryController } from './presentation/category/category.controller';
import { AddCategoryCommandHandler } from './application/category/add-category.handler';
import { GetCategoryQueryHandler } from './application/category/get-category.handler';
import { CATEGORY_PERSISTOR } from './application/category/category-persistor.port';
import { CategoryPersistenceAdapter } from './infrastructure/persistence/category/category-persistence.adapter';
import { CategoryNotFoundExceptionFilter } from './presentation/filters/category-not-found-exception.filter';
import { DrizzleClient } from './infrastructure/persistence/drizzle-client.service';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig),
    NestMediatorModule.forRoot(),
  ],
  controllers: [CategoryController],
  providers: [
    DrizzleClient,
    {
      provide: CATEGORY_PERSISTOR,
      useClass: CategoryPersistenceAdapter,
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
