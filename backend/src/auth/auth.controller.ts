import { Body, Controller, Headers, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { NicknameRequestDto } from './dto/nickname-request.dto';
import { NicknameSuccessResponseDto } from './dto/nickname-success-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 닉네임 초기 설정
  @Post('nickname')
  updateNickname(
    @Headers('x-my-id') authId: number,
    @Body() { nickname }: NicknameRequestDto,
  ): Promise<NicknameSuccessResponseDto> {
    return this.authService.createNickname(authId, nickname);
  }

  /*
  @Post('2fa')
  updateTwoFactorAuthentication() {}

  @Get('login')
  login() {}
  */
}
