import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { User } from './user.entity';

@Entity()
@Unique(['sender', 'receiver'])
export class Friendship {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  sender: User;

  @ManyToOne(() => User)
  receiver: User;

  @Column({ default: false })
  accept: boolean;

  @Column({
    default: () => "'-infinity'",
  })
  lastMessegeTime: Date;
}
