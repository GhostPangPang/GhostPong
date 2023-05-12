import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, ConflictException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';

import { AUTH_JWT_EXPIREIN, TWO_FACTOR_AUTH_EXPIREIN, USER_JWT_EXPIREIN } from '../common/constant';
import { JwtConfigService } from '../config/auth/jwt/configuration.service';
import { Auth } from '../entity/auth.entity';

import { LoginInfo } from './type/login-info';
import { TwoFactorAuth } from './type/two-factor-auth';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly jwtService: JwtService,
    private readonly jwtConfigService: JwtConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly mailerService: MailerService,
  ) {}

  // UNREGISTERD -> SIGN UP (Register)
  async signUp(user: LoginInfo): Promise<string> {
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

  async twoFactorAuth(myId: number, email: string) {
    const myTwoFa = await this.authRepository.findOne({ where: { id: myId }, select: ['twoFa'] });
    if (myTwoFa !== null && myTwoFa.twoFa !== '') {
      throw new ConflictException('이미 인증이 완료된 유저입니다.');
    }
    if ((await this.authRepository.findOneBy({ twoFa: email })) !== null) {
      throw new ConflictException('이미 인증이 완료된 이메일입니다.');
    }
    const code = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');

    await this.mailerService.sendMail({
      to: email,
      subject: 'GhostPhong 인증번호입니다 ✔',
      html: this.getEmailTemplate(code),
    });

    await this.cacheManager.set(`${myId}`, { email, code }, TWO_FACTOR_AUTH_EXPIREIN);
    return { message: '2단계 인증 이메일이 전송되었습니다.' };
  }

  async verifyTwoFactorAuth(myId: number, code: string) {
    const auth = await this.authRepository.findOneBy({ id: myId });
    if (auth !== null && auth.twoFa !== '') {
      throw new ConflictException('이미 2단계 인증이 완료된 유저입니다.');
    }

    const value: TwoFactorAuth | undefined = await this.cacheManager.get(`${myId}`);
    if (value === undefined) {
      throw new ForbiddenException('유효하지 않은 인증 코드입니다.');
    }
    if ((await this.authRepository.findOneBy({ email: value.email })) !== null) {
      throw new ConflictException('이미 2단계 인증이 완료된 이메일입니다.');
    }
    if (value.code !== code) {
      throw new BadRequestException('잘못된 인증 코드입니다.');
    }

    await this.authRepository.update({ id: myId }, { twoFa: value.email });
    await this.cacheManager.del(`${myId}`);

    return { message: '2단계 인증이 완료되었습니다.' };
  }

  // SECTION private
  private getEmailTemplate(code: string) {
    return `
    <!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>Authentication Code Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      font-size: 16px;
      line-height: 1.5;
      background-color: #f0f0f0;
      padding: 20px;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #fff;
      border-radius: 5px;
      padding: 40px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    }

    h1 {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    p {
      margin-bottom: 20px;
    }

    .code {
      font-size: 28px;
      font-weight: bold;
      background-color: #eee;
      padding: 10px 20px;
      border-radius: 5px;
      display: inline-block;
      margin-bottom: 20px;
    }
  </style>
</head>

<body>
  <div class="container">
    <h1>GhostPhong Authentication Code</h1>
    <p>Your authentication code is:</p>
    <div class="code">${code}</div>
    <p>Please enter this code in the application to complete the authentication process.</p>
  </div>
</body>

</html>
    `;
  }
}
