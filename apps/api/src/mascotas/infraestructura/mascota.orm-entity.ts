import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { PropietarioOrm } from '../../propietarios/infraestructura/propietario.orm-entity';

@Entity({ name: 'pets' })
@Index('IDX_pets_owner_id', ['propietarioId'])
export class MascotaOrm {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'owner_id', type: 'uuid' })
  propietarioId!: string;

  @ManyToOne(() => PropietarioOrm, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'owner_id' })
  propietario!: PropietarioOrm;

  @Column({ name: 'name', type: 'varchar', length: 120 })
  nombre!: string;

  @Column({ name: 'species', type: 'varchar', length: 20 })
  especie!: string;

  @Column({ name: 'breed', type: 'varchar', length: 100, nullable: true })
  raza!: string | null;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  fechaNacimiento!: string | null;

  @Column({ name: 'sex', type: 'varchar', length: 20, default: 'unknown' })
  sexo!: string;

  @Column({ name: 'color', type: 'varchar', length: 80, nullable: true })
  color!: string | null;

  @Column({ name: 'weight_kg', type: 'numeric', precision: 7, scale: 2, nullable: true })
  pesoKg!: number | null;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notas!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  creadoEn!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  actualizadoEn!: Date;
}
