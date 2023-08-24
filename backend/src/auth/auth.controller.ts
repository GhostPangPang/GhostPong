import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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

import { COOKIE_OPTIONS } from '../common/constant';
import { ExtractUserId } from '../common/decorator/extract-user-id.decorator';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { SuccessResponseDto } from '../common/dto/success-response.dto';

import { AuthService } from './auth.service';
import { ExtractUser } from './decorator/extract-user.decorator';
import { SkipUserGuard } from './decorator/skip-user-guard.decorator';
import { CodeVerificationRequestDto } from './dto/request/code-verification-request.dto';
import { LocalLoginRequestDto } from './dto/request/local-login-request.dto';
import { LocalSignUpRequestDto } from './dto/request/local-signup-request.dto';
import { TwoFactorAuthRequestDto } from './dto/request/two-factor-auth-request.dto';
import { TwoFactorAuthResponseDto } from './dto/response/two-factor-auth-response.dto';
import { SocialGuard } from './guard/social.guard';
import { TwoFaGuard } from './guard/two-fa.guard';
import { LoginInfo } from './type/login-info';
import { LoginResponseOptions } from './type/login-response-options';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @summary 로그인
   * @description GET /auth/login/ft, GET /auth/login/google, GET /auth/login/github
   */
  @ApiOperation({ summary: 'oauth 로그인' })
  @SkipUserGuard()
  @UseGuards(SocialGuard)
  @Get('login/:provider')
  socialLogin(): void {
    return;
  }

  /**
   * @summary 로그인 callback
   * @description GET /auth/callback/ft, GET /auth/callback/google, GET /auth/callback/github
   */
  @ApiOperation({ summary: 'oauth 로그인 callback' })
  @SkipUserGuard()
  @UseGuards(SocialGuard) // strategy.validate() -> return 값 기반으로 request 객체 담아줌
  @Get('callback/:provider')
  async callbackSocialLogin(@ExtractUser() user: LoginInfo, @Res() res: Response): Promise<void> {
    const responseOptions: LoginResponseOptions = await this.authService.socialAuth(user);
    if (responseOptions.cookieKey !== undefined) {
      res.cookie(responseOptions.cookieKey, responseOptions.token, COOKIE_OPTIONS);
    }
    res.redirect(responseOptions.redirectUrl);
  }

  /**
   * @summary Local 로그인
   * @description POST /auth/login/local
   */
  @ApiOperation({ summary: 'local 로그인' })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: '이메일 없음' })
  @ApiBadRequestResponse({ type: ErrorResponseDto, description: '잘못된 비밀번호' })
  @SkipUserGuard()
  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post('login/local')
  async localLogin(@ExtractUser() user: LocalLoginRequestDto, @Res() res: Response): Promise<void> {
    const token = await this.authService.localLogin(user);
    res.send({ token });
  }

  /**
   * @summary Local 회원가입
   * @description POST /auth/signup/local
   */
  @ApiOperation({ summary: 'local 회원가입' })
  @SkipUserGuard()
  @Post('signup/local')
  async localSignUp(@Body() signUpInfo: LocalSignUpRequestDto): Promise<SuccessResponseDto> {
    await this.authService.localSignUp(signUpInfo);
    return {
      message: '회원가입이 완료되었습니다.',
    };
  }

  /**
   * @summary 로그인 2단계 인증
   * @description POST /auth/login/2fa
   *
   * 로그인 시 2fa 설정 되어있는 경우 맞는 인증 코드인지 확인한다.
   */
  @ApiOperation({ summary: '로그인 2단계 인증' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @ApiForbiddenResponse({ type: ErrorResponseDto, description: '유효하지 않은 인증 코드' })
  @ApiBadRequestResponse({ type: ErrorResponseDto, description: '잘못된 인증 코드' })
  @SkipUserGuard()
  @UseGuards(TwoFaGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login/2fa')
  async twoFactorAuthLogin(
    @ExtractUserId() myId: number,
    @Body() { code }: CodeVerificationRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const token = await this.authService.twoFactorAuthSignIn(myId, code);
    res.clearCookie('jwt-for-2fa').send({ token });
  }

  /**
   * @summary 2단계 인증 이메일 가져오기
   * @description GET /auth/2fa
   */
  @ApiOperation({ summary: '2단계 인증 이메일 가져오기' })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: '유저 없음' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
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
  @Delete('2fa')
  deleteTwoFactorAuth(@ExtractUserId() myId: number): Promise<SuccessResponseDto> {
    return this.authService.deleteTwoFactorAuth(myId);
  }
}
