import { Injectable, Inject, forwardRef, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { Player } from '@/game/game-data';
import { checkPlayerCollision, checkWallCollision, checkGameEnded, updateBall } from '@/game/utils';

import { GameHistory } from '../entity/game-history.entity';
import { UserRecord } from '../entity/user-record.entity';
import { User } from '../entity/user.entity';
import { ChannelRepository, GameRepository } from '../repository';
import { Game } from '../repository/model';

import { GameGateway } from './game.gateway';

const ENGINE_INTERVAL = 10;
const SYNC_INTERVAL = 50;

@Injectable()
export class GameEngineService {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly channelRepository: ChannelRepository,
    @Inject(forwardRef(() => GameGateway))
    private readonly gameGateway: GameGateway,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  logger: Logger = new Logger('GameEngine');

  startGame(game: Game): void {
    game.syncIntervalId = setInterval(() => {
      this.gameGateway.broadcastGameData(game.gameData);
    }, SYNC_INTERVAL);
    game.engineIntervalId = setInterval(() => {
      this.gameLoop(game);
    }, ENGINE_INTERVAL);
  }

  async endGame(game: Game): Promise<void> {
    if (game.engineIntervalId !== undefined) {
      // end loops
      clearInterval(game.engineIntervalId);
      game.engineIntervalId = undefined;
      clearInterval(game.syncIntervalId);
      game.syncIntervalId = undefined;
    }
    const { gameData } = game;
    this.gameGateway.updateUserStatus(gameData.leftPlayer.userId, 'online');
    this.gameGateway.updateUserStatus(gameData.rightPlayer.userId, 'online');
    this.channelRepository.update(gameData.id, { isInGame: false });
    this.gameRepository.delete(gameData.id);
    const winner = gameData.leftPlayer.score > gameData.rightPlayer.score ? gameData.leftPlayer : gameData.rightPlayer;
    const loser = winner === gameData.leftPlayer ? gameData.rightPlayer : gameData.leftPlayer;

    try {
      await this.insertGameHistory(winner, loser);
    } catch (e) {
      this.logger.error(e);
    }
    // emit game end event
    this.gameGateway.broadcastGameEnd(gameData.id, winner, loser);
  }

  private insertGameHistory(winner: Player, loser: Player): Promise<void> {
    const point = winner.score - loser.score;

    return this.dataSource.manager.transaction(async (manager) => {
      await manager.insert(GameHistory, {
        winnerId: winner.userId,
        loserId: loser.userId,
        winnerScore: winner.score,
        loserScore: loser.score,
      });
      await manager.update(User, { id: winner.userId }, { exp: () => `exp + ${point}` });
      await manager.update(
        User,
        { id: loser.userId },
        { exp: () => `case when exp > ${point} then exp - ${point} else 0 end` },
      );
      await manager.update(UserRecord, { id: winner.userId }, { winCount: () => `winCount + 1` });
      await manager.update(UserRecord, { id: loser.userId }, { loseCount: () => `loseCount + 1` });
    });
  }

  private async gameLoop(game: Game): Promise<void> {
    const { gameData } = game;
    updateBall(gameData);

    if (checkPlayerCollision(gameData) === true) {
      this.gameGateway.broadcastGameData(gameData);
    }
    checkWallCollision(gameData.ball);
    if (checkGameEnded(gameData) === true) {
      this.gameGateway.broadcastGameData(gameData);
      if (gameData.rightPlayer.score === 10 || gameData.leftPlayer.score === 10) {
        await this.endGame(game);
        return;
      }
    }
  }
}
