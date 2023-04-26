class History {
  /**
   * 게임 기록 id
   * @example 1
   */
  id: number;

  /**
   * 게임에서 이긴 유저의 정보
   */
  winner: {
    id: number;
    nickname: string;
    image: string;
    exp: number;
  };

  /**
   * 게임에서 진 유저의 정보
   */
  loser: {
    id: number;
    nickname: string;
    image: string;
    exp: number;
  };

  /**
   * 게임에서 이긴 유저의 점수
   * @example 10
   */
  winnerScore: number;

  /**
   * 게임에서 진 유저의 점수
   * @example 5
   */
  loserScore: number;

  /**
   * 게임 생성 시간
   * @example '2021-01-01T00:00:00.000Z'
   */
  createdAt: Date;
}

export class UserHistoryResponseDto {
  /**
   * 유저의 게임 기록 리스트 (10개)
   */
  histories: History[];
}
