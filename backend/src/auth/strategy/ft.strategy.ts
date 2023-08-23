import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';

import { FtAuthConfigService } from '../../config/auth/ft/configuration.service';
import { LoginInfo } from '../type/login-info';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, 'ft') {
  constructor(private readonly ftAuthConfigService: FtAuthConfigService) {
    super({
      clientID: ftAuthConfigService.id,
      clientSecret: ftAuthConfigService.secret,
      callbackURL: ftAuthConfigService.url,
      profileFields: {
        // validate()에서 사용할 정보 (profile에 들어있음)
        email: 'email',
      },
    });
  }

  /**
   * @description 42 로그인 성공 후 호출됨
   * @param accessToken  42에서 발급한 access token
   * @param refreshToken  42에서 발급한 refresh token
   * @param profile  42에서 받아온 사용자 정보
   * @param cb  validate()에서 return한 값이 request 객체에 담김
   * @returns  validate()에서 return한 값
   */
  async validate(accessToken: string, refreshToken: string, profile: LoginInfo): Promise<LoginInfo> {
    return { provider: 'ft', email: profile.email ?? null, id: `ft-${profile.id}` };
  }
}
