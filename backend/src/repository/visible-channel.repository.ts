import { Injectable } from '@nestjs/common';

import { ChannelRepository } from './channel.repository';
import { Channel } from './model/channel';

@Injectable()
export class VisibleChannelRepository extends ChannelRepository {
  findByCursor(cursor: number): Channel[] {
    const channelArray = Array.from(this.channelList.values());
    const endIndex = channelArray.length > cursor * 9 ? channelArray.length - cursor * 9 : 0;
    const startIndex = endIndex > 9 ? endIndex - 9 : 0;
    return channelArray.slice(startIndex, endIndex).reverse();
  }
}
