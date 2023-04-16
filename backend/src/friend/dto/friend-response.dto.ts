import { User } from '../../entity/user.entity';

class FriendInformation extends User {
  lastMessegeTime: Date | null;
  lastViewTime: Date | null;
}

export class FriendsResponseDto {
  /**
   * 친구의 정보 배열
   */
  friends: FriendInformation[];
}
