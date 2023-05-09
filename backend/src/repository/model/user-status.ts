type Status = 'online' | 'offline' | 'game';

export class UserStatus {
  userId: number;
  status: Status = 'online';
}
