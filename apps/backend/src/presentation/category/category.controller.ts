import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { MediatorBus } from '@rolandsall24/nest-mediator';
import { AddCategoryCommand } from '../../application/category/add-category.command';
import { GetCategoryQuery } from '../../application/category/get-category.query';
import { AddCategoryApiRequest } from './add-category-api.request';
import { CategoryApiResponse } from './category-api.response';

@Controller('categories')
export class CategoryController {
  constructor(private readonly mediator: MediatorBus) {}

  @Post()
  async create(@Body() request: AddCategoryApiRequest): Promise<void> {
    const command = new AddCategoryCommand(
      request.name,
      request.description
    );

    await this.mediator.send(command);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<CategoryApiResponse> {
    const query = new GetCategoryQuery(id);
    const category = await this.mediator.query(query);

    return {
      id: category.id,
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
    };
  }
}
