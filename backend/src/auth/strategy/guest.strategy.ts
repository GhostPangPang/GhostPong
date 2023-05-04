import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../../common/type/jwt-payload';
import { JwtConfigService } from '../../config/auth/jwt/configuration.service';

@Injectable()
export class GuestStrategy extends PassportStrategy(Strategy, 'guest') {
  constructor(private readonly jwtConfigService: JwtConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies['jwt-for-unregistered'];
        },
      ]),
      secretOrKey: jwtConfigService.authSecretKey,
    });
  }

  async validate(payload: JwtPayload) {
    // console.log("auth strategy's validate");
    const token = {
      // email: payload.email,
      userId: payload.userId,
    };
    return token;
  }
}
