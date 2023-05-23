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

import { MUTE_EXPIRES_IN } from '../common/constant';
import { corsOption } from '../common/option/cors.option';
import { createWsException } from '../common/util';
import { ConnectionGateway } from '../connection/connection.gateway';
import { InvisibleChannelRepository, VisibleChannelRepository } from '../repository';
import { Channel } from '../repository/model';

import { ChannelIdDto } from './dto/socket/channelId.dto';
import ChatDto from './dto/socket/chat.dto';
import { OperationDto } from './dto/socket/operation.dto';

@UsePipes(new ValidationPipe({ exceptionFactory: createWsException }))
@WebSocketGateway({ cors: corsOption })
export class ChannelGateway {
  @WebSocketServer()
  public server: Server;

  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private readonly visibleChannelRepository: VisibleChannelRepository,
    private readonly invisibleChannelRepository: InvisibleChannelRepository,
    private readonly connectionGateway: ConnectionGateway,
  ) {}

  logger: Logger = new Logger('ChannelGateway');

  @SubscribeMessage('chat')
  async handleChat(@ConnectedSocket() socket: Socket, @MessageBody() data: ChatDto) {
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

  @SubscribeMessage('mute')
  async handleMute(@ConnectedSocket() socket: Socket, @MessageBody() data: OperationDto) {
    /**
     * - channel 존재여부 확인한다.
     * - socket.data.userId의 role 확인하고 mute 권한이 있는지 확인한다.
     * - target의 채널 존재 여부와 role 확인하고 userId가 target을 mute할 수 있는지 확인
     * - mute 한ㄷㅏ.
     */
    const channel = this.checkExistChannel(data.channelId);
    const user = channel.users.get(socket.data.userId);
    if (user === undefined) {
      throw new WsException('채널에 참여하지 않은 유저입니다.');
    }
    if (user.role === 'member') {
      return { message: '뮤트 권한이 없습니다.' };
    }
    if (data.targetId === socket.data.userId) {
      return { message: '자기 자신은 뮤트할 수 없습니다.' };
    }
    const target = channel.users.get(data.targetId);
    if (target === undefined) {
      throw new WsException('뮤트 대상이 채널에 참여하지 않은 유저입니다.');
    }
    if (target.role === 'owner') {
      return { message: '채널 오너는 뮤트할 수 없습니다.' };
    } // 여기까지 오면 user.role >= target.role
    if (channel.isInGame === true && target.isPlayer === true) {
      return { message: '게임 중인 유저는 뮤트할 수 없습니다.' };
    }
    await this.cacheManager.set(`mute-${data.targetId}`, true, MUTE_EXPIRES_IN);
  }

  /**
   * @summary channel 나가기 event
   */
  @SubscribeMessage('leave-channel')
  handleLeaveChannel(@ConnectedSocket() socket: Socket, @MessageBody() data: ChannelIdDto) {
    const channel = this.checkExistChannel(data.channelId);

    this.connectionGateway.leaveChannel(socket.data.userId, channel, socket);
  }

  /**
   * @summary channel socket room에 join
   */
  joinChannel(socketId: string, channelId: string): void {
    this.server.in(socketId).socketsJoin(channelId);
  }

  /**
   * @summary channel socket room에서 broadcast
   * @param exceptId 제외할 socket id. undefined면 모두에게 broadcast
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
