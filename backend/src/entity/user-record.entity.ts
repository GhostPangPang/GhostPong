import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { User } from './user.entity';

@Entity()
export class UserRecord {
  @OneToOne(() => User)
  @JoinColumn({ name: 'id' })
  @PrimaryColumn()
  id: number;

  @Column({ default: 0 })
  winCount: number;

  @Column({ default: 0 })
  loseCount: number;
}
