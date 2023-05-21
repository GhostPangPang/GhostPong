import { Game } from '@/game/game';

import { Repository } from './repository.interface';

export class GameRepository implements Repository<string, Game> {
  private readonly gameList: Map<string, Game> = new Map<string, Game>();

  insert(game: Game): string {
    this.gameList.set(game.id, game);
    return game.id;
  }

  update(id: string, partialItem: Partial<Game>): Game | undefined {
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

  find(id: string): Game | undefined {
    return this.gameList.get(id);
  }
}
