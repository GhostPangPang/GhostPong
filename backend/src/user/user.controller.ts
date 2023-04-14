import { Controller, Get, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiHeaders, ApiNotFoundResponse, ApiOperation } from '@nestjs/swagger';

import { ErrorResponseDto } from '../common/dto/error-response.dto';

import { MetaInfoResponseDto } from './dto/meta-info-response.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '유저 메타 정보 가져오기' })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: '유저 없음' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @HttpCode(HttpStatus.OK)
  @Get()
  requestMetaInfo(@Headers('x-my-id') myId: number): Promise<MetaInfoResponseDto> {
    return this.userService.requestMetaInfo(myId);
  }
}