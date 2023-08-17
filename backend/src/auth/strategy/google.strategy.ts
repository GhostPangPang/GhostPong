import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Repository } from 'typeorm';

import { Auth, AuthStatus } from '../../entity/auth.entity';
import { LoginInfo } from '../type/login-info';
config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/api/v1/auth/login/google/callback',
      scope: ['email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<LoginInfo> {
    const email = profile.emails?.[0].value;
    if (email === undefined) {
      throw new UnauthorizedException('Google email is empty');
    }

    const auth = await this.authRepository.findOneBy({ email });
    const loginInfo: LoginInfo = { email, id: null };

    if (auth !== null && auth.status === AuthStatus.REGISTERD) {
      loginInfo.id = auth.id;
    }
    return loginInfo;
  }
}
