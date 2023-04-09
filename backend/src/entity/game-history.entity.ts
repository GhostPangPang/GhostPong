import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user.entity';

@Entity()
export class GameHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  winner: User;

  @ManyToOne(() => User)
  loser: User;

  @Column()
  winnerScore: number;

  @Column()
  loserScore: number;

  @Column({ default: () => 'now()' })
  createdAt: Date;
}
