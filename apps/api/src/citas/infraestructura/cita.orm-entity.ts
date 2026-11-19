import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { MascotaOrm } from '../../mascotas/infraestructura/mascota.orm-entity';

@Entity({ name: 'appointments' })
@Index('IDX_appointments_pet_scheduled_at', ['mascotaId', 'fechaHora'])
export class CitaOrm {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'pet_id', type: 'uuid' })
  mascotaId!: string;

  @ManyToOne(() => MascotaOrm, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'pet_id' })
  mascota!: MascotaOrm;

  @Column({ name: 'scheduled_at', type: 'timestamptz' })
  fechaHora!: Date;

  @Column({ name: 'duration_minutes', type: 'smallint' })
  duracionMinutos!: number;

  @Column({ name: 'reason', type: 'varchar', length: 500 })
  motivo!: string;

  @Column({ name: 'status', type: 'varchar', length: 20, default: 'scheduled' })
  estado!: string;

  @Column({ name: 'notes', type: 'text', nullable: true })
  observaciones!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  creadaEn!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  actualizadaEn!: Date;
}
