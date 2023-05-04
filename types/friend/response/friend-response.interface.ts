import { UserInfo } from '../../user/user-info.interface';

export interface FriendResponse {
  friends: {
    id: number;
    lastMessageTime: Date | string | null;
    lastViewTime: Date | string | null;
    user: UserInfo;
  }[];
}
