import { Injectable, Inject, forwardRef } from '@nestjs/common';

import { GameData } from '@/game/game-data';
import { checkPlayerCollision, checkWallcollision, checkGameEnded, updateBall } from '@/game/utils';

import { GameRepository } from '../repository/game.repository';
import { Game } from '../repository/model/game';

import { GameGateway } from './game.gateway';

const ENGINE_INTERVAL = 10;
const SYNC_INTERVAL = 500;

@Injectable()
export class GameEngine {
  constructor(
    private readonly gameRepository: GameRepository,
    @Inject(forwardRef(() => GameGateway))
    private readonly gameGateway: GameGateway,
  ) {}

  startGame(game: Game) {
    game.engineIntervalId = setInterval(() => {
      this.gameLoop(game.gameData);
    }, ENGINE_INTERVAL);

    game.syncIntervalId = setInterval(() => {
      //this.gameGateway.emitGameData(game.gameData);
    }, SYNC_INTERVAL);
  }

  endGame(game: Game) {
    if (game.engineIntervalId !== undefined) {
      clearInterval(game.engineIntervalId);
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
