import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { User } from './user.entity';

@Entity()
export class Achievement {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  achievement: number;
}
