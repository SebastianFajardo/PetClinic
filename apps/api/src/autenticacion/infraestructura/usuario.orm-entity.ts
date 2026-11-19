import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { RolUsuario } from '../dominio/usuario';

@Entity({ name: 'users' })
@Index('UQ_users_email', ['correo'], { unique: true })
export class UsuarioOrm {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'full_name', type: 'varchar', length: 160 })
  nombre!: string;

  @Column({ name: 'email', type: 'varchar', length: 180 })
  correo!: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255, select: false })
  contrasenaHash!: string;

  @Column({ name: 'role', type: 'varchar', length: 30 })
  rol!: RolUsuario;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  activo!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  creadoEn!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  actualizadoEn!: Date;
}
