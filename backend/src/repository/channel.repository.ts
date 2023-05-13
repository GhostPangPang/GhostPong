import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';

import { Channel } from './model/channel';
import { Repository } from './repository.interface';

@Injectable()
export class ChannelRepository implements Repository<string, Channel> {
  private readonly channelList: Map<string, Channel> = new Map<string, Channel>();

  insert(channel: Channel): string {
    const id = nanoid();
    this.channelList.set(id, channel);
    return id;
  }

  update(id: string, partialChannel: Partial<Channel>): Channel | undefined {
    const channel = this.channelList.get(id);
    if (channel === undefined) {
      return undefined;
    }
    const updatedChannel = { ...channel, ...partialChannel };
    this.channelList.set(id, updatedChannel);
    return updatedChannel;
  }

  delete(id: string): boolean {
    return this.channelList.delete(id);
  }

  find(id: string): Channel | undefined {
    return this.channelList.get(id);
  }

  count() {
    return this.channelList.size;
  }
}
