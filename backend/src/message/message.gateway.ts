import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';

import { corsOption } from '../common/option/cors.option';
import { Friendship } from '../entity/friendship.entity';
import { MessageView } from '../entity/message-view.entity';
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
    // const userId = this.socketIdRepository.findBySocketId(socket.id);
    // if (userId === undefined) {
    //   throw new Error('userId is undefined');
    // }a
    await this.messageViewRepository.insert({
      user: { id: socket.data.myId }, // 사용자 ID를 MessageView의 user 필드에 저장
      friend: { id: data.friendId }, // 친구 ID를 MessageView의 friend 필드에 저장
      lastViewTime: data.lastViewTime,
    });
    socket.leave(`friend-${data.friendId}`);
  }

  /**
   * methods
   */

  async joinMessageRoom(userId: number, friendId: number): Promise<void> {
    const friendship = await this.friendshipRepository.findOneBy({ id: friendId, accept: true });
    if (friendship === null) {
      throw new Error('친구 관계가 존재하지 않습니다.');
    } //  근데 이 로직 필요하지 않을수도?

    const socketId = this.socketIdRepository.find(userId);
    if (socketId === undefined) {
      throw new Error('socketId is undefined');
    }
    const socket = this.server.sockets.sockets.get(socketId.socketId);
    if (socket === undefined) {
      throw new Error('socket is undefined');
    }
    socket.emit(`message`, `socket is joined in messageRoom${friendId}}`);
    socket.join(`friend-${friendId}`);
  }
}
