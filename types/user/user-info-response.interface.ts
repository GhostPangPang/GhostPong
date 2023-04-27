import { UserInfo } from "./user-info.interface";

export interface UserInfoResponse extends UserInfo {
  blockedUsers: number[];
}
