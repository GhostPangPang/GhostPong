import { UserInfo } from '../user-info.interface';

export interface UserHistoryResponse {
  histories: {
    id: number;
    winner: UserInfo;
    loser: UserInfo;
    winnerScore: number;
    loserScore: number;
    createdAt: Date | string;
  }[];
}
