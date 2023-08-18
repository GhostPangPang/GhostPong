import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { config } from 'dotenv';
import { Profile, Strategy } from 'passport-google-oauth20';

import { LoginInfo } from '../type/login-info';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/api/v1/auth/google/callback',
      scope: ['email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<LoginInfo> {
    const email = profile.emails?.[0].value;
    if (email === undefined) {
      throw new UnauthorizedException('Google email is empty');
    }
    return { provider: 'google', email, id: null };
  }
}
