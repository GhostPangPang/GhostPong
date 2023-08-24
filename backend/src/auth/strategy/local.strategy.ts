import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { LocalLoginRequestDto } from '../dto/request/local-login-request.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor() {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: false,
    });
  }

  async validate(email: string, password: string): Promise<LocalLoginRequestDto> {
    return { email, password };
  }
}
