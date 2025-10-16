import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestMediatorModule } from '@gym-tracker/nest-mediator';
import { CategoryController } from './presentation/category/category.controller';
import { AddCategoryCommandHandler } from './application/category/add-category.handler';
import { CATEGORY_PERSISTOR } from './application/category/category-persistor.port';
import { CategoryPersistenceAdapter } from './infrastructure/persistence/category/category-persistence.adapter';
import { DrizzleClient } from './infrastructure/persistence/drizzle-client.service';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig),
    NestMediatorModule.forRoot({
      handlers: [
        AddCategoryCommandHandler,
      ],
    }),
  ],
  controllers: [CategoryController],
  providers: [
    DrizzleClient,
    {
      provide: CATEGORY_PERSISTOR,
      useClass: CategoryPersistenceAdapter,
    },
    AddCategoryCommandHandler
  ],
})
export class AppModule {}
