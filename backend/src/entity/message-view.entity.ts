import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { Friendship } from './friendship.entity';
import { User } from './user.entity';

@Entity()
export class MessageView {
  @ManyToOne(() => User)
  @PrimaryColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User)
  @PrimaryColumn({ name: 'friend_id' })
  friend: Friendship;

  @Column({ default: () => "'-infinity'" })
  lastViewTime: Date;
}
