import { UserInfo } from "../../user/user-info.interface";

export interface FriendResponse {
  friends: {
    id: number;
    lastMessegeTime: Date | null;
    lastViewTime: Date | null;
    user: UserInfo;
  }[];
}
