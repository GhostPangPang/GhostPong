export type GameMode = 'normal' | 'speed' | 'stupid';

export interface CreateGameRequest {
  channelId: string;
  mode: GameMode;
}
