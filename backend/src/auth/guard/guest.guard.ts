import { Injectable, CanActivate, ExecutionContext, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Observable } from 'rxjs';

import { AppConfigService } from '../../config/app/configuration.service';
import { JwtConfigService } from '../../config/auth/jwt/configuration.service';

@Injectable()
export class GuestGuard extends PassportStrategy(Strategy) implements CanActivate {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly jwtService: JwtService,
    private readonly jwtConfigService: JwtConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfigService.authSecretKey,
    });
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
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
    const token = request.cookies['jwt-for-unregistered'];
    try {
      const { userId } = this.jwtService.verify(token, { secret: this.jwtConfigService.authSecretKey });
      request.user = { userId: userId };
      return true;
    } catch {
      throw new UnauthorizedException('guest 토큰 검증에 실패했습니다.');
    }
  }
}
