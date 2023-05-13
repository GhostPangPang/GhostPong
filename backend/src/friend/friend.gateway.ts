import { InjectRepository } from '@nestjs/typeorm';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
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

  //!SECTION: private
}
