import { Injectable, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { AppConfigService } from '../../config/app/configuration.service';

@Injectable()
export class UserGuard extends AuthGuard('user') {
  constructor(private reflector: Reflector, private readonly appConfigService: AppConfigService) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const skipUserGuard = this.reflector.get<boolean>('skipUserGuard', context.getHandler());
    if (skipUserGuard) {
      return true;
    }
    // 개발 환경에서는 토큰 검증을 하지 않음
    if (this.appConfigService.env === 'development') {
      const request: Request = context.switchToHttp().getRequest<Request>();
      const userId = request.headers['x-my-id'];
      if (userId === undefined) {
        throw new BadRequestException('x-my-id is undefined');
      }
      request.user = {
        userId: +userId,
      };
      return true;
    }
    return super.canActivate(context);
  }
}
