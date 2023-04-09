import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user.entity';

export enum AuthStatus {
  REGISTERD = 'REGISTERD',
  UNREGISTERD = 'UNREGISTERD',
}

@Entity()
export class Auth {
  @OneToOne(() => User, (user) => user.id)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 320 })
  email: string;

  @Column({ length: 320, nullable: true })
  twoFa: string;

  @Column({
    type: 'enum',
    enum: AuthStatus,
    default: AuthStatus.UNREGISTERD,
  })
  status: AuthStatus;
}
