import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user.entity';

@Entity()
export class GameHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  winnerId: number;

  @Column()
  loserId: number;

  @ManyToOne(() => User)
  @JoinColumn()
  winner: User;

  @ManyToOne(() => User)
  @JoinColumn()
  loser: User;

  @Column()
  winnerScore: number;

  @Column()
  loserScore: number;

  @Column({ default: () => 'now()' })
  createdAt: Date;
}
