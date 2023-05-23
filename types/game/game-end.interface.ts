export class GameEnd {
  id: string;
  winner: {
    id: number;
    nickname: string;
    score: number;
  };
  loser: {
    id: number;
    nickname: string;
    score: number;
  };
}
