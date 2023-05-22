import { GameData } from '@/game/game-data';
import { checkPlayerCollision, checkWallcollision, checkGameEnded, updateBall } from '@/game/utils';

import { GameRepository } from '../repository/game.repository';
import { Game } from '../repository/model/game';

import { GameGateway } from './game.gateway';

export class GameEngine {
  constructor(private readonly gameRepository: GameRepository, private readonly gameGateway: GameGateway) {}

  startGame(game: Game) {
    game.intervalId = setInterval(() => {
      this.gameLoop(game.gameData);
    }, 1000);
  }

  endGame(game: Game) {
    if (game.intervalId !== undefined) {
      clearInterval(game.intervalId);
    }
    // update user data
    this.gameRepository.delete(game.gameData.id);
  }

  private gameLoop(gameData: GameData) {
    updateBall(gameData);
    if (checkPlayerCollision(gameData) === true) {
      //emit game data
    }
    checkWallcollision(gameData.ball);
    if (checkGameEnded(gameData) === true) {
      //emit game data
      if (gameData.rightPlayer.score === 10) {
        //emit game end
      } else if (gameData.leftPlayer.score === 10) {
        //emit game end
      }
    }
  }
}
