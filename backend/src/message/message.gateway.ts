import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';

import { corsOption } from '../common/option/cors.option';
import { Friendship } from '../entity/friendship.entity';
import { SocketIdRepository } from '../repository/socket-id.repository';

import { MesssageDto } from './dto/socket/message.dto';

@WebSocketGateway({ cors: corsOption })
export class MessageGateway {
  @WebSocketServer()
  public server: Server;

  constructor(
    private readonly socketIdRepository: SocketIdRepository,
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
  ) {}
  /**
   * events
   */

  /**
   *
   * @param socket
   * @param data
   */
  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data: MesssageDto): void {
    console.log(data.content);
    socket.to(`friend-${data.id}`).emit('message', data);
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
