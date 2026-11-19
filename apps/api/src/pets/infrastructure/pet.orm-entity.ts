import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { OwnerOrm } from '../../owners/infrastructure/owner.orm-entity';

@Entity({ name: 'pets' })
@Index('IDX_pets_owner_id', ['ownerId'])
export class PetOrm {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'owner_id', type: 'uuid' })
  ownerId!: string;

  @ManyToOne(() => OwnerOrm, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'owner_id' })
  owner!: OwnerOrm;

  @Column({ name: 'name', type: 'varchar', length: 120 })
  name!: string;

  @Column({ name: 'species', type: 'varchar', length: 20 })
  species!: string;

  @Column({ name: 'breed', type: 'varchar', length: 100, nullable: true })
  breed!: string | null;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate!: string | null;

  @Column({ name: 'sex', type: 'varchar', length: 20, default: 'unknown' })
  sex!: string;

  @Column({ name: 'color', type: 'varchar', length: 80, nullable: true })
  color!: string | null;

  @Column({ name: 'weight_kg', type: 'numeric', precision: 7, scale: 2, nullable: true })
  weightKg!: number | null;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
