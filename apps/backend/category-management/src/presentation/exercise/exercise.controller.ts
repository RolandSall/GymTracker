import { Controller, Post, Get, Delete, Body, Param, HttpCode, HttpStatus, UseFilters } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MediatorBus } from '@rolandsall24/nest-mediator';
import { AddExerciseCommand } from '../../application/exercise/add-exercise.command';
import { GetExercisesByCategoryQuery } from '../../application/exercise/get-exercises-by-category.query';
import { DeleteExerciseCommand } from '../../application/exercise/delete-exercise.command';
import { AddExerciseApiRequest } from './add-exercise-api.request';
import { ExerciseApiResponse } from './exercise-api.response';
import { EquipmentType } from '../../domain/value-objects';
import { InvalidExerciseExceptionFilter } from './invalid-exercise-exception.filter';
import { ExerciseNotFoundExceptionFilter } from './exercise-not-found-exception.filter';
import {Exercise} from "../../domain/entities";

@ApiTags('exercises')
@Controller('exercises')
@UseFilters(InvalidExerciseExceptionFilter, ExerciseNotFoundExceptionFilter)
export class ExerciseController {
  constructor(private readonly mediator: MediatorBus) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new exercise',
    description: 'Creates a new exercise with specified equipment type and muscle group targets. Must include exactly one primary muscle group and can have multiple secondary muscle groups.',
  })
  @ApiResponse({
    status: 201,
    description: 'The exercise has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data (validation failed or domain rules violated - e.g., missing primary muscle group).',
  })
  async create(@Body() request: AddExerciseApiRequest): Promise<void> {
    const command = new AddExerciseCommand(
      request.name,
      request.description,
      EquipmentType[request.equipmentType],
      request.targets
    );

    await this.mediator.send(command);
  }

  @Get('category/:categoryId')
  @ApiOperation({
    summary: 'Get exercises by category',
    description: 'Retrieves all exercises that target a specific muscle group category (either as primary or secondary)',
  })
  @ApiParam({
    name: 'categoryId',
    type: 'string',
    description: 'The ID of the category (muscle group) to filter exercises by',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'List of exercises targeting the specified category retrieved successfully.',
    type: [ExerciseApiResponse],
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found.',
  })
  async getByCategory(
    @Param('categoryId') categoryId: string
  ): Promise<ExerciseApiResponse[]> {
    const query = new GetExercisesByCategoryQuery(categoryId);
    const exercises:  Exercise[] = await this.mediator.query(query);

    return exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      equipmentType: exercise.equipmentType,
      targets: exercise.targets.map((target) => ({
        categoryId: target.categoryId,
        type: target.type,
      })),
      createdAt: exercise.createdAt,
    }));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete an exercise',
    description: 'Permanently deletes an exercise from the system. This will also remove all muscle group associations.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The ID of the exercise to delete',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'The exercise has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Exercise not found.',
  })
  async delete(@Param('id') id: string): Promise<void> {
    const command = new DeleteExerciseCommand(id);
    await this.mediator.send(command);
  }
}
