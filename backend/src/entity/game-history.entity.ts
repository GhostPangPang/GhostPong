import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user.entity';

@Entity()
export class GameHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  winnerId: number;

  @ManyToOne(() => User)
  loserId: number;

  @Column()
  winnerScore: number;

  @Column()
  loserScore: number;

  @Column({ default: () => 'now()' })
  createdAt: Date;
}
