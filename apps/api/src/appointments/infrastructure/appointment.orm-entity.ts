import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { PetOrm } from '../../pets/infrastructure/pet.orm-entity';

@Entity({ name: 'appointments' })
@Index('IDX_appointments_pet_scheduled_at', ['petId', 'dateTime'])
export class AppointmentOrm {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'pet_id', type: 'uuid' })
  petId!: string;

  @ManyToOne(() => PetOrm, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'pet_id' })
  pet!: PetOrm;

  @Column({ name: 'scheduled_at', type: 'timestamptz' })
  dateTime!: Date;

  @Column({ name: 'duration_minutes', type: 'smallint' })
  durationMinutes!: number;

  @Column({ name: 'reason', type: 'varchar', length: 500 })
  reason!: string;

  @Column({ name: 'status', type: 'varchar', length: 20, default: 'scheduled' })
  status!: string;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
