import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { User } from './user.entity';

@Entity()
export class UserRecord {
  @PrimaryColumn()
  id: number;

  @Column({ default: 0 })
  winCount: number;

  @Column({ default: 0 })
  loseCount: number;

  @OneToOne(() => User, (user) => user.userRecord)
  @JoinColumn({ name: 'id' })
  user: User;
}
