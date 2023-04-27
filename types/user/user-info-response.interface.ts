import { UserInfo } from "./user-info.type";

export interface UserInfoResponse extends UserInfo {
  blockedUsers: number[];
}
