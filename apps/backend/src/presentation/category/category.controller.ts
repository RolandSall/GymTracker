import { Controller, Post, Body } from '@nestjs/common';
import { AddCategoryHandler } from '../../application/category/add-category.handler';
import { AddCategoryCommand } from '../../application/category/add-category.command';
import { AddCategoryApiRequest } from './add-category-api.request';
import { CategoryApiResponse } from './category-api.response';

@Controller('categories')
export class CategoryController {
  constructor(private readonly addCategoryHandler: AddCategoryHandler) {}

  @Post()
  async create(@Body() request: AddCategoryApiRequest): Promise<CategoryApiResponse> {
    // Map API request to Command
    const command = new AddCategoryCommand(
      request.name,
      request.description
    );

    // Execute command through handler
    const category = await this.addCategoryHandler.execute(command);

    // Map domain object to API response
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
    };
  }
}
