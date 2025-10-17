import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ExerciseNotFoundException } from '../../domain/exceptions/exercise-not-found.exception';

@Catch(ExerciseNotFoundException)
export class ExerciseNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: ExerciseNotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.NOT_FOUND).json({
      statusCode: HttpStatus.NOT_FOUND,
      message: exception.message,
      error: 'Not Found',
    });
  }
}
