import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiHeaders,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { TokenResponse } from '@/types/auth/response';

import { COOKIE_OPTIONS } from '../common/constant';
import { ExtractUserId } from '../common/decorator/extract-user-id.decorator';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { SuccessResponseDto } from '../common/dto/success-response.dto';
import { AppConfigService } from '../config/app/configuration.service';

import { AuthService } from './auth.service';
import { ExtractUser } from './decorator/extract-user.decorator';
import { SkipUserGuard } from './decorator/skip-user-guard.decorator';
import { CodeVerificationRequestDto } from './dto/request/code-verification-request.dto';
import { TwoFactorAuthRequestDto } from './dto/request/two-factor-auth-request.dto';
import { TwoFactorAuthResponseDto } from './dto/response/two-factor-auth-response.dto';
import { FtGuard } from './guard/ft.guard';
import { SkipLoggedInUserGuard } from './guard/skip-logged-in-user.guard';
import { TwoFaGuard } from './guard/two-fa.guard';
import { UserGuard } from './guard/user.guard';
import { LoginInfo } from './type/login-info';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly appConfigService: AppConfigService) {}

  /**
   * @summary 로그인
   * @description GET /auth/login
   */
  @ApiOperation({ summary: '42 로그인' })
  @SkipUserGuard()
  @UseGuards(SkipLoggedInUserGuard, FtGuard) // strategy.constructor
  @Get('42login')
  login(): void {
    return;
  }

  /**
   * @summary 로그인 callback
   * @description GET /auth/login/callback
   */
  @ApiOperation({ summary: '42 로그인 callback' })
  @SkipUserGuard()
  @UseGuards(FtGuard) // strategy.validate() -> return 값 기반으로 request 객체 담아줌
  @Get('42login/callback')
  async callbackLogin(@ExtractUser() user: LoginInfo, @Res() res: Response): Promise<void> {
    // 또는 @ReqUser('email') email: string console.log('42 Login Callback!');
    const clientUrl = this.appConfigService.clientUrl;

    if (user.id === null) {
      // UNREGSIETERED -> JOIN (sign up)
      const token = await this.authService.signUp(user);
      res.cookie('jwt-for-unregistered', token, COOKIE_OPTIONS).redirect(`${clientUrl}/auth/register`);
    } else {
      // REGISTERED -> LOGIN (sign in)
      const { twoFa } = await this.authService.getTwoFactorAuth(user.id);
      if (twoFa !== null) {
        const token = await this.authService.sendAuthCode(user.id, twoFa);
        res.cookie('jwt-for-2fa', token, COOKIE_OPTIONS).redirect(`${clientUrl}/auth/2fa`);
      } else {
        const token = await this.authService.signIn(user.id);
        res.redirect(`${clientUrl}/auth?token=${token}`);
      }
    }
  }

  /**
   * @summary 로그인 2단계 인증
   * @description POST /auth/42login/2fa
   */
  @ApiOperation({ summary: '42 로그인 2단계 인증' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @ApiForbiddenResponse({ type: ErrorResponseDto, description: '유효하지 않은 인증 코드' })
  @ApiBadRequestResponse({ type: ErrorResponseDto, description: '잘못된 인증 코드' })
  @SkipUserGuard()
  @UseGuards(TwoFaGuard)
  @HttpCode(HttpStatus.OK)
  @Post('42login/2fa')
  async twoFactorAuthLogin(
    @ExtractUserId() myId: number,
    @Body() { code }: CodeVerificationRequestDto,
  ): Promise<TokenResponse> {
    const token = await this.authService.twoFactorAuthSignIn(myId, code);
    return { token };
  }

  /**
   * @summary 2단계 인증 이메일 가져오기
   * @description GET /auth/2fa
   */
  @ApiOperation({ summary: '2단계 인증 이메일 가져오기' })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: '유저 없음' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @UseGuards(UserGuard)
  @Get('2fa')
  getTwoFactorAuth(@ExtractUserId() myId: number): Promise<TwoFactorAuthResponseDto> {
    return this.authService.getTwoFactorAuth(myId);
  }

  /**
   * @summary 2단계 인증 설정하기
   * @description POST /auth/2fa
   */
  @ApiOperation({ summary: '2단계 인증 설정하기' })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: '유저 없음' })
  @ApiConflictResponse({ type: ErrorResponseDto, description: '중복된 이메일 혹은 이미 인증 완료한 유저' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard)
  @Post('2fa')
  async twoFactorAuth(
    @ExtractUserId() myId: number,
    @Body() { email }: TwoFactorAuthRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const token = await this.authService.twoFactorAuth(myId, email);
    res.cookie('jwt-for-2fa', token, COOKIE_OPTIONS).json({ message: '2단계 인증 이메일이 전송되었습니다.' });
  }

  /**
   * @summary 2단계 인증 코드 검증하기
   * @description POST /auth/2fa/verify
   */
  @ApiOperation({ summary: '2단계 인증 코드 검증하기' })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: '유저 없음' })
  @ApiConflictResponse({ type: ErrorResponseDto, description: '중복된 이메일 혹은 이미 인증 완료한 유저' })
  @ApiForbiddenResponse({ type: ErrorResponseDto, description: '유효하지 않은 인증 코드' })
  @ApiBadRequestResponse({ type: ErrorResponseDto, description: '잘못된 2단계 인증 코드' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard, TwoFaGuard)
  @Post('2fa/verify')
  async updateTwoFactorAuth(
    @ExtractUserId() myId: number,
    @Body() { code }: CodeVerificationRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    await this.authService.updateTwoFactorAuth(myId, code);
    res.clearCookie('jwt-for-2fa').json({ message: '2단계 인증이 완료되었습니다.' });
  }

  /**
   * @summary 2단계 인증 삭제하기
   * @description DELETE /auth/2fa
   */
  @ApiOperation({ summary: '2단계 인증 삭제하기' })
  @ApiConflictResponse({ type: ErrorResponseDto, description: '2단계 인증하지 않은 유저' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @UseGuards(UserGuard)
  @Delete('2fa')
  deleteTwoFactorAuth(@ExtractUserId() myId: number): Promise<SuccessResponseDto> {
    return this.authService.deleteTwoFactorAuth(myId);
  }
}
