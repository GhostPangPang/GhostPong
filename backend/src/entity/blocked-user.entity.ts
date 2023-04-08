import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { User } from './user.entity';

@Entity()
export class BlockedUser {
  @ManyToOne(() => User)
  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User)
  @PrimaryColumn()
  blockedUserId: number;
}
