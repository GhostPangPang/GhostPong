import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { User } from './user.entity';

@Entity()
export class Achievement {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  achievement: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
}
