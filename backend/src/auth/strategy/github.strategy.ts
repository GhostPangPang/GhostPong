import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';

import { GithubAuthConfigService } from '../../config/auth/github/configuration.service';
import { LoginInfo } from '../type/login-info';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly githubAuthConfigService: GithubAuthConfigService) {
    super({
      clientID: githubAuthConfigService.clientId,
      clientSecret: githubAuthConfigService.clientSecret,
      callbackURL: githubAuthConfigService.callbackUrl,
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<LoginInfo> {
    const email = profile.emails?.[0].value ?? null;
    return { provider: 'github', email, id: `github-${profile.id}` };
  }
}
