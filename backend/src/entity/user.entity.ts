import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';

import { Achievement } from './achievement.entity';
import { Auth } from './auth.entity';
import { BlockedUser } from './blocked-user.entity';
import { UserRecord } from './user-record.entity';

@Entity({ name: 'users' })
export class User {
  @OneToOne(() => Auth, (auth) => auth.id)
  @JoinColumn({ name: 'id' }) // necessary for one-to-one relationship
  @PrimaryColumn()
  id: number;

  @Column({ length: 8, unique: true })
  nickname: string;

  @Column({ default: 0 })
  exp: number;

  @Column({ type: 'varchar', length: 256, nullable: true })
  image?: string;

  @OneToOne(() => UserRecord, (userRecord) => userRecord.user)
  userRecord: UserRecord;

  @OneToMany(() => BlockedUser, (blockedUser) => blockedUser.user)
  blockedUsers: BlockedUser[];

  @OneToMany(() => Achievement, (achievement) => achievement.user)
  achievements: Achievement[];
}
