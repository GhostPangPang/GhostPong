import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy } from 'passport-42';
import { Repository } from 'typeorm';

import { FtAuthConfigService } from '../../config/auth/ft/configuration.service';
import { Auth } from '../../entity/auth.entity';
import { UserService } from '../../user/user.service';
import { LoginInfoDto } from '../dto/login-info.dto';

@Injectable()
export class FtOAuthStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private readonly ftAuthConfigService: FtAuthConfigService,
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly userService: UserService,
  ) {
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
  async validate(accessToken: string, refreshToken: string, profile: LoginInfoDto) {
    const auth = await this.authRepository.findOneBy({ email: profile.email });

    // if (auth === null || (await this.userService.findExistUserById(auth.id)) === null) {
    if (auth === null || (await this.userService.getUser(auth.id)) === null) {
      profile.id = null;
    } else {
      profile.id = auth.id;
    }

    return profile;
  }
}
