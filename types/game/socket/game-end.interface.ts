export interface GameEnd {
  id: string;
  winner: {
    id: number;
    score: number;
  };
  loser: {
    id: number;
    score: number;
  };
}
