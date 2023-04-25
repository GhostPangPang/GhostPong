import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { ReqUser } from './decorator/auth.decorator';
import { LoginInfoDto } from './dto/login-info.dto';

// import { TokenDto } from '../common/dto/token.dto';

// interface RequestWithUser extends Request {
//   user: TokenDto;
// }

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

    if (user.isRegistered === false) {
      // UNREGSIETERED -> JOIN (sign up)
      console.log('UNREGISTERED -> JOIN (sign up)');
      const token = await this.authService.signUp(user);
      res
        .cookie('jwt-for-unregistered', token, {
          // httpOnly: true,
          secure: true,
          sameSite: 'none',
        })
        .redirect('http://localhost:3000/auth/register'); // FIXME : register page url
    } else {
      // REGISTERED -> LOGIN (sign in)
      console.log('REGISTERED -> LOGIN (sign in)');
      const token = await this.authService.signIn(user);
      res
        .cookie('jwt-for-registered', token, {
          // httpOnly: true,
          secure: true,
          sameSite: 'none',
        })
        .redirect('http://localhost:3000/auth'); // FIXME : Lobby page url
    }
  }

  // SECTION : TEST
  // 닉네임 설정하는 페이지로 redirect
  @UseGuards(AuthGuard('auth'))
  @Get('register')
  test2() {
    // test2(@ReqUser() request: Response) {
    console.log('Redirect : auth strategy(tmp jwt) guard success!');
    // console.log((request as any).user);
    return 'Redirect to NICKNAME SETTING page!';
  }

  // 최종적으로 redirect할 lobby page라고 가정
  @UseGuards(AuthGuard('user'))
  @Get()
  test() {
    // test(@ReqUser() request: Response) {
    console.log('Redirect : user strategy(jwt) guard success!');
    // console.log((request as any).user);
    return 'Redirect to LOBBY page!';
  }
}
