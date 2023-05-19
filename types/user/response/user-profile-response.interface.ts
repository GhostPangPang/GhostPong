import { UserInfo } from '../user-info.interface';

export interface UserProfileResponse extends UserInfo {
  winCount: number;
  loseCount: number;
  achievements: number[];
}
