class History {
  id: number;
  winner: {
    id: number;
    nickname: string;
    image: string;
    exp: number;
  };
  loser: {
    id: number;
    nickname: string;
    image: string;
    exp: number;
  };
  winnerScore: number;
  loserScore: number;
  createdAt: Date;
}

export class UserHistoryResponseDto {
  /**
   * 유저의 게임 기록 리스트 (10개)
   */
  histories: History[];
}
