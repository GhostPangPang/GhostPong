import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { Auth } from './auth.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn()
  @OneToOne(() => Auth, (auth) => auth.id)
  @JoinColumn() // necessary for one-to-one relationship
  id: number;

  @Column({ length: 8 })
  nickname: string;

  @Column({ default: 0 })
  exp: number;

  @Column({ length: 256 })
  image: string;
}
