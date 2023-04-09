import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { User } from './user.entity';

@Entity()
export class BlockedUser {
  @ManyToOne(() => User)
  @PrimaryColumn()
  @JoinColumn({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User)
  @PrimaryColumn()
  @JoinColumn({ name: 'blocked_user_id' })
  blockedUserId: number;
}
