import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

import { GoogleAuthConfigService } from '../../config/auth/google/configuration.service';
import { LoginInfo } from '../type/login-info';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(googleAuthConfigService: GoogleAuthConfigService) {
    super({
      clientID: googleAuthConfigService.clientId,
      clientSecret: googleAuthConfigService.clientSecret,
      callbackURL: googleAuthConfigService.callbackUrl,
      scope: ['email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<LoginInfo> {
    const email = profile.emails?.[0].value ?? null;
    return { provider: 'google', email, id: `google-${profile.id}` };
  }
}
