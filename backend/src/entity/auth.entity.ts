import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum AuthStatus {
  REGISTERD = 'REGISTERD',
  UNREGISTERD = 'UNREGISTERD',
}

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 320, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  password: string | null;

  @Column({ type: 'varchar', length: 32, unique: true })
  accountId: string | null;

  @Column({ type: 'varchar', length: 320, nullable: true })
  twoFa: string | null;

  @Column({
    type: 'enum',
    enum: AuthStatus,
    default: AuthStatus.UNREGISTERD,
  })
  status: AuthStatus;
}
