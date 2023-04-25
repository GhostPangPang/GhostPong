import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtConfigService } from '../../config/auth/jwt/configuration.service';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, 'auth') {
  constructor(private readonly jwtConfigService: JwtConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          // console.log(req.cookies['jwt']);
          return req.cookies['jwt-for-unregistered'];
        },
      ]),
      // ignoreExpiration: false,
      secretOrKey: jwtConfigService.authSecretKey,
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
