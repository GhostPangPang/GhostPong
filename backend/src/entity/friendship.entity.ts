import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user.entity';

@Entity()
export class Friendship {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  senderId: number;

  @ManyToOne(() => User)
  receiverId: number;

  @Column({ default: false })
  accept: boolean;

  @Column({
    default: () => "'-infinity'",
  })
  lastMessegeTime: Date;
}
