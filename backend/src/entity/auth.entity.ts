import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum AuthStatus {
  REGISTERD = 'REGISTERD',
  UNREGISTERD = 'UNREGISTERD',
}

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 320, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 320, nullable: true })
  twoFa: string | null;

  @Column({
    type: 'enum',
    enum: AuthStatus,
    default: AuthStatus.UNREGISTERD,
  })
  status: AuthStatus;
}
