import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtConfigService } from '../../config/auth/jwt/configuration.service';

@Injectable()
export class UserStrategy extends PassportStrategy(Strategy, 'user') {
  constructor(private readonly jwtConfigService: JwtConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies['jwt-for-registered'];
        },
      ]),
      // ignoreExpiration: false,
      secretOrKey: jwtConfigService.userSecretKey,
    });
  }

  async validate(payload: number) {
    const token = {
      userId: payload,
    };
    return token;
  }

  // verify
  // async verify(req, payload, done) {}
}
