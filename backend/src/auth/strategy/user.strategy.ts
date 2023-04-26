import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../../common/type/jwt-payload';
import { JwtConfigService } from '../../config/auth/jwt/configuration.service';

@Injectable()
export class UserStrategy extends PassportStrategy(Strategy, 'user') {
  constructor(private readonly jwtConfigService: JwtConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const token = req.cookies['jwt-for-registered'];
          return token;
        },
      ]),
      // ignoreExpiration: false,
      secretOrKey: jwtConfigService.userSecretKey,
    });
  }

  async validate(payload: JwtPayload) {
    const token = {
      userId: payload.userId,
    };
    return token;
  }
}
