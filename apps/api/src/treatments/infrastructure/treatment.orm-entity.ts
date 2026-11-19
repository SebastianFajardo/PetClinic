import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { PetOrm } from '../../pets/infrastructure/pet.orm-entity';
import { TreatmentStatus } from '../domain/treatment';
import { TreatmentControlOrm } from './treatment-control.orm-entity';

@Entity({ name: 'treatments' })
@Index('IDX_treatments_pet_start_date', ['petId', 'startDate'])
export class TreatmentOrm {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'pet_id', type: 'uuid' })
  petId!: string;

  @ManyToOne(() => PetOrm, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'pet_id' })
  pet!: PetOrm;

  @Column({ name: 'medical_record_id', type: 'uuid', nullable: true })
  medicalRecordId!: string | null;

  @Column({ name: 'veterinarian_name', type: 'varchar', length: 160 })
  veterinarianName!: string;

  @Column({ name: 'name', type: 'varchar', length: 160 })
  name!: string;

  @Column({ name: 'description', type: 'text' })
  description!: string;

  @Column({ name: 'medication', type: 'varchar', length: 160, nullable: true })
  medication!: string | null;

  @Column({ name: 'dosage', type: 'varchar', length: 120, nullable: true })
  dosage!: string | null;

  @Column({ name: 'frequency', type: 'varchar', length: 120, nullable: true })
  frequency!: string | null;

  @Column({ name: 'start_date', type: 'date' })
  startDate!: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate!: Date | null;

  @Column({ name: 'status', type: 'varchar', length: 20, default: 'active' })
  status!: TreatmentStatus;

  @Column({ name: 'next_control_at', type: 'timestamptz', nullable: true })
  nextControlAt!: Date | null;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes!: string | null;

  @OneToMany(() => TreatmentControlOrm, control => control.treatment)
  controls!: TreatmentControlOrm[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
