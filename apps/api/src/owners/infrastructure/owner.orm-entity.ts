import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'owners' })
@Index('UQ_owners_document', ['documentNumber'], { unique: true })
@Index('UQ_owners_email', ['email'], { unique: true })
export class OwnerOrm {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  name!: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName!: string;

  @Column({ name: 'document_number', type: 'varchar', length: 30 })
  documentNumber!: string;

  @Column({ name: 'email', type: 'varchar', length: 180 })
  email!: string;

  @Column({ name: 'phone', type: 'varchar', length: 30 })
  phone!: string;

  @Column({ name: 'address', type: 'varchar', length: 250, nullable: true })
  address!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
