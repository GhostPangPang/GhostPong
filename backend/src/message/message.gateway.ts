import { UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';

import { corsOption } from '../common/option/cors.option';
import { Friendship } from '../entity/friendship.entity';
import { MessageView } from '../entity/message-view.entity';
import { Message } from '../entity/message.entity';
import { SocketIdRepository } from '../repository/socket-id.repository';

import { LeaveMessageRoomDto } from './dto/socket/leave-message-room.dto';
import { MesssageDto } from './dto/socket/message.dto';

@WebSocketGateway({ cors: corsOption })
export class MessageGateway {
  @WebSocketServer()
  public server: Server;

  constructor(
    private readonly socketIdRepository: SocketIdRepository,
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(MessageView)
    private readonly messageViewRepository: Repository<MessageView>,
  ) {}

  /**
   * events
   */

  /**
   * @description 클라이언트로부터 메세지 받아서 상대에게 보내주는 이벤트
   * @param socket
   * @param data
   */
  @UsePipes(new ValidationPipe())
  @SubscribeMessage('message')
  async handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data: MesssageDto): Promise<void> {
    console.log(data.content);
    console.log(data.id);
    this.messageRepository.insert({ senderId: socket.data.userId, friendId: data.id, content: data.content });
    socket.to(`friend-${data.id}`).emit('message', data);
  }

  /**
   * @description 클라이언트가 메세지창을 나갈 때 마지막으로 읽은 메세지를 업데이트 해주는 이벤트
   * @param socket
   * @param data
   */
  @UsePipes(new ValidationPipe())
  @SubscribeMessage('leave-message-room')
  async handleLeaveMessageRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: LeaveMessageRoomDto,
  ): Promise<void> {
    await this.messageViewRepository.save({
      user: { id: socket.data.userId }, // 사용자 ID를 MessageView의 user 필드에 저장
      friend: { id: data.friendId }, // 친구 ID를 MessageView의 friend 필드에 저장
      lastViewTime: data.lastViewTime,
    });

    console.log('data.friendId : ', data.friendId);
    console.log('data lastViewTime : ', data.lastViewTime);

    console.log('before leave ', socket.rooms);
    socket.leave(`friend-${data.friendId}`);
    console.log('after leave ', socket.rooms);
  }

  @SubscribeMessage('join-message-room')
  async handleJoinMessageRoom(@ConnectedSocket() socket: Socket): Promise<void> {
    (
      await this.friendshipRepository.find({
        select: ['id'],
        where: [
          { senderId: socket.data.userId, accept: true },
          { receiverId: socket.data.userId, accept: true },
        ],
      })
    ).map(({ id }) => {
      this.joinMessageRoom(socket.data.userId, id);
    });
  }

  /**
   * methods
   */

  joinMessageRoom(userId: number, friendId: number): void {
    const socketId = this.socketIdRepository.find(userId);
    if (socketId === undefined) {
      throw new Error('socketId is undefined');
    }
    const socket = this.server.sockets.sockets.get(socketId.socketId);
    if (socket === undefined) {
      throw new Error('socket is undefined');
    }
    socket.emit(`message`, { id: 0, content: `socket is joined in messageRoom${friendId}` });
    socket.join(`friend-${friendId}`);
  }
}
