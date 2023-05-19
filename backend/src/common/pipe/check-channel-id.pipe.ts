import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';

import { Channel } from 'src/repository/model/channel';

import { ChannelRepository } from '../../repository/channel.repository';

@Injectable()
export class CheckChannelIdPipe implements PipeTransform<string, Channel> {
  constructor(private readonly channelRepository: ChannelRepository) {}
  transform(channelId: string) {
    const channel = this.channelRepository.find(channelId);
    if (channel === undefined) {
      throw new NotFoundException('존재하지 않는 채널입니다.');
    }
    return channel;
  }
}
