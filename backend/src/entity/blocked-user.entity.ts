import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { User } from './user.entity';

@Entity()
export class BlockedUser {
  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @PrimaryColumn()
  blockedUserId: number;

  @ManyToOne(() => User)
  @JoinColumn()
  blockedUser: User;
}
