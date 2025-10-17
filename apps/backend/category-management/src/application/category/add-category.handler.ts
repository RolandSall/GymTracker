import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@rolandsall24/nest-mediator';
import { randomUUID } from 'crypto';
import { AddCategoryCommand } from './add-category.command';
import { Category } from '../../domain/entities';
import { CategoryPersistor, CATEGORY_PERSISTOR } from './category-persistor.port';
import { CategoryFetcher, CATEGORY_FETCHER } from './category-fetcher.port';
import { CategoryAlreadyExistsException } from '../../domain/exceptions';

@Injectable()
@CommandHandler(AddCategoryCommand)
export class AddCategoryCommandHandler implements ICommandHandler<AddCategoryCommand> {
  constructor(
    @Inject(CATEGORY_PERSISTOR)
    private readonly categoryPersistor: CategoryPersistor,
    @Inject(CATEGORY_FETCHER)
    private readonly categoryFetcher: CategoryFetcher
  ) {}

  async execute(command: AddCategoryCommand): Promise<void> {
    const exists = await this.categoryFetcher.existsByName(command.name);

    if (exists) {
      throw new CategoryAlreadyExistsException(command.name);
    }

    const id = randomUUID();

    const category = Category.create({
      id,
      name: command.name,
      description: command.description,
    });

    await this.categoryPersistor.save(category);
  }
}
