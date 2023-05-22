import { Inject, forwardRef, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { GameData, Player } from '@/game/game-data';

import { corsOption } from '../common/option/cors.option';
import { createWsException } from '../common/util';
import { GameRepository } from '../repository/game.repository';
import { Status } from '../repository/model/user-status';
import { UserStatusRepository } from '../repository/user-status.repository';

import { GameStartDto } from './dto/game-start.dto';
import { GameEngine } from './game.engine';

@UsePipes(
  new ValidationPipe({
    exceptionFactory: createWsException,
  }),
)
@WebSocketGateway({ cors: corsOption })
export class GameGateway {
  @WebSocketServer()
  public server: Server;

  constructor(
    private readonly gameRepository: GameRepository,
    private readonly userStatusRepository: UserStatusRepository,
    @Inject(forwardRef(() => GameEngine))
    private readonly gameEngine: GameEngine,
  ) {}

  @SubscribeMessage('game-start')
  public handleGameStart(@ConnectedSocket() socket: Socket, @MessageBody() { gameId }: GameStartDto) {
    const game = this.gameRepository.find(gameId);
    if (!game) {
      throw new WsException('게임이 존재하지 않습니다.');
    }
    const userId: number = socket.data.userId;
    if (game.gameData.leftPlayer.userId === userId) {
      game.playerStarted[0] = true;
    } else if (game.gameData.rightPlayer.userId === userId) {
      game.playerStarted[1] = true;
    } else {
      throw new WsException('게임의 플레이어가 아닙니다.');
    }
    if (game.playerStarted[0] && game.playerStarted[1]) {
      const game = this.gameRepository.find(gameId);
      if (game === undefined) {
        return undefined;
      }
      if (game.engineIntervalId !== undefined) {
        throw new WsException('이미 게임이 시작되었습니다.');
      }
      this.gameEngine.startGame(game);
    }
  }

  /**
   * channel 에 있는 유저들에게 게임이 시작함을 알린다.
   *
   * @param gameId
   */
  broadcastGameStart(gameId: string) {
    this.server.to(gameId).emit('game-start', { gameId });
  }

  broadcastGameData(gamedata: GameData) {
    this.server.to(gamedata.id).emit('game-data', gamedata);
  }

  broadcastGameEnd(gameId: string, winner: Player, loser: Player) {
    this.server.to(gameId).emit('game-end', {
      id: gameId,
      winner: { id: winner.userId, score: winner.score },
      loser: { id: loser.userId, score: loser.score },
    });
  }

  updateUserStatus(userId: number, status: Status) {
    this.userStatusRepository.update(userId, { status });
    this.server.to(`user-${userId}`).emit('user-status', { id: userId, status });
  }
}
