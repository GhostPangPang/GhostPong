import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';

import { corsOption } from '../common/option/cors.option';
import { AppConfigService } from '../config/app/configuration.service';
import { Friendship } from '../entity/friendship.entity';
import { Status } from '../repository/model/user-status';
import { SocketIdRepository } from '../repository/socket-id.repository';
import { UserStatusRepository } from '../repository/user-status.repository';

@WebSocketGateway({ cors: corsOption })
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;

  constructor(
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
    private readonly socketIdRepository: SocketIdRepository,
    private readonly userStatusRepository: UserStatusRepository,
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
  ) {}

  /**
   * events
   */
  handleConnection(@ConnectedSocket() socket: Socket): void {
    const myId = this.getUserIdFromHeader(socket);
    if (myId === undefined) {
      // TODO: error handling
      socket.disconnect();
      return;
    }
    console.log('connected socket id is ', socket.id);
    console.log(`connected socket's user id is `, myId);
    socket.data.userId = myId;
    this.socketIdRepository.insert({ userId: myId, socketId: socket.id });
    this.addUserToRooms(socket, myId);
    this.emitUserStatusToFriends(myId, 'online');
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): void {
    const userId: number = socket.data.userId;
    this.userStatusRepository.delete(userId);
    this.socketIdRepository.delete(socket.data.userId);
    this.emitUserStatusToFriends(userId, 'offline');
    this.server.socketsLeave(`user-${userId}`);

    console.log('WebSocketServer Disconnect');
    console.log(userId, 'is disconnected');
  }

  // SECTION: private
  private getUserIdFromHeader(socket: Socket): number | undefined {
    let myId: number;
    if (this.appConfigService.env === 'development') {
      myId = Math.floor(Number(socket.handshake.headers['x-my-id']));
      if (isNaN(myId)) {
        return;
      }
    } else {
      const token = socket.handshake.headers.authorization;
      if (token === undefined) {
        return;
      }
      myId = this.jwtService.verify(token, { secret: process.env.USER_JWT_SECRETKEY }).userId;
      if (myId === undefined) {
        return;
      }
    }
    return myId;
  }

  /**
   * user 의 id 로 socket 을 찾아서 반환한다.
   *
   * @param userId user id
   * @returns user's socket instance
   */
  private getSocketByUserId(userId: number): Socket | undefined {
    const socketId = this.socketIdRepository.find(userId)?.socketId;
    if (socketId === undefined) {
      return undefined;
    }
    return this.server.sockets.sockets.get(socketId);
  }

  /**
   * user 의 id 로 친구 목록을 찾아서 반환한다.
   *
   * @param userId
   * @returns
   */
  private async findFriendList(userId: number): Promise<Friendship[]> {
    return this.friendshipRepository.find({
      select: ['senderId', 'receiverId'],
      where: [
        { senderId: userId, accept: true },
        { receiverId: userId, accept: true },
      ],
    });
  }

  /**
   * user 의 접속 중인 친구 목록을 찾아서 user 의 room 에 친구들을 join, 친구들의 room 에 user 를 join 시킨다.
   *
   * @param socket
   * @param userId
   */
  private async addUserToRooms(socket: Socket, userId: number): Promise<void> {
    const userRoom = `user-${userId}`;
    const friendList = await this.findFriendList(userId);
    friendList.map(({ senderId, receiverId }) => {
      const friendId = senderId === userId ? receiverId : senderId;
      if (this.userStatusRepository.find(friendId)?.status === 'online') {
        const friendSocket = this.getSocketByUserId(friendId);
        if (friendSocket !== undefined) {
          friendSocket.join(userRoom); // join my socket to friend's room
          socket.join(`user-${friendId}`); // join friend's socket to my room
        }
      }
    });
  }

  /**
   * user 의 상태를 room 에 있는 친구들에게 알린다.
   *
   * @param userId user id
   * @param status online | offline | game
   */
  private async emitUserStatusToFriends(userId: number, status: Status) {
    this.server.to(`user-${userId}`).emit('user-status', { id: userId, status });
  }
  // !SECTION
}
