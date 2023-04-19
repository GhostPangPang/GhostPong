import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { MessageView } from './message-view.entity';
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

  @OneToMany(() => MessageView, (messageView) => messageView.friend)
  messageView: MessageView[];
}
