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
  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data: MesssageDto): void {
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
  @SubscribeMessage('leave-message-room')
  async handleLeaveMessageRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: LeaveMessageRoomDto,
  ): Promise<void> {
    await this.messageViewRepository.query(
      `
      INSERT INTO message_view (user_id, friend_id, last_view_time)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, friend_id)
      DO UPDATE SET last_view_time = EXCLUDED.last_view_time
      `,
      [socket.data.userId, data.friendId, data.lastViewTime],
    );

    console.log('data.friendId : ', data.friendId);
    console.log('data lastViewTime : ', data.lastViewTime);

    console.log('before leave ', socket.rooms);
    socket.leave(`friend-${data.friendId}`);
    console.log('after leave ', socket.rooms);
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

  /**
   * @description joinMessageRoom 디버깅용입니다. 클라이언트랑 확인해서 joinMessageRoom 잘 동작하면 이 이벤트 지울 예정
   * @param socket
   * @param friendId
   */
  @SubscribeMessage('join-room')
  async joinRoom(@ConnectedSocket() socket: Socket, @MessageBody() friendId: number): Promise<void> {
    console.log(friendId);
    console.log(socket.data.userId);
    const friendship = await this.friendshipRepository.findOneBy([
      { id: friendId, senderId: socket.data.userId, accept: true },
      { id: friendId, receiverId: socket.data.userId, accept: true },
    ]);
    if (friendship === null) {
      throw new Error('친구 관계가 존재하지 않습니다.');
    } //  근데 이 로직 필요하지 않을수도?

    const socketId = this.socketIdRepository.find(socket.data.userId);
    console.log(socketId);
    if (socketId === undefined) {
      throw new Error('socketId is undefined');
    }
    const socketf = this.server.sockets.sockets.get(socketId.socketId);
    if (socketf === undefined) {
      throw new Error('socket is undefined');
    }
    socketf.emit(`message`, { id: 0, content: `socket is joined in messageRoom${friendId}` });
    console.log('join ', socket.rooms);
    socket.join(`friend-${friendId}`);
    console.log('after join ', socket.rooms);
  }
}
