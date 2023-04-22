import { Controller, Delete, Get, Headers, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiForbiddenResponse,
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
import { BlockedUserResponseDto } from './dto/blocked-user-response.dto';

@ApiTags('blocked')
@Controller('blocked')
export class BlockedController {
  constructor(private readonly blockedService: BlockedService) {}

  @ApiOperation({ summary: 'id로 유저 차단하기(토글->마우스 이용)' })
  @ApiForbiddenResponse({ type: ErrorResponseDto, description: '차단 목록 정원 다참' })
  @ApiConflictResponse({ type: ErrorResponseDto, description: '이미 차단함 유저' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @ApiParam({ name: 'userId', description: '차단할 사람 아이디' })
  @HttpCode(HttpStatus.OK)
  @Post(':userId')
  blockUserById(@Headers('x-my-id') myId: number, @Param('userId') userId: number): Promise<SuccessResponseDto> {
    return this.blockedService.blockUserById(+myId, +userId);
  }

  @ApiOperation({ summary: 'nickname으로 유저 차단하기(직접 입력)' })
  @ApiForbiddenResponse({ type: ErrorResponseDto, description: '차단 목록 정원 다참' })
  @ApiConflictResponse({ type: ErrorResponseDto, description: '이미 차단한 유저' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @ApiQuery({ name: 'nickname', description: '차단할 유저 닉네임' })
  @HttpCode(HttpStatus.OK)
  @Post()
  blockUserByNickname(
    @Headers('x-my-id') myId: number,
    @Query('nickname') nickname: string,
  ): Promise<SuccessResponseDto> {
    return this.blockedService.blockUserByNickname(+myId, nickname);
  }

  @ApiOperation({ summary: '유저 차단 해제' })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: '차단한 기록이 없는 유저, 존재하지 않는 유저' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @ApiParam({ name: 'userId', description: '차단 해제할 사람 아이디' })
  @Delete(':userId')
  deleteBlockedUser(@Headers('x-my-id') myId: number, @Param('userId') userId: number): Promise<SuccessResponseDto> {
    return this.blockedService.deleteBlockedUser(+myId, userId);
  }

  @ApiOperation({ summary: '차단한 유저 목록(정보 포함) 가져오기' })
  @Get()
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  getBlockedUserList(@Headers('x-my-id') myId: number): Promise<BlockedUserResponseDto> {
    return this.blockedService.getBlockedUserList(+myId);
  }
}
