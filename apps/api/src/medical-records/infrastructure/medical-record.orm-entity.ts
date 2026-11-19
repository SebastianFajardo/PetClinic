import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PetOrm } from '../../pets/infrastructure/pet.orm-entity';

@Entity({ name: 'medical_records' })
@Index('IDX_medical_records_pet_recorded_at', ['petId', 'recordedAt'])
export class MedicalRecordOrm {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'pet_id', type: 'uuid' })
  petId!: string;

  @ManyToOne(() => PetOrm, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'pet_id' })
  pet!: PetOrm;

  @Column({ name: 'veterinarian_name', type: 'varchar', length: 160 })
  veterinarianName!: string;

  @Column({ name: 'reason', type: 'varchar', length: 500 })
  reason!: string;

  @Column({ name: 'symptoms', type: 'text' })
  symptoms!: string;

  @Column({ name: 'diagnosis', type: 'text' })
  diagnosis!: string;

  @Column({ name: 'treatment', type: 'text' })
  treatment!: string;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes!: string | null;

  @Column({ name: 'recorded_at', type: 'timestamptz' })
  recordedAt!: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
