import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
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

import { ExtractUserId } from '../common/decorator/extract-user-id.decorator';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { SuccessResponseDto } from '../common/dto/success-response.dto';
import { CheckUserIdPipe } from '../common/pipe/check-user-id.pipe';
import { NicknameToIdPipe } from '../common/pipe/nickname-to-id.pipe';
import { NonNegativeIntPipe } from '../common/pipe/non-negative-int.pipe';

import { FriendsResponseDto } from './dto/response/friend-response.dto';
import { RequestedFriendsResponseDto } from './dto/response/requested-friend-response.dto';
import { FriendService } from './friend.service';

@ApiTags('friend')
@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @ApiOperation({ summary: '친구 리스트 가져오기' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @Get()
  getFriendsList(@ExtractUserId() myId: number): Promise<FriendsResponseDto> {
    return this.friendService.getFriendsList(myId);
  }

  @ApiOperation({ summary: '친구 신청하기 (닉네임)' })
  @ApiForbiddenResponse({ type: ErrorResponseDto, description: '친구 신청 정원 초과, 친구 정원 초과' })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: '존재하지 않는 유저' })
  @ApiConflictResponse({ type: ErrorResponseDto, description: '이미 친구 상태, 이미 친구 신청 상태' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @ApiQuery({ type: String, name: 'nickname', description: '친구 신청할 유저의 닉네임' })
  @HttpCode(HttpStatus.OK)
  @Post()
  requestFriendByNickname(
    @Query('nickname', NicknameToIdPipe) userId: number,
    @ExtractUserId() myId: number,
  ): Promise<SuccessResponseDto> {
    return this.friendService.requestFriend(myId, userId);
  }

  @ApiOperation({ summary: '친구 신청받은 리스트 가져오기' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @Get('request')
  getFriendRequestsList(@ExtractUserId() myId: number): Promise<RequestedFriendsResponseDto> {
    return this.friendService.getFriendRequestsList(myId);
  }

  @ApiOperation({ summary: '친구 신청하기 (id)' })
  @ApiForbiddenResponse({ type: ErrorResponseDto, description: '차단 관계, 친구 신청 정원 초과, 친구 정원 초과' })
  @ApiConflictResponse({ type: ErrorResponseDto, description: '이미 친구 상태, 이미 친구 신청 상태' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @ApiParam({ name: 'userId', description: '친구 신청할 유저의 아이디' })
  @HttpCode(HttpStatus.OK)
  @Post(':userId')
  requestFriendById(
    @ExtractUserId() myId: number,
    @Param('userId', NonNegativeIntPipe, CheckUserIdPipe) userId: number,
  ): Promise<SuccessResponseDto> {
    return this.friendService.requestFriend(myId, userId);
  }

  @ApiOperation({ summary: '친구 삭제하기' })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: '존재하지 않는 친구 관계' })
  @Delete(':friendId')
  deleteFriend(
    @ExtractUserId() myId: number,
    @Param('friendId', NonNegativeIntPipe) friendId: number,
  ): Promise<SuccessResponseDto> {
    return this.friendService.deleteFriend(friendId, myId);
  }

  @ApiOperation({ summary: '친구 신청 수락하기' })
  @ApiForbiddenResponse({ type: ErrorResponseDto, description: '친구 정원 초과' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @ApiParam({ name: 'friendId', description: '수락할 친구 신청의 아이디' })
  @HttpCode(HttpStatus.OK)
  @Post('accept/:friendId')
  acceptFriendRequest(
    @ExtractUserId() myId: number,
    @Param('friendId', NonNegativeIntPipe) friendId: number,
  ): Promise<SuccessResponseDto> {
    return this.friendService.acceptFriendRequest(friendId, myId);
  }

  @ApiOperation({ summary: '친구 신청 거절하기' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @ApiParam({ name: 'friendId', description: '거절할 친구 신청의 아이디' })
  @HttpCode(HttpStatus.OK)
  @Post('reject/:friendId')
  rejectFriendRequest(
    @ExtractUserId() myId: number,
    @Param('friendId', NonNegativeIntPipe) friendId: number,
  ): Promise<SuccessResponseDto> {
    return this.friendService.rejectFriendRequest(friendId, myId);
  }
}
