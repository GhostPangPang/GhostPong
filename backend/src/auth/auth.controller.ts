import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeaders, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AppConfigService } from '../config/app/configuration.service';

import { AuthService } from './auth.service';
import { ReqUser } from './decorator/auth.decorator';
import { LoginInfoDto } from './dto/login-info.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly appConfigService: AppConfigService) {}

  /*
  @Post('2fa')
  updateTwoFactorAuthentication() {}
  */

  @ApiOperation({ summary: '42 로그인' })
  @UseGuards(AuthGuard('42')) // strategy.constructor
  @Get('42login')
  login() {
    console.log('42Login!');
  }

  @ApiOperation({ summary: '42 로그인 callback' })
  @UseGuards(AuthGuard('42')) // strategy.validate() -> return 값 기반으로 request 객체 담아줌
  @Get('42login/callback')
  async callbackLogin(@ReqUser() user: LoginInfoDto, @Res() res: Response) {
    // 또는 @ReqUser('email') email: string
    console.log('42 Login Callback!');
    const clinetPort = this.appConfigService.clientPort;

    if (user.id === null) {
      // UNREGSIETERED -> JOIN (sign up)
      console.log('UNREGISTERED -> JOIN (sign up)');
      const token = await this.authService.signUp(user);
      res
        .cookie('jwt-for-unregistered', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        })
        .redirect(`http://localhost:${clinetPort}/auth/register`);
    } else {
      // REGISTERED -> LOGIN (sign in)
      console.log('REGISTERED -> LOGIN (sign in)');
      const token = await this.authService.signIn(user.id);
      res.redirect(`http://localhost:${clinetPort}/auth?token=${token}`);
    }
  }

  // FIXME : delete it (tmp for test)
  // 닉네임 설정하는 페이지로 redirect
  @UseGuards(AuthGuard('auth'))
  @Get('register')
  test2() {
    console.log('Redirect : auth strategy(tmp jwt) guard success!');
    return 'Redirect to NICKNAME SETTING page!';
  }

  // FIXME : delete it (tmp for test)
  // 최종적으로 redirect할 lobby page라고 가정
  @UseGuards(AuthGuard('user'))
  @Get()
  test() {
    // test(@Query('token') token: string) {
    console.log('Redirect : user strategy(jwt) guard success!');
    // console.log(token);
    return 'Redirect to LOBBY page!';
  }

  // FIXME test
  @ApiOperation({ summary: 'token test' })
  @ApiHeaders([{ name: 'Authorization', description: 'jwt token' }])
  @UseGuards(AuthGuard('user'))
  @Get('test')
  tokenTest() {
    console.log('success token test');
  }
}
