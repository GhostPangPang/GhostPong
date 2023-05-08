export type ChatMode = 'private' | 'public' | 'protected';
export type ChatRole = 'owner' | 'admin' | 'common';

export class Chat {
  name: string;
  userList: {
    id: number;
    nickname: string;
    image: string;
    role: ChatRole;
    isMuted: boolean;
    isPlayer: boolean;
  }[];
  mode: ChatMode = 'public';
  password?: string;
  bannedUserIdList?: number[];
}
