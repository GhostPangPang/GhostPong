import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';

import { Channel } from '../../repository/model/channel';
import { VisibleChannelRepository } from '../../repository/visible-channel.repository';

@Injectable()
export class CheckChannelIdPipe implements PipeTransform<string, Channel> {
  constructor(private readonly visibleChannelRepository: VisibleChannelRepository) {}
  transform(channelId: string) {
    const channel = this.visibleChannelRepository.find(channelId);
    if (channel === undefined) {
      throw new NotFoundException('존재하지 않는 채널입니다.');
    }
    return channel;
  }
}
