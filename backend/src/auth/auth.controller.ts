import { Body, Controller, Headers, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiConflictResponse, ApiHeaders, ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ErrorResponseDto } from '../common/dto/error-response.dto';

import { AuthService } from './auth.service';
import { NicknameRequestDto } from './dto/nickname-request.dto';
import { NicknameSuccessResponseDto } from './dto/nickname-success-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // TODO refactor: Move to user (@san)
  // 닉네임 초기 설정
  @ApiOperation({ summary: '닉네임 초기 설정' })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: '중복된 nickname',
  })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: '' })
  @ApiHeaders([{ name: 'x-auth-id', description: '내 auth 아이디 (임시값)' }])
  @HttpCode(HttpStatus.OK)
  @Post('nickname')
  createUser(
    @Headers('x-auth-id') authId: number,
    @Body() { nickname }: NicknameRequestDto,
  ): Promise<NicknameSuccessResponseDto> {
    return this.authService.createUser(authId, nickname);
  }

  /*
  @Post('2fa')
  updateTwoFactorAuthentication() {}

  @Get('login')
  login() {}
  */
}
