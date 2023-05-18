import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';

import { Channel } from './model/channel';
import { Repository } from './repository.interface';

/**
 * public, protected 채널을 관리하는 repository.
 */
@Injectable()
export class ChannelRepository implements Repository<string, Channel> {
  private readonly channelList: Map<string, Channel> = new Map<string, Channel>();

  create(channelOptions: Pick<Channel, 'mode' | 'name' | 'password'>): Channel {
    return new Channel(nanoid(), channelOptions.mode, channelOptions.name, channelOptions.password);
  }

  insert(channel: Channel): string {
    this.channelList.set(channel.id, channel);
    return channel.id;
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

  findAll(): Channel[] {
    return Array.from(this.channelList.values());
  }

  findByCursor(cursor: number): Channel[] {
    const channelArray = Array.from(this.channelList.values());
    const endIndex = channelArray.length > cursor * 9 ? channelArray.length - cursor * 9 : 0;
    const startIndex = endIndex > 9 ? endIndex - 9 : 0;
    return channelArray.slice(startIndex, endIndex).reverse();
  }
}
