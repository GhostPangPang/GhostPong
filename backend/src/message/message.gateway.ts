import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { corsOption } from '../common/option/cors.option';

@WebSocketGateway({ cors: corsOption })
export class MessageGateway {
  @WebSocketServer()
  public server: Server;

  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() socket: Socket): void {
    socket.emit('message', 'Hello world!');
  }
}
