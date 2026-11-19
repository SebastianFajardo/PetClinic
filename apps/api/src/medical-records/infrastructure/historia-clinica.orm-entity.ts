import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PetOrm } from '../../pets/infrastructure/pet.orm-entity';

@Entity({ name: 'medical_records' })
@Index('IDX_medical_records_pet_recorded_at', ['mascotaId', 'registradaEn'])
export class MedicalRecordOrm {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'pet_id', type: 'uuid' })
  mascotaId!: string;

  @ManyToOne(() => PetOrm, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'pet_id' })
  pet!: PetOrm;

  @Column({ name: 'veterinarian_name', type: 'varchar', length: 160 })
  nombreVeterinario!: string;

  @Column({ name: 'reason', type: 'varchar', length: 500 })
  motivoConsulta!: string;

  @Column({ name: 'symptoms', type: 'text' })
  sintomas!: string;

  @Column({ name: 'diagnosis', type: 'text' })
  diagnostico!: string;

  @Column({ name: 'treatment', type: 'text' })
  tratamiento!: string;

  @Column({ name: 'notes', type: 'text', nullable: true })
  observaciones!: string | null;

  @Column({ name: 'recorded_at', type: 'timestamptz' })
  registradaEn!: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
