import { GameMode } from '@/types/game';

import { GameData } from '@/game/game-data';

export class Game {
  constructor(id: string, mode: GameMode, leftPlayerId: number, rightPlayerId: number) {
    this.gameData = new GameData(id, mode, leftPlayerId, rightPlayerId);
  }
  engineIntervalId?: NodeJS.Timeout;
  syncIntervalId?: NodeJS.Timeout;
  playerStarted: boolean[] = [false, false];
  gameData: GameData;
}
