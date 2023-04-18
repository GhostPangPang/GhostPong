import { Controller, Headers, Param, Post, Query } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiHeaders,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { SuccessResponseDto } from '../common/dto/success-response.dto';

import { BlockedService } from './blocked.service';

@ApiTags('blocked')
@Controller('blocked')
export class BlockedController {
  constructor(private readonly blockedService: BlockedService) {}

  @ApiOperation({ summary: 'id로 유저 차단하기(토글->마우스 이용)' })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: '유저 없음' })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: '차단 목록 정원 다참, 이미 차단함 유저, 스스로를 차단할 수 없음',
  })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @ApiParam({ name: 'userId', description: '차단할 사람 아이디' })
  @Post(':userId')
  blockUserById(@Headers('x-my-id') myId: number, @Param('userId') userId: number): Promise<SuccessResponseDto> {
    return this.blockedService.blockUserById(+myId, +userId);
  }

  @ApiOperation({ summary: 'nickname으로 유저 차단하기(직접 입력)' })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: '유저 없음' })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: '차단 목록 정원 다참, 이미 차단함 유저, 스스로를 차단할 수 없음',
  })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @ApiQuery({ name: 'nickname', description: '차단할 유저 닉네임' })
  @Post()
  blockUserByNickname(
    @Headers('x-my-id') myId: number,
    @Query('nickname') nickname: string,
  ): Promise<SuccessResponseDto> {
    return this.blockedService.blockUserByNickname(+myId, nickname);
  }
}
