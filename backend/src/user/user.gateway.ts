import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { SocketIdRepository } from '../repository/socket-id.repository';

@WebSocketGateway()
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;

  constructor(private readonly socketRepository: SocketIdRepository, private readonly jwtService: JwtService) {}

  /**
   * events
   */
  handleConnection(@ConnectedSocket() socket: Socket): void {
    const token = socket.handshake.headers.authorization;
    if (token === undefined) {
      throw new UnauthorizedException('토큰이 존재하지 않습니다.');
    }
    console.log(token);
    const myId = this.jwtService.verify(token, { secret: process.env.USER_JWT_SECRETKEY }).userId;
    if (token === undefined) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
    console.log('connected socket id is   ', socket.id);
    console.log('connected socket-s user id is   ', myId);
    socket.data.userId = myId;
    // this.socketRepository.insert({ userId: myId, socketId: socket.id });
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): void {
    // this.socketRepository.delete(socket.data.userId);
    console.log('WebSocketServer Disconnect');
    console.log(socket.data.userId, 'is disconnected');
  }
}
