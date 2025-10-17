import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@rolandsall24/nest-mediator';
import { RenameCategoryCommand } from './rename-category.command';
import { CategoryPersistor, CATEGORY_PERSISTOR } from './category-persistor.port';
import { CategoryFetcher, CATEGORY_FETCHER } from './category-fetcher.port';
import { CategoryNotFoundException } from '../../domain/exceptions';

@Injectable()
@CommandHandler(RenameCategoryCommand)
export class RenameCategoryCommandHandler implements ICommandHandler<RenameCategoryCommand> {
  constructor(
    @Inject(CATEGORY_PERSISTOR)
    private readonly categoryPersistor: CategoryPersistor,
    @Inject(CATEGORY_FETCHER)
    private readonly categoryFetcher: CategoryFetcher
  ) {}

  async execute(command: RenameCategoryCommand): Promise<void> {
    const category = await this.categoryFetcher.findById(command.categoryId);

    if (!category) {
      throw new CategoryNotFoundException(command.categoryId);
    }

    const renamedCategory = category.rename(command.newName);
    await this.categoryPersistor.update(renamedCategory);
  }
}
