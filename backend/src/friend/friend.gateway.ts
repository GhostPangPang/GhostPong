import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { corsOption } from '../common/option/cors.option';
import { Friendship } from '../entity/friendship.entity';
import { SocketIdRepository } from '../repository';

@WebSocketGateway({ cors: corsOption })
export class FriendGateway {
  @WebSocketServer()
  public server: Server;

  constructor(private readonly socketIdRepository: SocketIdRepository) {}

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

  /**
   * 친구가 된 순간 user-status 를 관리하기 위한 room 에 소켓들을 추가
   *
   * @param myId 나의 userId
   * @param friendId 친구의 userId
   */
  addFriendToRoom(myId: number, userId: number) {
    const mySocketId = this.socketIdRepository.find(myId)?.socketId;
    const friendSocketId = this.socketIdRepository.find(userId)?.socketId;
    if (mySocketId !== undefined && friendSocketId !== undefined) {
      this.server.in(mySocketId).socketsJoin(`user-${userId}`); //join my socket to friend's room
      this.server.in(friendSocketId).socketsJoin(`user-${myId}`); // join friend's socket to my room
    }
  }

  /**
   * 친구 삭제하는 순간 user-status 를 관리하기 위한 room 에서 소켓들을 제거
   * @param myId
   * @param userId
   */
  removeFriendFromRoom(myId: number, userId: number) {
    const mySocketId = this.socketIdRepository.find(myId)?.socketId;
    const friendSocketId = this.socketIdRepository.find(userId)?.socketId;
    if (mySocketId !== undefined && friendSocketId !== undefined) {
      this.server.in(mySocketId).socketsLeave(`user-${userId}`);
      this.server.in(friendSocketId).socketsLeave(`user-${myId}`);
    }
  }
}
