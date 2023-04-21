import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ReqUser } from './auth.decorator';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';

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
  callbackLogin(@ReqUser() user: LoginRequestDto) {
    // 또는 @ReqUser('email') email: string
    console.log('42 Login Callback!');

    console.log('user : ', user);
    console.log('email');
    console.log(user.email);

    return '42 Login Callback!';
  }
}
