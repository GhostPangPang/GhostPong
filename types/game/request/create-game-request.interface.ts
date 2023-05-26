export type GameMode = 'normal' | 'speed' | 'stupid';

export interface CreateGameRequest {
  gameId: string;
  mode: GameMode;
}
