import { UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';

import { corsOption } from '../common/option/cors.option';
import { createWsException } from '../common/util';
import { Friendship } from '../entity/friendship.entity';
import { MessageView } from '../entity/message-view.entity';
import { Message } from '../entity/message.entity';
import { SocketIdRepository } from '../repository';

import { LastMessageViewDto } from './dto/socket/last-message-view.dto';
import { MesssageDto } from './dto/socket/message.dto';

@WebSocketGateway({ cors: corsOption })
export class MessageGateway {
  @WebSocketServer()
  public server: Server;

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(MessageView)
    private readonly messageViewRepository: Repository<MessageView>,
    private readonly socketIdRepository: SocketIdRepository,
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
  ) {}

  /**
   * events
   */

  /**
   * @description 클라이언트로부터 메세지 받아서 상대에게 보내주는 이벤트
   * @param socket
   * @param data
   */
  @UsePipes(new ValidationPipe({ exceptionFactory: createWsException }))
  @SubscribeMessage('message')
  async handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data: MesssageDto): Promise<void> {
    console.log('friend id is ', data.id);
    console.log('content is ', data.content);
    console.log('creatdAt is ', data.createdAt);
    await this.checkExistFriendship(data.id, socket.data.userId, data.receiverId);
    await this.messageRepository.insert({
      senderId: socket.data.userId,
      friendId: data.id,
      content: data.content,
      createdAt: data.createdAt,
    });
    const receiverSocketId = this.socketIdRepository.find(data.receiverId)?.socketId;
    if (receiverSocketId === undefined) {
      return;
    }
    this.server.to(receiverSocketId).emit('message', data);
  }

  /**
   * @description 클라이언트가 메세지창을 나갈 때 마지막으로 읽은 메세지를 업데이트 해주는 이벤트
   * @param socket
   * @param data
   */
  @UsePipes(new ValidationPipe({ exceptionFactory: createWsException }))
  @SubscribeMessage('last-message-view')
  async handleLeaveMessageRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: LastMessageViewDto,
  ): Promise<void> {
    await this.messageViewRepository.save({
      user: { id: socket.data.userId }, // 사용자 ID를 MessageView의 user 필드에 저장
      friend: { id: data.friendId }, // 친구 ID를 MessageView의 friend 필드에 저장
      lastViewTime: data.lastViewTime,
    });

    console.log('data.friendId : ', data.friendId);
    console.log('data lastViewTime : ', data.lastViewTime);
    // console.log(typeof data.lastViewTime);
  }

  /**
   * private
   */
  private async checkExistFriendship(friendId: number, senderId: number, receiverId: number): Promise<void> {
    const friendship = await this.friendshipRepository.findOneBy({ id: friendId });
    if (friendship === null) {
      throw new WsException('존재하지 않는 친구 관계입니다.');
    }
    if (
      (friendship.senderId === senderId && friendship.receiverId === receiverId && friendship.accept === true) ||
      (friendship.senderId === receiverId && friendship.receiverId === senderId && friendship.accept === true)
    ) {
      return;
    }
    throw new WsException('유효하지 않은 친구 관계입니다.');
  }
}
