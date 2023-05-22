import { GameData } from '@/game/game-data';

export class Game {
  constructor(id: string, leftPlayerId: number, rightPlayerId: number) {
    this.gameData = new GameData(id, leftPlayerId, rightPlayerId);
  }
  intervalId?: NodeJS.Timeout;
  playerStarted: boolean[] = [false, false];
  gameData: GameData;
}
