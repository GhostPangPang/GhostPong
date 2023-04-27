import { UserInfo } from "./user-info.type";

export interface UserHistoryResponse {
  histories: {
    id: number;
    winner: UserInfo;
    loser: UserInfo;
    winnerScore: number;
    loserScore: number;
    createdAt: Date;
  }[];
}
