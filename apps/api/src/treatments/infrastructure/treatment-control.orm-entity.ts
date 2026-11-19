import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { TreatmentOrm } from './treatment.orm-entity';

@Entity({ name: 'treatment_controls' })
export class TreatmentControlOrm {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'treatment_id', type: 'uuid' })
  treatmentId!: string;

  @ManyToOne(() => TreatmentOrm, treatment => treatment.controls, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'treatment_id' })
  treatment!: TreatmentOrm;

  @Column({ name: 'control_date', type: 'timestamptz' })
  controlDate!: Date;

  @Column({ name: 'observations', type: 'text' })
  observations!: string;

  @Column({ name: 'outcome', type: 'text' })
  outcome!: string;

  @Column({ name: 'next_control_at', type: 'timestamptz', nullable: true })
  nextControlAt!: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
