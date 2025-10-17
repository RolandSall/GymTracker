import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MediatorBus } from '@rolandsall24/nest-mediator';
import { AddCategoryCommand } from '../../application/category/add-category.command';
import { GetCategoryQuery } from '../../application/category/get-category.query';
import { GetAllCategoriesQuery } from '../../application/category/get-all-categories.query';
import { AddCategoryApiRequest } from './add-category-api.request';
import { CategoryApiResponse } from './category-api.response';
import {Category} from "../../domain/entities";

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly mediator: MediatorBus) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new muscle group category',
    description: 'Creates a new muscle group category that can be used to organize exercises',
  })
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data (validation failed).',
  })
  async create(@Body() request: AddCategoryApiRequest): Promise<void> {
    const command = new AddCategoryCommand(
      request.name,
      request.description
    );

    await this.mediator.send(command);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all categories',
    description: 'Retrieves a list of all muscle group categories in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all categories retrieved successfully.',
    type: [CategoryApiResponse],
  })
  async getAll(): Promise<CategoryApiResponse[]> {
    const query = new GetAllCategoriesQuery();
    const categories: Category[] = await this.mediator.query(query);

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
    }));
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a category by ID',
    description: 'Retrieves a specific muscle group category by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The ID of the category to retrieve',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Category retrieved successfully.',
    type: CategoryApiResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found.',
  })
  async getById(@Param('id') id: string): Promise<CategoryApiResponse> {
    const query = new GetCategoryQuery(id);
    const category: Category = await this.mediator.query(query);

    return {
      id: category.id,
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
    };
  }
}
