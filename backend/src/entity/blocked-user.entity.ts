import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { User } from './user.entity';

@Entity()
export class BlockedUser {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  blockedUserId: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => User)
  @JoinColumn()
  blockedUser: User;
}
