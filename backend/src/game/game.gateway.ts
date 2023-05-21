import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class GameGateway {
  @WebSocketServer()
  public server: Server;

  broadcastGameStart(gameId: string) {
    this.server.to(gameId).emit('game-start');
  }
}
