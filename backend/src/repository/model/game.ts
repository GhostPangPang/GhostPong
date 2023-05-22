import { GameData } from '@/game/game-data';

export class Game {
  constructor(id: string, leftPlayerId: number, rightPlayerId: number) {
    this.gameData = new GameData(id, leftPlayerId, rightPlayerId);
  }
  engineIntervalId?: NodeJS.Timeout;
  syncIntervalId?: NodeJS.Timeout;
  playerStarted: boolean[] = [false, false];
  gameData: GameData;
}
