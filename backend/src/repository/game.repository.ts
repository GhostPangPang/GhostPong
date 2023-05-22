import { GameData } from '@/game/game-data';

import { Repository } from './repository.interface';

export class GameRepository implements Repository<string, GameData> {
  private readonly gameList: Map<string, GameData> = new Map<string, GameData>();

  insert(game: GameData): string {
    this.gameList.set(game.id, game);
    return game.id;
  }

  update(id: string, partialItem: Partial<GameData>): GameData | undefined {
    const game = this.gameList.get(id);
    if (game === undefined) {
      return undefined;
    }
    const updatedGame = { ...game, ...partialItem };
    this.gameList.set(id, updatedGame);
    return updatedGame;
  }

  delete(id: string): boolean {
    return this.gameList.delete(id);
  }

  find(id: string): GameData | undefined {
    return this.gameList.get(id);
  }

  // check id is exist
  exist(id: string): boolean {
    return this.gameList.has(id);
  }
}
