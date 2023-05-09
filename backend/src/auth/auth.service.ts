import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';

import { AUTH_JWT_EXPIREIN, USER_JWT_EXPIREIN } from '../common/constant';
import { JwtConfigService } from '../config/auth/jwt/configuration.service';
import { Auth } from '../entity/auth.entity';

import { LoginInfoDto } from './dto/login-info.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly jwtService: JwtService,
    private readonly jwtConfigService: JwtConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // UNREGISTERD -> SIGN UP (Register)
  async signUp(user: LoginInfoDto): Promise<string> {
    const auth = await this.authRepository.findOneBy({ email: user.email });

    if (auth === null) {
      user.id = (await this.authRepository.insert({ email: user.email })).identifiers[0].id;
    } else {
      user.id = auth.id;
    }
    const payload = { userId: user.id };
    const signOptions = {
      secret: this.jwtConfigService.authSecretKey,
      expiresIn: AUTH_JWT_EXPIREIN,
    };
    return this.jwtService.sign(payload, signOptions);
  }

  // REGISTERD -> SIGN IN (Login)
  async signIn(userId: number): Promise<string> {
    // CHECK 필요 없을 거 같음 (무조건 user table에 있는 경우에 signIn이 실행됨)
    // if ((await this.userRepository.findOneBy({ id: userId })) === null) {
    //   throw new NotFoundException('[Login Error] 존재하지 않는 유저입니다.');
    // }
    const payload = { userId };
    const signOptions = {
      secret: this.jwtConfigService.userSecretKey,
      expiresIn: USER_JWT_EXPIREIN,
    };
    return this.jwtService.sign(payload, signOptions);
  }

  // FIXME : delete it (tmp for test)
  async cacheTest() {
    await this.cacheManager.set('hello', 'world');
    const value = await this.cacheManager.get('hello');
    console.log(value);
  }
  // setUp2FA(myId: number, secondaryEmail: string) {}

  // async verify2FA(myId: number) {
  //   // TODO 검증 로직 추가
  //   // NOTE 2차 인증 완료되었다고 가정
  // }
}
