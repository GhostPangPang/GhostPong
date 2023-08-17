import { Injectable, ExecutionContext, InternalServerErrorException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class FtGuard extends AuthGuard('ft') {
  constructor() {
    super();
  }
  logger: Logger = new Logger('FtGuard');

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const maxRetries = 5;

    for (let retry = 0; retry < maxRetries; ++retry) {
      try {
        this.logger.log('FtGuard canActivate() try:', retry);
        return super.canActivate(context);
      } catch (err) {
        // do nothing
        this.logger.error('FtGuard canActivate() error:', err);
      }
    }
    throw new InternalServerErrorException('Max retries exceeded. Unable to activate guard.');
  }
}
