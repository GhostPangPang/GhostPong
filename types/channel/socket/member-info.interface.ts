export type Role = 'owner' | 'admin' | 'member';

export interface MemberInfo {
  userId: number;
  nickname: string;
  image?: string;
  role: Role;
}
