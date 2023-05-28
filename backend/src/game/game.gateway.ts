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

import { MemberInfo } from '@/types/channel';
import { BarMoved, GameEnd, GameStart } from '@/types/game';
import { UserStatus } from '@/types/user';

import { CANVASE_HEIGHT, GameData, Player } from '@/game/game-data';

import { corsOption } from '../common/option/cors.option';
import { createWsException } from '../common/util';
import { GameRepository, SocketIdRepository, UserStatusRepository } from '../repository';
import { Status } from '../repository/model';

import { MoveBarDto } from './dto/move-bar.dto';
import { PlayerReadyDto } from './dto/player-ready';
import { GameEngineService } from './game-engine.service';

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
    private readonly socketIdRepository: SocketIdRepository,
    @Inject(forwardRef(() => GameEngineService))
    private readonly gameEngine: GameEngineService,
  ) {}

  @SubscribeMessage('player-ready')
  handleGameStart(@ConnectedSocket() socket: Socket, @MessageBody() { gameId }: PlayerReadyDto): void {
    const game = this.gameRepository.find(gameId);
    if (game === undefined) {
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
      if (game.engineIntervalId !== undefined) {
        throw new WsException('이미 게임이 시작되었습니다.');
      }
      this.gameEngine.startGame(game);
    }
  }

  @SubscribeMessage('move-bar')
  movePlayerBar(@ConnectedSocket() socket: Socket, @MessageBody() { gameId, y }: MoveBarDto): void {
    const game = this.gameRepository.find(gameId);
    if (game === undefined) {
      throw new WsException('게임이 존재하지 않습니다.');
    }

    if (y < 0 + game.gameData.leftPlayer.height / 2) {
      y = 0 + game.gameData.leftPlayer.height / 2;
    } else if (y > CANVASE_HEIGHT - game.gameData.leftPlayer.height / 2) {
      y = CANVASE_HEIGHT - game.gameData.leftPlayer.height / 2;
    }
    if (game.gameData.leftPlayer.userId === socket.data.userId) {
      game.gameData.leftPlayer.y = y;
    } else if (game.gameData.rightPlayer.userId === socket.data.userId) {
      game.gameData.rightPlayer.y = y;
    } else {
      throw new WsException('게임의 플레이어가 아닙니다.');
    }
    const moveBar: BarMoved = { userId: socket.data.userId, y };
    socket.to(gameId).emit('bar-moved', moveBar);
  }

  joinUserToGameRoom(userIds: number[], gameId: string): boolean {
    const leftUserSocketId = this.socketIdRepository.find(userIds[0]);
    const rightUserSocketId = this.socketIdRepository.find(userIds[1]);
    if (leftUserSocketId === undefined || rightUserSocketId === undefined) {
      return false;
    }
    this.server.in(leftUserSocketId.socketId).socketsJoin(gameId);
    this.server.in(rightUserSocketId.socketId).socketsJoin(gameId);
    return true;
  }

  /**
   * channel 에 있는 유저들에게 게임이 시작함을 알린다.
   *
   * @param gameId
   */
  broadcastGameStart(gameId: string, leftPlayer: MemberInfo, rightPlayer: MemberInfo): void {
    const gameStart: GameStart = { gameId, leftPlayer, rightPlayer };
    this.server.to(gameId).emit('game-start', gameStart);
  }

  broadcastGameData(gamedata: GameData): void {
    this.server.to(gamedata.id).emit('game-data', gamedata);
  }

  broadcastGameEnd(gameId: string, winner: Player, loser: Player): void {
    const gameEnd: GameEnd = {
      id: gameId,
      winner: { id: winner.userId, score: winner.score },
      loser: { id: loser.userId, score: loser.score },
    };
    this.server.to(gameId).emit('game-end', gameEnd);
  }

  updateUserStatus(userId: number, status: Status): void {
    const userStatus: UserStatus | undefined = this.userStatusRepository.update(userId, { status });
    if (userStatus !== undefined) {
      this.server.to(`user-${userId}`).emit('user-status', userStatus);
    }
  }
}
