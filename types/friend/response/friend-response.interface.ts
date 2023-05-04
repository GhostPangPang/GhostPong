import { UserInfo } from '../../user/user-info.interface';

export interface FriendResponse {
  friends: {
    id: number;
    lastMessegeTime: Date | string | null;
    lastViewTime: Date | string | null;
    user: UserInfo;
  }[];
}
