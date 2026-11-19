import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { UserRole } from '../domain/user';

@Entity({ name: 'users' })
@Index('UQ_users_email', ['email'], { unique: true })
export class UserOrm {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'full_name', type: 'varchar', length: 160 })
  name!: string;

  @Column({ name: 'email', type: 'varchar', length: 180 })
  email!: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255, select: false })
  passwordHash!: string;

  @Column({ name: 'role', type: 'varchar', length: 30 })
  role!: UserRole;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
