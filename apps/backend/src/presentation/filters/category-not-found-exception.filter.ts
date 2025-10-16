import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { CategoryNotFoundException } from '../../domain/exceptions';

@Catch(CategoryNotFoundException)
export class CategoryNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: CategoryNotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.NOT_FOUND).json({
      statusCode: HttpStatus.NOT_FOUND,
      message: exception.message,
      error: 'Not Found',
    });
  }
}
