import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { User } from './user.entity';

@Entity()
export class MessageView {
  @ManyToOne(() => User)
  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User)
  @PrimaryColumn()
  friendId: number;

  @Column({ default: () => "'-infinity'" })
  lastViewTime: Date;
}
