import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
      const request = context.switchToHttp().getRequest();
      const userId = request.headers['x-my-id'];
      if (userId === undefined) {
        throw new BadRequestException('x-my-id is undefined');
      }
      request.user = {
        userId: +userId,
      };
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['jwt-for-2fa'];
    try {
      this.jwtService.verify(token, { secret: this.jwtConfigService.twoFaSecretKey });
      return true;
    } catch {
      throw new UnauthorizedException('2FA Token is invalid');
    }
  }
}
