import { User } from '../../entity/user.entity';

export class RequestedFriendResponseDto {
  /**
   * 친구 신청한 유저의 정보 배열
   */
  requests: User[];
}
