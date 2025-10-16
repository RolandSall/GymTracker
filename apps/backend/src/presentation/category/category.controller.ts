import { Controller, Post, Body } from '@nestjs/common';
import { MediatorService } from '@gym-tracker/nest-mediator';
import { AddCategoryCommand } from '../../application/category/add-category.command';
import { AddCategoryApiRequest } from './add-category-api.request';

@Controller('categories')
export class CategoryController {
  constructor(private readonly mediator: MediatorService) {}

  @Post()
  async create(@Body() request: AddCategoryApiRequest): Promise<void> {
    const command = new AddCategoryCommand(
      request.name,
      request.description
    );

    await this.mediator.send(command);
  }
}
