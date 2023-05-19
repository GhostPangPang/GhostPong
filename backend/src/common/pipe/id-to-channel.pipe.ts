import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';

import { InvisibleChannelRepository } from '../../repository/invisible-channel.repository';
import { Channel } from '../../repository/model/channel';
import { VisibleChannelRepository } from '../../repository/visible-channel.repository';

@Injectable()
export class IdToChannelPipe implements PipeTransform<string, Channel> {
  constructor(
    private readonly visibleChannelRepository: VisibleChannelRepository,
    private readonly invisibleChannelRepository: InvisibleChannelRepository,
  ) {}
  transform(channelId: string) {
    let channel = this.visibleChannelRepository.find(channelId);
    if (channel === undefined) {
      channel = this.invisibleChannelRepository.find(channelId);
      if (channel === undefined) {
        throw new NotFoundException('존재하지 않는 채널입니다.');
      }
    }
    return channel;
  }
}
