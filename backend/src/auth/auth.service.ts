import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { compare, hash } from 'bcrypt';
import { Cache } from 'cache-manager';
import { nanoid } from 'nanoid';
import { EntityManager, Repository } from 'typeorm';

import { AUTH_JWT_EXPIRES_IN, TWO_FA_EXPIRES_IN, TWO_FA_JWT_EXPIRES_IN, USER_JWT_EXPIRES_IN } from '../common/constant';
import { SuccessResponseDto } from '../common/dto/success-response.dto';
import { AppConfigService } from '../config/app/configuration.service';
import { JwtConfigService } from '../config/auth/jwt/configuration.service';
import { Auth, AuthStatus } from '../entity/auth.entity';
import { UserRecord } from '../entity/user-record.entity';
import { User } from '../entity/user.entity';

import { LocalLoginRequestDto } from './dto/request/local-login-request.dto';
import { LocalSignUpRequestDto } from './dto/request/local-signup-request.dto';
import { TwoFactorAuthResponseDto } from './dto/response/two-factor-auth-response.dto';
import { LoginInfo } from './type/login-info';
import { LoginResponseOptions } from './type/login-response-options';
import { TwoFactorAuth } from './type/two-factor-auth';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly jwtConfigService: JwtConfigService,
    private readonly appConfigService: AppConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly mailerService: MailerService,
  ) {}

  async signUp(auth: Auth | null, loginInfo: LoginInfo): Promise<string> {
    let authId: number;
    if (auth === null) {
      authId = await this.createAuth(loginInfo.email, null, loginInfo.id);
    } else {
      authId = auth.id;
    }
    const payload = { userId: authId };
    const signOptions = {
      secret: this.jwtConfigService.authSecretKey,
      expiresIn: AUTH_JWT_EXPIRES_IN,
    };
    return this.jwtService.sign(payload, signOptions);
  }

  signIn(userId: number): string {
    const payload = { userId };
    const signOptions = {
      secret: this.jwtConfigService.userSecretKey,
      expiresIn: USER_JWT_EXPIRES_IN,
    };
    return this.jwtService.sign(payload, signOptions);
  }

  async socialAuth(loginInfo: LoginInfo): Promise<LoginResponseOptions> {
    let token = '';
    const clientUrl = this.appConfigService.clientUrl;

    const auth = await this.authRepository.findOneBy({ accountId: loginInfo.id });
    if (auth === null || auth.status === AuthStatus.UNREGISTERD) {
      // unregistered users
      token = await this.signUp(auth, loginInfo);
      return { cookieKey: 'jwt-for-unregistered', token, redirectUrl: `${clientUrl}/auth/register` };
    }
    return await this.checkTwoFactorAuth(auth.id);
  }

  async localLogin(loginInfo: LocalLoginRequestDto): Promise<string> {
    const auth = await this.authRepository.findOneBy({ email: loginInfo.email });
    if (auth === null || auth.password === null) {
      throw new NotFoundException('이메일 또는 비밀번호를 확인해주세요.');
    }
    if ((await compare(loginInfo.password, auth.password)) === false) {
      throw new BadRequestException('비밀번호를 확인해주세요 .');
    }
    return (await this.checkTwoFactorAuth(auth.id)).token;
  }

  async localSignUp(signUpInfo: LocalSignUpRequestDto): Promise<void> {
    const email = signUpInfo.email;
    const nickname = signUpInfo.nickname;
    const password = await hash(signUpInfo.password, 5);
    const accountId = 'local-' + nanoid();

    if (await this.authRepository.findOneBy({ email })) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }
    if (await this.userRepository.findOneBy({ nickname })) {
      throw new ConflictException('중복된 닉네임입니다.');
    }
    // create auth
    const authId = await this.createAuth(email, password, accountId);

    // create user
    await this.userRepository.manager.transaction(async (manager: EntityManager) => {
      await manager.insert(User, { id: authId, nickname: nickname });
      await manager.insert(UserRecord, { id: authId });
      await manager.update(Auth, { id: authId }, { status: AuthStatus.REGISTERD });
    });
  }

  async twoFactorAuthSignIn(myId: number, code: string): Promise<string> {
    const value: TwoFactorAuth | undefined = await this.cacheManager.get(`${myId}`);
    if (value === undefined) {
      throw new ForbiddenException('유효하지 않은 인증 코드입니다.');
    }
    await this.verifyTwoFactorAuth(myId, code, value.code);
    return this.signIn(myId);
  }

  async getTwoFactorAuth(myId: number): Promise<TwoFactorAuthResponseDto> {
    const auth = await this.authRepository.findOne({ where: { id: myId }, select: ['twoFa'] });

    if (auth === null) {
      return { twoFa: null };
    }
    return { twoFa: auth.twoFa };
  }

  async sendAuthCode(myId: number, email: string): Promise<string> {
    const code = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');

    await this.mailerService.sendMail({
      to: email,
      subject: 'GhostPhong 인증번호입니다 ✔',
      html: this.getEmailTemplate(code),
    });
    await this.cacheManager.set(`${myId}`, { email, code }, TWO_FA_EXPIRES_IN);

    const payload = { userId: myId };
    const signOptions = {
      secret: this.jwtConfigService.twoFaSecretKey,
      expiresIn: TWO_FA_JWT_EXPIRES_IN,
    };
    return this.jwtService.sign(payload, signOptions);
  }

  async twoFactorAuth(myId: number, email: string): Promise<string> {
    const myTwoFa = await this.authRepository.findOne({ where: { id: myId }, select: ['twoFa'] });
    if (myTwoFa !== null) {
      throw new ConflictException('이미 인증이 완료된 유저입니다.');
    }
    if ((await this.authRepository.findOneBy({ twoFa: email })) !== null) {
      throw new ConflictException('이미 인증이 완료된 이메일입니다.');
    }
    return this.sendAuthCode(myId, email);
  }

  async updateTwoFactorAuth(myId: number, code: string): Promise<void> {
    const auth = await this.authRepository.findOne({ where: { id: myId }, select: ['twoFa'] });
    if (auth !== null) {
      throw new ConflictException('이미 2단계 인증이 완료된 유저입니다.');
    }
    const value: TwoFactorAuth | undefined = await this.cacheManager.get(`${myId}`);
    if (value === undefined) {
      throw new ForbiddenException('유효하지 않은 인증 코드입니다.');
    }
    if ((await this.authRepository.findOneBy({ twoFa: value.email })) !== null) {
      throw new ConflictException('이미 사용중인 이메일입니다.');
    }
    await this.verifyTwoFactorAuth(myId, code, value.code);
    await this.authRepository.update({ id: myId }, { twoFa: value.email });
  }

  async deleteTwoFactorAuth(myId: number): Promise<SuccessResponseDto> {
    const auth = await this.authRepository.findOne({ where: { id: myId }, select: ['twoFa'] });
    if (auth === null) {
      throw new ConflictException('2단계 인증 이메일이 없습니다.');
    }
    await this.authRepository.update({ id: myId }, { twoFa: null });
    return { message: '2단계 인증 이메일이 삭제되었습니다.' };
  }

  // SECTION private
  private async createAuth(email: string | null, password: string | null, accountId: string): Promise<number> {
    const authId = (
      await this.authRepository.insert({
        email,
        password,
        accountId,
      })
    ).identifiers[0].id;
    return authId;
  }

  private async verifyTwoFactorAuth(myId: number, code: string, successCode: string) {
    if (code !== successCode) {
      throw new BadRequestException('잘못된 인증 코드입니다.');
    }
    await this.cacheManager.del(`${myId}`);
  }

  // 2fa 인증 유저인지 확인 후 로그인
  private async checkTwoFactorAuth(userId: number): Promise<LoginResponseOptions> {
    const clientUrl = this.appConfigService.clientUrl;
    let token = '';

    const { twoFa } = await this.getTwoFactorAuth(userId);
    if (twoFa === null) {
      token = this.signIn(userId);
      return { token, redirectUrl: `${clientUrl}/auth?token=${token}` };
    } else {
      token = await this.sendAuthCode(userId, twoFa);
    }
    return { cookieKey: 'jwt-for-2fa', token, redirectUrl: `${clientUrl}/auth/2fa` };
  }

  private getEmailTemplate(code: string): string {
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
