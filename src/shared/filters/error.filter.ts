import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  private logger = new Logger(ErrorExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    const status = exception?.status ?? 500;
    const message = exception?.response?.message ?? 'Internal Server Error';

    this.logger.error(exception);

    res.status(status).send({ sucess: false, messages: [message] });
  }
}
