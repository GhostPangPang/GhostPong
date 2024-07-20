import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { AppConfigService } from '../../config/app/configuration.service';

@Injectable()
export class UserGuard extends AuthGuard('user') {
  constructor(private reflector: Reflector, private readonly appConfigService: AppConfigService) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
}
