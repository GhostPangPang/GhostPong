export type ChannelMode = 'private' | 'public' | 'protected';
export type ChannelRole = 'owner' | 'admin' | 'member';
export class ChannelUser {
  constructor(role: ChannelRole, id: number, nickname: string, image?: string) {
    this.id = id;
    this.nickname = nickname;
    this.image = image;
    this.role = role;
    this.isPlayer = role === 'owner' ? true : false;
  }

  id: number;
  nickname: string;
  image?: string;
  role: ChannelRole;
  isMuted = false;
  isPlayer: boolean;
}

export class Channel {
  constructor(id: string, mode: ChannelMode, name: string, password?: string) {
    this.id = id;
    this.mode = mode;
    this.name = name;
    this.password = password;
    this.users = new Map<number, ChannelUser>();
    this.bannedUserIdList = [];
  }

  id: string;
  name: string;
  mode: ChannelMode;
  password?: string;
  users: Map<number, ChannelUser>;
  bannedUserIdList: number[];
}
