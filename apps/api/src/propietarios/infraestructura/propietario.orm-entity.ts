import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'owners' })
@Index('UQ_owners_document', ['documento'], { unique: true })
@Index('UQ_owners_email', ['correo'], { unique: true })
export class PropietarioOrm {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  nombre!: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  apellido!: string;

  @Column({ name: 'document_number', type: 'varchar', length: 30 })
  documento!: string;

  @Column({ name: 'email', type: 'varchar', length: 180 })
  correo!: string;

  @Column({ name: 'phone', type: 'varchar', length: 30 })
  telefono!: string;

  @Column({ name: 'address', type: 'varchar', length: 250, nullable: true })
  direccion!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  creadoEn!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  actualizadoEn!: Date;
}
