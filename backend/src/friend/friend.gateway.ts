import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';

import { corsOption } from '../common/option/cors.option';
import { Friendship } from '../entity/friendship.entity';
import { SocketIdRepository } from '../repository/socket-id.repository';

@WebSocketGateway({ cors: corsOption })
export class FriendGateway {
  @WebSocketServer()
  public server: Server;

  constructor(
    private readonly socketIdRepository: SocketIdRepository,
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
  ) {}

  /**
   * 친구 창에 들어왔을 때 모든 친구와의 friend room 에 join 한다.
   *
   * @param socket 이벤트를 보낸 유저의 소켓
   */
  @SubscribeMessage('join-friend-room')
  async joinFriendRoom(@ConnectedSocket() socket: Socket): Promise<void> {
    (await this.findFriendsId(socket.data.userId)).map(({ id }) => {
      socket.join(`friend-${id}`);
    });
  }

  /**
   * 친구 창을 나갔을 때 모든 친구와의 friend room 에서 leave 한다.
   *
   * @param socket 이벤트를 보낸 유저의 소켓
   */
  @SubscribeMessage('leave-friend-room')
  async leaveFriendRoom(@ConnectedSocket() socket: Socket): Promise<void> {
    (await this.findFriendsId(socket.data.userId)).map(({ id }) => {
      socket.leave(`friend-${id}`);
    });
  }

  /**
   * 친구 요청이 수락되었을 때 친구 요청을 보낸 유저에게 이벤트를 보낸다.
   *
   * @param friendId 친구 관계 id
   * @param senderId 친구신청을 보낸 유저의 id
   */
  emitFriendAccepted(friendship: Friendship): void {
    const socketId = this.socketIdRepository.find(friendship.senderId)?.socketId;
    if (socketId === undefined) {
      return;
    }
    this.server.to(socketId).emit('friend-accepted', {
      id: friendship.id,
      lastMessageTime: null,
      lastViewTime: null,
      user: friendship.receiver,
      status: 'online',
    });
  }

  // SECTION: private
  private findFriendsId(userId: number): Promise<Friendship[]> {
    return this.friendshipRepository.find({
      select: ['id'],
      where: [
        { senderId: userId, accept: true },
        { receiverId: userId, accept: true },
      ],
    });
  }

  //!SECTION: private
}
