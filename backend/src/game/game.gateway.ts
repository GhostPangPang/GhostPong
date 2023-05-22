import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { corsOption } from '../common/option/cors.option';

@WebSocketGateway({ cors: corsOption })
export class GameGateway {
  @WebSocketServer()
  public server: Server;

  broadcastGameStart(gameId: string) {
    this.server.to(gameId).emit('game-start', { gameId });
  }
}
