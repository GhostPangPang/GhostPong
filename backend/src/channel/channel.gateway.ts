import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsException } from '@nestjs/websockets';
import { Cache } from 'cache-manager';
import { Socket } from 'socket.io';

import { ChannelRepository } from '../repository/channel.repository';

import ChatDto from './dto/socket/chat.dto';

@WebSocketGateway()
export class ChannelGateway {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly channelRepository: ChannelRepository,
  ) {}

  logger: Logger = new Logger('ChannelGateway');

  @SubscribeMessage('chat')
  async handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data: ChatDto) {
    if ((await this.cacheManager.get(`${data.senderId}`)) !== undefined) {
      return '당신은 뮤트된 유저입니다.';
    }
    const channel = this.channelRepository.find(data.channelId);
    if (channel === undefined) {
      throw new WsException('존재하지 않는 채널입니다.');
    }
    if (channel.users.get(data.senderId) === undefined) {
      throw new WsException('채널에 참여하지 않은 유저입니다.');
    }
    socket.to(data.channelId).emit('chat', data);
  }
}
