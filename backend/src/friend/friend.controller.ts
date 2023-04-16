import { Controller, Get, Headers, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
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

import { RequestedFriendResponseDto } from './dto/requested-friend-response.dto';
import { FriendService } from './friend.service';

@ApiTags('friend')
@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  //@Get()
  //getFriends() {}

  // TODO : validtaion pipe 추가..
  @ApiOperation({ summary: '친구 신청하기 (닉네임)' })
  @ApiForbiddenResponse({ type: ErrorResponseDto, description: '친구 신청 정원 초과, 친구 정원 초과' })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: '유저 없음' })
  @ApiConflictResponse({ type: ErrorResponseDto, description: '이미 친구 상태, 이미 친구 신청 상태' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @ApiQuery({ name: 'nickname', description: '친구 신청할 유저의 닉네임' })
  @HttpCode(HttpStatus.OK)
  @Post()
  requestFriendByNickname(
    @Query('nickname') nickname: string,
    @Headers('x-my-id') myId: number,
  ): Promise<SuccessResponseDto> {
    return this.friendService.requestFriendByNickname(+myId, nickname);
  }

  @ApiOperation({ summary: '친구 신청받은 리스트 가져오기' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @Get('request')
  getFriendRequestList(@Headers('x-my-id') myId: number): Promise<RequestedFriendResponseDto> {
    return this.friendService.getFriendRequestList(+myId);
  }

  @ApiOperation({ summary: '친구 신청하기 (id)' })
  @ApiForbiddenResponse({ type: ErrorResponseDto, description: '친구 신청 정원 초과, 친구 정원 초과' })
  @ApiConflictResponse({ type: ErrorResponseDto, description: '이미 친구 상태, 이미 친구 신청 상태' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @ApiParam({ name: 'userId', description: '친구 신청할 유저의 아이디' })
  @HttpCode(HttpStatus.OK)
  @Post(':userId')
  requestFriendById(@Param('userId') userId: number, @Headers('x-my-id') myId: number): Promise<SuccessResponseDto> {
    return this.friendService.requestFriendById(+myId, userId);
  }

  @ApiOperation({ summary: '친구 신청 수락하기' })
  @ApiForbiddenResponse({ type: ErrorResponseDto, description: '친구 정원 초과' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @ApiParam({ name: 'userId', description: '친구 신청 수락할 유저의 아이디' })
  @HttpCode(HttpStatus.OK)
  @Post('accept/:userId')
  acceptFriendRequest(@Param('userId') userId: number, @Headers('x-my-id') myId: number): Promise<SuccessResponseDto> {
    return this.friendService.acceptFriendRequest(userId, +myId);
  }

  @ApiOperation({ summary: '친구 신청 거절하기' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @HttpCode(HttpStatus.OK)
  @Post('reject/:userId')
  rejectFriendRequest(@Param('userId') userId: number, @Headers('x-my-id') myId: number): Promise<SuccessResponseDto> {
    // FIXME: myId 임시 헤더라서 + 갈겼습니다...
    return this.friendService.rejectFriendRequest(userId, +myId);
  }

  /*
  @Delete(':userId')
  deleteFriend() {}
  */
}
