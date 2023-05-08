/**
 * @description already logged in user can't issue new token
 */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { AppConfigService } from '../../config/app/configuration.service';
import { JwtConfigService } from '../../config/auth/jwt/configuration.service';

@Injectable()
export class ReissueGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
    private readonly jwtConfigService: JwtConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      return true;
    }
    try {
      this.jwtService.verify(token, {
        secret: this.jwtConfigService.userSecretKey,
      });
    } catch {
      return true;
    }
    // 이미 valid한 토큰이 있는 경우
    const response = context.switchToHttp().getResponse();
    const clientUrl = this.appConfigService.clientUrl;
    response.redirect(`${clientUrl}/`);
    return false;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
