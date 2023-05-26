import { Injectable, CanActivate, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class FtGuard extends AuthGuard('ft') implements CanActivate {
  constructor() {
    super();
  }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const maxRetries = 5;

    for (let retry = 0; retry < maxRetries; ++retry) {
      try {
        console.log('FtGuard canActivate() try:', retry);
        return super.canActivate(context);
      } catch (err) {
        // do nothing
        console.log('FtGuard canActivate() error:', err);
      }
    }
    throw new InternalServerErrorException('Max retries exceeded. Unable to activate guard.');
  }
}
