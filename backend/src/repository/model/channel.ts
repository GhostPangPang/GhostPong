export type ChannelMode = 'private' | 'public' | 'protected';
export type ChannelRole = 'owner' | 'admin' | 'common';

export class Channel {
  name: string;
  userList: {
    id: number;
    nickname: string;
    image: string;
    role: ChannelRole;
    isMuted: boolean;
    isPlayer: boolean;
  }[];
  mode: ChannelMode = 'public';
  password?: string;
  bannedUserIdList?: number[];
}
