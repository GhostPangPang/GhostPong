import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { ApiHeaders, ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AUTH_COOKIE_EXPIREIN } from '../common/constant';
import { ExtractUserId } from '../common/decorator/extract-user-id.decorator';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { AppConfigService } from '../config/app/configuration.service';

import { AuthService } from './auth.service';
import { ExtractUser } from './decorator/extract-user.decorator';
import { SkipUserGuard } from './decorator/skip-user-guard.decorator';
import { LoginInfoDto } from './dto/login-info.dto';
import { FtGuard } from './guard/ft.guard';
import { GuestGuard } from './guard/guest.guard';
import { SkipLoggedInUserGuard } from './guard/skip-logged-in-user.guard';
import { UserGuard } from './guard/user.guard';

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
  async callbackLogin(@ExtractUser() user: LoginInfoDto, @Res() res: Response) {
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
   * @description 2차 인증 설정하기
   */
  @ApiOperation({ summary: '2차 인증 설정하기' })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: '유저 없음' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard)
  @Post('2fa')
  setUp2FA(@ExtractUserId() myId: number, @Body('2fa') secondaryEmail: string) {
    return this.authService.setUp2FA(myId, secondaryEmail);
  }

  /**
   * @description 2차 인증 코드 검증하기
      @ApiOperation({ summary: '2차 인증 코드 검증하기' })
      @ApiNotFoundResponse({ type: ErrorResponseDto, description: '유저 없음' })
      @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
      @HttpCode(HttpStatus.OK)
      @UseGuards(UserGuard)
      @Post('2fa/verify')
      verify2FA(@ExtractUserId() myId: number) {
        return this.authService.verify2FA(myId);
      }
   */

  // FIXME : delete it (tmp for test)
  // 닉네임 설정하는 페이지로 redirect
  @SkipUserGuard()
  @UseGuards(GuestGuard)
  @Get('register')
  test2() {
    console.log('Redirect : Guest Guard success!');
    return 'Redirect to NICKNAME SETTING page!';
  }

  // FIXME : delete it (tmp for test)
  // 최종적으로 redirect할 lobby page라고 가정
  // @UseGuards(UserGuard)
  @Get()
  test() {
    // test(@Query('token') token: string) {
    console.log('Redirect : User Guard success!');
    // console.log(token);
    return 'Redirect to LOBBY page!';
  }

  // FIXME test
  @ApiOperation({ summary: 'token test' })
  @ApiHeaders([{ name: 'Authorization', description: 'jwt token' }])
  // @UseGuards(UserGuard)
  @SkipUserGuard()
  @Get('test')
  tokenTest() {
    console.log('====================');
  }
}
