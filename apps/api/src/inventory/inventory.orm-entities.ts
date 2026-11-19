import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { InventoryMovementType } from './inventory.domain';

@Entity({ name: 'inventory_items' })
@Index('IDX_inventory_items_name', ['name'])
export class InventoryItemOrm {
  @PrimaryColumn('uuid') id!: string;
  @Column({ type: 'varchar', length: 160 }) name!: string;
  @Column({ type: 'text', nullable: true }) description!: string | null;
  @Column({ type: 'varchar', length: 100 }) category!: string;
  @Column({ type: 'varchar', length: 40 }) unit!: string;
  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 }) quantity!: string;
  @Column({ name: 'minimum_quantity', type: 'numeric', precision: 12, scale: 2, default: 0 }) minimumQuantity!: string;
  @Column({ name: 'is_active', type: 'boolean', default: true }) isActive!: boolean;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt!: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt!: Date;
}

@Entity({ name: 'inventory_movements' })
@Index('IDX_inventory_movements_item_created', ['itemId', 'createdAt'])
export class InventoryMovementOrm {
  @PrimaryColumn('uuid') id!: string;
  @Column({ name: 'item_id', type: 'uuid' }) itemId!: string;
  @ManyToOne(() => InventoryItemOrm, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'item_id' }) item!: InventoryItemOrm;
  @Column({ type: 'varchar', length: 20 }) type!: InventoryMovementType;
  @Column({ type: 'numeric', precision: 12, scale: 2 }) quantity!: string;
  @Column({ name: 'previous_quantity', type: 'numeric', precision: 12, scale: 2 }) previousQuantity!: string;
  @Column({ name: 'new_quantity', type: 'numeric', precision: 12, scale: 2 }) newQuantity!: string;
  @Column({ type: 'varchar', length: 500 }) reason!: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt!: Date;
}
