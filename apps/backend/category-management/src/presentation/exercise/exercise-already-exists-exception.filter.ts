import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ExerciseAlreadyExistsException } from '../../domain/exceptions';

@Catch(ExerciseAlreadyExistsException)
export class ExerciseAlreadyExistsExceptionFilter implements ExceptionFilter {
  catch(exception: ExerciseAlreadyExistsException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.CONFLICT).json({
      statusCode: HttpStatus.CONFLICT,
      message: exception.message,
      error: 'Conflict',
    });
  }
}
