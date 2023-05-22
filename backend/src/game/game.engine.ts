import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { checkPlayerCollision, checkWallcollision, checkGameEnded, updateBall } from '@/game/utils';

import { GameHistory } from '../entity/game-history.entity';
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
    @InjectRepository(GameHistory)
    private readonly gameHistoryRepository: Repository<GameHistory>,
  ) {}

  startGame(game: Game) {
    game.syncIntervalId = setInterval(() => {
      this.gameGateway.broadcastGameData(game.gameData);
    }, SYNC_INTERVAL);
    game.engineIntervalId = setInterval(() => {
      this.gameLoop(game);
    }, ENGINE_INTERVAL);
  }

  endGame(game: Game) {
    if (game.engineIntervalId !== undefined) {
      // end loops
      clearInterval(game.engineIntervalId);
      clearInterval(game.syncIntervalId);
    }
    // update user data
    this.gameRepository.delete(game.gameData.id);
  }

  private gameLoop(game: Game) {
    const { gameData } = game;
    updateBall(gameData);

    if (checkPlayerCollision(gameData) === true) {
      this.gameGateway.broadcastGameData(gameData);
    }
    checkWallcollision(gameData.ball);
    if (checkGameEnded(gameData) === true) {
      this.gameGateway.broadcastGameData(gameData);
      if (gameData.rightPlayer.score === 10 || gameData.leftPlayer.score === 10) {
        this.endGame(game);
        return;
      }
    }
  }
}
