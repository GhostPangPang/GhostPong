import { Controller, Param, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

import { FriendService } from './friend.service';

@ApiTags('friend')
@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  //@Get()
  //getFriends() {}

  /**
   * 친구 신청하기 (닉네임)
   * @example { "nickname": "test" }

   * @param nickname
   * @returns
   */
  @ApiOkResponse({ description: '친구 신청을 보냈습니다.' })
  @ApiQuery({ name: 'nickname', description: '친구 신청할 유저의 닉네임' })
  @Post()
  requestFriendByNickname(
    @Query('nickname')
    nickname: string,
  ) {
    const myId = 1;

    return this.friendService.requestFriendByNickname(myId, nickname);
  }

  @ApiOkResponse({ description: '친구 신청을 보냈습니다.' })
  @Post('/:userId')
  requestFriend(@Param('userId') userId: number) {
    // me to me 하면 어쩌지?
    const myId = 1;

    return this.friendService.requestFriend(myId, userId);
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

/**
 * 친구 신청 거절	POST	/friend/deny/{user_id}
 * 친구 신청 수락	POST	/friend/accept/{user_id}
 * 친구 끊기	DELETE	/friend/{user_id}
 * 친구 신청하기 (id)	POST	/friend/{user_id}
 * 친구 신청하기 (닉네임)	POST	/friend?nickname=””
 * 친구 신청받은 리스트 가져오기	GET	/friend/request
 * 친구 정보 리스트 가져오기	GET	/friend
 */
