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
import { InvisibleChannelRepository } from '../repository/invisible-channel.repository';
import { Status } from '../repository/model/user-status';
import { SocketIdRepository } from '../repository/socket-id.repository';
import { UserStatusRepository } from '../repository/user-status.repository';
import { VisibleChannelRepository } from '../repository/visible-channel.repository';

@WebSocketGateway({ cors: corsOption })
export class ConnectionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;

  constructor(
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
    private readonly socketIdRepository: SocketIdRepository,
    private readonly userStatusRepository: UserStatusRepository,
    private readonly visibleChannelRepository: VisibleChannelRepository,
    private readonly invisibleChannelRepository: InvisibleChannelRepository,
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
  ) {}

  /**
   * events
   */
  async handleConnection(@ConnectedSocket() socket: Socket): Promise<void> {
    const myId = this.getUserId(socket);
    if (myId === undefined) {
      socket.emit('exception', { status: 'connect_error', message: 'invalid token' });
      socket.disconnect();
      return;
    }
    console.log('connected socket id is ', socket.id);
    console.log(`connected socket's user id is `, myId);
    socket.data.userId = myId;
    this.socketIdRepository.insert({ userId: myId, socketId: socket.id });
    this.userStatusRepository.insert({ userId: myId, status: 'online' });
    await this.addUserToRooms(socket, myId);
    this.emitUserStatusToFriends(myId, 'online');
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): void {
    const userId: number = socket.data.userId;
    this.leaveChannel(userId);

    this.userStatusRepository.delete(userId);
    this.socketIdRepository.delete(userId);

    this.emitUserStatusToFriends(userId, 'offline');
    this.server.socketsLeave(`user-${userId}`); // 'user-${userId}' room 의 모든 socket 을 leave 시킨다

    console.log('WebSocketServer Disconnect');
    console.log(userId, 'is disconnected');
  }

  // SECTION: private
  private getUserId(socket: Socket): number | undefined {
    let myId: number;
    if (this.appConfigService.env === 'development') {
      myId = Math.floor(Number(socket.handshake.headers['x-my-id']));
      if (isNaN(myId)) {
        return;
      }
    } else {
      const token = socket.handshake.auth.token;
      try {
        myId = this.jwtService.verify(token, { secret: process.env.USER_JWT_SECRETKEY }).userId;
      } catch {
        return;
      }
    }
    return myId;
  }

  /**
   * user 의 id 로 친구 목록을 찾아서 반환한다.
   *
   * @param userId
   * @returns
   */
  private findFriendList(userId: number): Promise<Friendship[]> {
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
   * @param socket 현재 접속 중인 user socket 객체
   * @param userId 현재 접속 중인 user 의 user id
   */
  private async addUserToRooms(socket: Socket, userId: number): Promise<void> {
    const userRoom = `user-${userId}`;
    const friendList = await this.findFriendList(userId);
    friendList.map(({ senderId, receiverId }) => {
      const friendId = senderId === userId ? receiverId : senderId;
      if (this.userStatusRepository.find(friendId)?.status === 'online') {
        // 접속 중인 친구의 socketId 를 찾는다.
        const socketId = this.socketIdRepository.find(friendId)?.socketId;
        if (socketId !== undefined) {
          socket.join(`user-${friendId}`); //join my socket to friend's room
          this.server.in(socketId).socketsJoin(userRoom); // join friend's socket to my room
        }
      }
    });
  }

  /**
   * channel 에 들어가 있는 상태라면 channel의 users 에서 user 를 제거한다.
   *
   * @param userId
   */
  private leaveChannel(userId: number): void {
    const channels = [...this.visibleChannelRepository.findAll(), ...this.invisibleChannelRepository.findAll()];

    for (const channel of channels) {
      if (channel.users.has(userId)) {
        channel.users.delete(userId);
        return;
      }
    }
  }

  /**
   * user 의 상태를 room 에 있는 친구들에게 알린다.
   *
   * @param userId user id
   * @param status online | offline | game
   */
  private emitUserStatusToFriends(userId: number, status: Status) {
    this.server.to(`user-${userId}`).emit('user-status', { id: userId, status });
  }
  // !SECTION: private
}
