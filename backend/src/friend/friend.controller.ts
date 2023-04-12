import { Controller, Headers, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
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
import { SuccessResponseDto } from '../common/dto/sucess-response.dto';

import { FriendService } from './friend.service';

@ApiTags('friend')
@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  //@Get()
  //getFriends() {}

  @ApiOperation({ summary: '친구 신청하기 (닉네임)' })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: '신청 정원 초과, 이미 친구 상태, 이미 친구 신청 상태, 자기 자신에게 신청',
  })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: '유저 없음' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @ApiQuery({ name: 'nickname', description: '친구 신청할 유저의 닉네임' })
  @HttpCode(HttpStatus.OK)
  @Post()
  requestFriendByNickname(
    @Query('nickname') nickname: string,
    @Headers('x-my-id') myId: number,
  ): Promise<SuccessResponseDto> {
    return this.friendService.requestFriendByNickname(myId, nickname);
  }

  @ApiOperation({ summary: '친구 신청하기 (id)' })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: '신청 정원 초과, 이미 친구 상태, 이미 친구 신청 상태, 자기 자신에게 신청',
  })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: '유저 없음' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @ApiParam({ name: 'userId', description: '친구 신청할 유저의 아이디' })
  @HttpCode(HttpStatus.OK)
  @Post('/:userId')
  requestFriendById(@Param('userId') userId: number, @Headers('x-my-id') myId: number): Promise<SuccessResponseDto> {
    return this.friendService.requestFriendById(myId, userId);
  }

  /*  @Delete('/:userId')
  deleteFriend() {}

  @Get('/request')
  getFriendRequestList() {}

  @Post('/accept/:userId')
  acceptFriend() {}

  @Post('/deny/:userId')
  denyFriend() {}*/
}
