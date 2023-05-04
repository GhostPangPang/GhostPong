import { FriendResponse } from '@/types/friend/response';

import { UserInfoDto } from '../../../user/dto/user-info.dto';

class FriendInformation {
  /**
   * 친구 관계 아이디 (나와 상대방의 friendship id)
   * @example 1
   */
  id: number;

  /**
   * 마지막으로 메세지를 주고 받은 시간
   * @example '2021-08-01T00:00:00.000Z'
   */
  lastMessageTime: Date | string | null;

  /**
   * 마지막으로 메세지를 읽은 시간 (나)
   * @example '2021-08-01T00:00:00.000Z'
   */
  lastViewTime: Date | string | null;

  /**
   * 친구의 유저 정보
   */
  user: UserInfoDto;
}

export class FriendsResponseDto implements FriendResponse {
  /**
   * 친구의 정보 배열
   */
  friends: FriendInformation[];
}
