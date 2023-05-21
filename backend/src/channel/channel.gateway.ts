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
import { VisibleChannelRepository } from '../repository/visible-channel.repository';

import ChatDto from './dto/socket/chat.dto';

@WebSocketGateway({ cors: corsOption })
export class ChannelGateway {
  @WebSocketServer()
  public server: Server;

  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private readonly visibleChannelRepository: VisibleChannelRepository,
    private readonly invisibleChannelRepository: InvisibleChannelRepository,
  ) {}

  logger: Logger = new Logger('ChannelGateway');

  @UsePipes(
    new ValidationPipe({
      exceptionFactory: createWsException,
    }),
  )
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
