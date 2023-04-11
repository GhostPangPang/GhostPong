import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { Auth } from './auth.entity';

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

  @Column({ length: 256 })
  image: string;
}
