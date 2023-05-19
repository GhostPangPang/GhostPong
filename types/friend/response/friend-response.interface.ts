import { UserInfo } from '../../user';
import { Status } from '../../user/socket';

export interface FriendResponse {
  friends: {
    id: number;
    lastMessageTime: Date | string | null;
    lastViewTime: Date | string | null;
    status: Status;
    user: UserInfo;
  }[];
}
