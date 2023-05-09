import { UserInfo } from '../../user/user-info.interface';

type UserStatus = 'online' | 'offline' | 'game';

export interface FriendResponse {
  friends: {
    id: number;
    lastMessageTime: Date | string | null;
    lastViewTime: Date | string | null;
    status: UserStatus;
    user: UserInfo;
  }[];
}
