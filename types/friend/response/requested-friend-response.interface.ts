import { UserInfo } from '../../user/user-info.interface';

export interface RequestedFriendsResponse {
  requests: {
    id: number;
    sender: UserInfo;
  }[];
}
