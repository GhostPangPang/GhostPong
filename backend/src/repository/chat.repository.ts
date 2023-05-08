import { Injectable } from '@nestjs/common';
import { Repository } from './repository';
import { nanoid } from 'nanoid';

export type ChatMode = 'private' | 'public' | 'protected';
export type ChatRole = 'owner' | 'admin' | 'common';

export class Chat {
  name: string;
  userList: {
    id: number;
    nickname: string;
    image: string;
    isAdmin: boolean;
    isMuted: boolean;
    isPlayer: boolean;
  }[];
  mode: ChatMode = 'public';
  password?: string;
  bannedUserIdList?: number[];
}

@Injectable()
export class ChatRepository implements Repository<Chat, string> {
  private readonly chatList: Map<string, Chat>;

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
    this.chatList.set(id, { ...chat, ...partialChat });
    return chat;
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
