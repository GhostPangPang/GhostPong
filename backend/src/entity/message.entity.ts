import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Friendship } from './friendship.entity';
import { User } from './user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  senderId: number;

  @ManyToOne(() => Friendship)
  friendId: number;

  @Column({ length: 512 })
  contents: string;

  @Column({ default: () => 'now()' })
  createdAt: Date;
}
