import { Column, Entity, ManyToOne, PrimaryColumn, Relation, Unique } from 'typeorm';

import { Friendship } from './friendship.entity';
import { User } from './user.entity';

@Entity()
@Unique(['user', 'friend'])
export class MessageView {
  @ManyToOne(() => User)
  @PrimaryColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Friendship)
  @PrimaryColumn({ name: 'friend_id' })
  friend: Relation<Friendship>;

  @Column({ default: () => "'-infinity'" })
  lastViewTime: Date;
}
