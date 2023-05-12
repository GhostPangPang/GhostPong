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

import { AUTH_COOKIE_EXPIREIN } from '../common/constant';
import { ExtractUserId } from '../common/decorator/extract-user-id.decorator';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { AppConfigService } from '../config/app/configuration.service';

import { AuthService } from './auth.service';
import { ExtractUser } from './decorator/extract-user.decorator';
import { SkipUserGuard } from './decorator/skip-user-guard.decorator';
import { CodeVerificationRequestDto } from './dto/request/code-verification-request.dto';
import { TwoFactorAuthRequestDto } from './dto/request/two-factor-auth-request.dto';
import { FtGuard } from './guard/ft.guard';
import { SkipLoggedInUserGuard } from './guard/skip-logged-in-user.guard';
import { UserGuard } from './guard/user.guard';
import { LoginInfo } from './type/login-info';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly appConfigService: AppConfigService) {}

  @ApiOperation({ summary: '42 로그인' })
  @UseGuards(SkipLoggedInUserGuard, FtGuard) // strategy.constructor
  @SkipUserGuard()
  @Get('42login')
  login() {
    return;
  }

  @ApiOperation({ summary: '42 로그인 callback' })
  @UseGuards(FtGuard) // strategy.validate() -> return 값 기반으로 request 객체 담아줌
  @SkipUserGuard()
  @Get('42login/callback')
  async callbackLogin(@ExtractUser() user: LoginInfo, @Res() res: Response) {
    // 또는 @ReqUser('email') email: string console.log('42 Login Callback!');
    const clientUrl = this.appConfigService.clientUrl;

    if (user.id === null) {
      // UNREGSIETERED -> JOIN (sign up)
      const token = await this.authService.signUp(user);
      res
        .cookie('jwt-for-unregistered', token, {
          maxAge: AUTH_COOKIE_EXPIREIN,
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
        })
        .redirect(`${clientUrl}/auth/register`);
    } else {
      // REGISTERED -> LOGIN (sign in)
      const token = await this.authService.signIn(user.id);
      res.redirect(`${clientUrl}/auth?token=${token}`);
    }
  }

  /**
   * @description 2단계 인증 설정하기
   */
  @ApiOperation({ summary: '2단계 인증 설정하기' })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: '유저 없음' })
  @ApiConflictResponse({ type: ErrorResponseDto, description: '중복된 이메일 혹은 이미 인증 완료한 유저' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard)
  @Post('2fa')
  twoFactorAuth(@ExtractUserId() myId: number, @Body() { email }: TwoFactorAuthRequestDto) {
    return this.authService.twoFactorAuth(myId, email);
  }

  /**
   * @description 2단계 인증 코드 검증하기
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
  verifyTwoFactorAuth(@ExtractUserId() myId: number, @Body() { code }: CodeVerificationRequestDto) {
    return this.authService.verifyTwoFactorAuth(myId, code);
  }

  @ApiOperation({ summary: '2단계 인증 삭제하기' })
  @ApiConflictResponse({ type: ErrorResponseDto, description: '2단계 인증하지 않은 유저' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @UseGuards(UserGuard)
  @Delete('2fa')
  deleteTwoFactorAuth(@ExtractUserId() myId: number) {
    return this.authService.deleteTwoFactorAuth(myId);
  }
}
