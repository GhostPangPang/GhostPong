import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Friendship } from './friendship.entity';
import { User } from './user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  senderId: number;

  @Column()
  friendId: number;

  @Column({ length: 512 })
  content: string;

  @Column({ default: () => 'now()' })
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn()
  sender: User;

  @ManyToOne(() => Friendship, { onDelete: 'CASCADE' })
  @JoinColumn()
  friend: Friendship;
}
