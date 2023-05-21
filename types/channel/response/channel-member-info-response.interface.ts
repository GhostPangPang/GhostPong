export type Role = 'owner' | 'admin' | 'member';

export interface MemberInfo {
  id: number;
  nickname: string;
  image?: string;
  role: Role;
}

export interface ChannelMemberInfoResponse {
  players: MemberInfo[];
  observers: MemberInfo[];
}
