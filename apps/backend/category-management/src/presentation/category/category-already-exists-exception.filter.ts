import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { CategoryAlreadyExistsException } from '../../domain/exceptions';

@Catch(CategoryAlreadyExistsException)
export class CategoryAlreadyExistsExceptionFilter implements ExceptionFilter {
  catch(exception: CategoryAlreadyExistsException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.CONFLICT).json({
      statusCode: HttpStatus.CONFLICT,
      message: exception.message,
      error: 'Conflict',
    });
  }
}
