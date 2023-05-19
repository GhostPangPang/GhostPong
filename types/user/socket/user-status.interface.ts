export type Status = 'online' | 'offline' | 'game';

export interface UserStatus {
  userId: number;
  status: 'online' | 'offline' | 'game';
}
