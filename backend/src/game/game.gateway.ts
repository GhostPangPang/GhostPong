import { UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { corsOption } from '../common/option/cors.option';
import { createWsException } from '../common/util';
import { GameRepository } from '../repository/game.repository';

import { GameStartDto } from './dto/game-start.dto';

@WebSocketGateway({ cors: corsOption })
export class GameGateway {
  @WebSocketServer()
  public server: Server;

  constructor(private readonly gameRepository: GameRepository) {}

  @UsePipes(new ValidationPipe({ exceptionFactory: createWsException }))
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
      throw new WsException('게임에 참여하지 않은 유저입니다.');
    }
    if (game.playerStarted[0] && game.playerStarted[1]) {
      // start game engine
      // game data broadcast
    }
  }

  broadcastGameStart(gameId: string) {
    this.server.to(gameId).emit('game-start', { gameId });
  }
}
