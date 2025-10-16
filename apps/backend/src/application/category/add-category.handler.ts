import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@gym-tracker/nest-mediator';
import { randomUUID } from 'crypto';
import { AddCategoryCommand } from './add-category.command';
import { Category } from '../../domain/entities';
import { CategoryPersistor, CATEGORY_PERSISTOR } from './category-persistor.port';

@Injectable()
@CommandHandler(AddCategoryCommand)
export class AddCategoryCommandHandler implements ICommandHandler<AddCategoryCommand> {
  constructor(
    @Inject(CATEGORY_PERSISTOR)
    private readonly categoryPersistor: CategoryPersistor
  ) {}

  async execute(command: AddCategoryCommand): Promise<void> {
    const id = randomUUID();

    const category = Category.create({
      id,
      name: command.name,
      description: command.description,
    });

    await this.categoryPersistor.save(category);
  }
}
