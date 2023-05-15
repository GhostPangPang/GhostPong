import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  logger: Logger = new Logger('HttpExceptionFilter');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    exception.getStatus() < 500
      ? this.logger.debug(`stack: ${exception.stack}`)
      : this.logger.error(`stack: ${exception.stack}`);
    response.status(status).json(exception.getResponse());
  }
}
