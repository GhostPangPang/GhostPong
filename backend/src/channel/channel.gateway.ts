import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Cache } from 'cache-manager';
import { Server, Socket } from 'socket.io';

import { corsOption } from '../common/option/cors.option';
import { createWsException } from '../common/util';
import { InvisibleChannelRepository } from '../repository/invisible-channel.repository';
import { Channel } from '../repository/model/channel';
import { SocketIdRepository } from '../repository/socket-id.repository';
import { VisibleChannelRepository } from '../repository/visible-channel.repository';

import { ChannelIdDto } from './dto/socket/channelId.dto';
import ChatDto from './dto/socket/chat.dto';
import { OperationDto } from './dto/socket/operation.dto';

@UsePipes(
  new ValidationPipe({
    exceptionFactory: createWsException,
  }),
)
@WebSocketGateway({ cors: corsOption })
export class ChannelGateway {
  @WebSocketServer()
  public server: Server;

  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private readonly visibleChannelRepository: VisibleChannelRepository,
    private readonly invisibleChannelRepository: InvisibleChannelRepository,
    private readonly socketIdRepository: SocketIdRepository,
  ) {}

  logger: Logger = new Logger('ChannelGateway');

  @SubscribeMessage('chat')
  async handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data: ChatDto) {
    if (data.senderId !== socket.data.userId) {
      throw new WsException('유저 정보가 일치하지 않습니다.');
    }
    if ((await this.cacheManager.get(`mute-${data.senderId}`)) !== undefined) {
      return { message: '당신은 뮤트된 유저입니다.' };
    }
    const channel = this.checkExistChannel(data.channelId);
    if (channel.users.get(data.senderId) === undefined) {
      throw new WsException('채널에 참여하지 않은 유저입니다.');
    }
    socket.to(data.channelId).emit('chat', data);
  }

  /**
   * @summary ban하는 event
   */
  @SubscribeMessage('ban')
  async handleBan(@ConnectedSocket() socket: Socket, @MessageBody() data: OperationDto) {
    const channel = this.checkExistChannel(data.channelId);
    const user = channel.users.get(socket.data.userId);
    if (user === undefined) {
      throw new WsException('채널에 참여하지 않은 유저입니다.');
    }
    if (user.role === 'member') {
      return { message: '밴 권한이 없습니다.' };
    }
    if (data.targetId === socket.data.userId) {
      return { message: '자기 자신은 밴할 수 없습니다.' };
    }
    const target = channel.users.get(data.targetId);
    if (target === undefined) {
      throw new WsException('밴 대상이 채널에 참여하지 않은 유저입니다.');
    }
    if (target.role === 'owner') {
      return { message: '채널 오너는 밴할 수 없습니다.' };
    } // 여기까지 오면 user.role >= target.role
    if (channel.isInGame === true && target.isPlayer === true) {
      return { message: '게임 중인 유저는 밴할 수 없습니다.' };
    }

    channel.users.delete(data.targetId);
    this.cacheManager.del(`mute-${data.targetId}`);
    channel.bannedUserIdList.push(data.targetId);
    this.emitChannel(data.channelId, 'banned', { userId: data.targetId });

    const targetSocketId = this.socketIdRepository.find(data.targetId)?.socketId;
    if (targetSocketId === undefined) {
      throw new WsException('소켓 아이디를 찾을 수 없습니다.');
    }
    this.server.in(targetSocketId).socketsLeave(data.channelId);
  }

  /**
   * @summary channel 나가기 event
   */
  @SubscribeMessage('leave-channel')
  handleLeaveChannel(@ConnectedSocket() socket: Socket, @MessageBody() data: ChannelIdDto) {
    const channel = this.checkExistChannel(data.channelId);

    if (channel.users.delete(socket.data.userId) === false) {
      throw new WsException('채널에 참여하지 않은 유저입니다.');
    }
    if (channel.users.size === 0) {
      if (channel.mode === 'private') {
        this.invisibleChannelRepository.delete(channel.id);
      } else {
        this.visibleChannelRepository.delete(channel.id);
      }
    }
    socket.leave(data.channelId);
    this.emitChannel(data.channelId, 'user-left-channel', {
      userId: socket.data.userId,
    });
  }

  /**
   * @summary channel socket room에 join
   */
  joinChannel(socketId: string, channelId: string): void {
    this.server.in(socketId).socketsJoin(channelId);
  }

  /**
   * @summary channel socket room에서 broadcast
   */
  emitChannel<DataType>(channelId: string, event: string, data: DataType, exceptId?: string): void {
    if (exceptId === undefined) {
      this.server.to(channelId).emit(event, data);
    } else {
      this.server.to(channelId).except(exceptId).emit(event, data);
    }
  }

  /**
   * @summary user 한 명에게 emit
   */
  emitUser<DataType>(socketId: string, event: string, data: DataType): void {
    this.server.to(socketId).emit(event, data);
  }

  /**
   * private
   */
  private checkExistChannel(channelId: string): Channel {
    let channel = this.visibleChannelRepository.find(channelId);
    if (channel === undefined && (channel = this.invisibleChannelRepository.find(channelId)) === undefined) {
      throw new WsException('존재하지 않는 채널입니다.');
    }
    return channel;
  }
}
