import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';

import { Chat } from './model/chat';
import { Repository } from './repository.interface';

@Injectable()
export class ChatRepository implements Repository<string, Chat> {
  private readonly chatList: Map<string, Chat> = new Map<string, Chat>();

  insert(chat: Chat): string {
    const id = nanoid();
    this.chatList.set(id, chat);
    return id;
  }

  update(id: string, partialChat: Partial<Chat>): Chat | undefined {
    const chat = this.chatList.get(id);
    if (chat === undefined) {
      return undefined;
    }
    const updatedChat = { ...chat, ...partialChat };
    this.chatList.set(id, updatedChat);
    return updatedChat;
  }

  delete(id: string): boolean {
    return this.chatList.delete(id);
  }

  find(id: string): Chat | undefined {
    return this.chatList.get(id);
  }

  count() {
    return this.chatList.size;
  }
}
