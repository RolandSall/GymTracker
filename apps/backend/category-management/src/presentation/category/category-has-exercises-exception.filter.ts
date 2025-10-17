import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { CategoryHasExercisesException } from '../../domain/exceptions';

@Catch(CategoryHasExercisesException)
export class CategoryHasExercisesExceptionFilter implements ExceptionFilter {
  catch(exception: CategoryHasExercisesException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: exception.message,
      error: 'Bad Request',
    });
  }
}
