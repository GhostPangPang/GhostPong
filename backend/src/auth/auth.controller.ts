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

import { COOKIE_OPTIONS } from '../common/constant';
import { ExtractUserId } from '../common/decorator/extract-user-id.decorator';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { SuccessResponseDto } from '../common/dto/success-response.dto';

import { AuthService } from './auth.service';
import { ExtractUser } from './decorator/extract-user.decorator';
import { SkipUserGuard } from './decorator/skip-user-guard.decorator';
import { CodeVerificationRequestDto } from './dto/request/code-verification-request.dto';
import { TwoFactorAuthRequestDto } from './dto/request/two-factor-auth-request.dto';
import { TwoFactorAuthResponseDto } from './dto/response/two-factor-auth-response.dto';
import { FtGuard } from './guard/ft.guard';
import { GoogleGuard } from './guard/google.guard';
import { TwoFaGuard } from './guard/two-fa.guard';
import { UserGuard } from './guard/user.guard';
import { LoginInfo } from './type/login-info';
import { SocialResponseOptions } from './type/social-response-options';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @summary 로그인
   * @description GET /auth/login
   */
  @ApiOperation({ summary: '42 로그인' })
  @SkipUserGuard()
  @UseGuards(FtGuard)
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
    const responseOptions: SocialResponseOptions = await this.authService.socialAuth(user);

    if (responseOptions.cookieKey !== undefined) {
      res.cookie(responseOptions.cookieKey, responseOptions.token, COOKIE_OPTIONS);
    }
    res.redirect(responseOptions.redirectUrl);
  }

  @SkipUserGuard()
  @UseGuards(GoogleGuard)
  @Get('google')
  async googleLogin(): Promise<void> {
    return;
  }

  @SkipUserGuard()
  @UseGuards(GoogleGuard)
  @Get('google/callback')
  async googleCallbackLogin(@ExtractUser() user: LoginInfo, @Res() res: Response): Promise<void> {
    return this.callbackLogin(user, res);
  }

  /**
   * @summary 로그인 2단계 인증
   * @description POST /auth/login/2fa
   *
   * 로그인 시 2fa 설정 되어있는 경우 맞는 인증 코드인지 확인한다.
   * //NOTE: /42login/2fa -> login/2fa 으로 변경
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
  @UseGuards(UserGuard)
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
