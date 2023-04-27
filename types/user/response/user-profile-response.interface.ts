import { UserInfo } from "../user-info.interface";

export interface UserProfileResponse extends UserInfo {
  nickname: string;
  image: string;
  exp: number;
  winCount: number;
  loseCount: number;
  achievements: number[];
}
