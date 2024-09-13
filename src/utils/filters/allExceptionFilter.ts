import { HttpException } from '@nestjs/common/exceptions';
import { Catch } from "@nestjs/common/decorators/core/catch.decorator"
import { Logger } from "@nestjs/common/services/logger.service"
import { ArgumentsHost, HttpArgumentsHost } from "@nestjs/common/interfaces/features/arguments-host.interface"
import { ExceptionFilter } from "@nestjs/common/interfaces/exceptions/exception-filter.interface"
import { Response } from 'express';


@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();
    const status: number = exception instanceof HttpException
      ? exception.getStatus()
      : 500;

    const message: string | object = exception instanceof HttpException
      ? exception.getResponse()
      : 'Internal server error';

    this.logger.error(`Error occurred: ${message}`);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}
