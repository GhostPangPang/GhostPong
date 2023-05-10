import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { corsOption } from '../common/option/cors.option';
import { AppConfigService } from '../config/app/configuration.service';
import { SocketIdRepository } from '../repository/socket-id.repository';

@WebSocketGateway({ cors: corsOption })
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;

  constructor(
    private readonly socketIdRepository: SocketIdRepository,
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
  ) {}

  /**
   * events
   */
  handleConnection(@ConnectedSocket() socket: Socket): void {
    let myId: number;
    if (this.appConfigService.env === 'development') {
      myId = Math.floor(Number(socket.handshake.headers['x-my-id']));
      if (isNaN(myId)) {
        socket.disconnect();
        return;
      }
    } else {
      const token = socket.handshake.headers.authorization;
      if (token === undefined) {
        socket.disconnect();
        return;
        //throw new UnauthorizedException('토큰이 존재하지 않습니다.');
      }

      myId = this.jwtService.verify(token, { secret: process.env.USER_JWT_SECRETKEY }).userId;
      if (myId === undefined) {
        socket.disconnect();
        return;
        //throw new UnauthorizedException('유효하지 않은 토큰입니다.');
      }
    }
    console.log('connected socket id is\t', socket.id);
    console.log(`connected socket's user id is\t`, myId);
    socket.data.userId = myId;
    this.socketIdRepository.insert({ userId: myId, socketId: socket.id });
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): void {
    this.socketIdRepository.delete(socket.data.userId);
    console.log('WebSocketServer Disconnect');
    console.log(socket.data.userId, 'is disconnected');
  }
}
