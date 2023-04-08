import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { User } from './user.entity';

@Entity()
export class Achievement {
  @ManyToOne(() => User)
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  achievement: number;
}
