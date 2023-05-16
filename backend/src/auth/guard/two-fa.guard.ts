import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { AppConfigService } from '../../config/app/configuration.service';
import { JwtConfigService } from '../../config/auth/jwt/configuration.service';

@Injectable()
export class TwoFaGuard implements CanActivate {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly jwtService: JwtService,
    private readonly jwtConfigService: JwtConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
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
    const request: Request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies['jwt-for-2fa'];
    try {
      const { userId } = this.jwtService.verify(token, { secret: this.jwtConfigService.twoFaSecretKey });
      request.user = { userId: userId };
      return true;
    } catch {
      throw new UnauthorizedException('2FA 토큰 검증에 실패했습니다.');
    }
  }
}
