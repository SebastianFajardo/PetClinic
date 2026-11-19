import { BusinessRuleError } from '../shared/domain/business-rule.error';

export type InventoryMovementType = 'entry' | 'exit' | 'adjustment';

export interface InventoryItemData {
  id: string; name: string; description: string | null; category: string; unit: string;
  quantity: number; minimumQuantity: number; isActive: boolean; createdAt: Date; updatedAt: Date;
}
export interface InventoryMovementData {
  id: string; itemId: string; type: InventoryMovementType; quantity: number;
  previousQuantity: number; newQuantity: number; reason: string; createdAt: Date;
}
export interface InventoryRepository {
  createItem(data: InventoryItemData): Promise<InventoryItemData>;
  listItems(): Promise<InventoryItemData[]>;
  findItemById(id: string): Promise<InventoryItemData | null>;
  listMovements(itemId?: string): Promise<InventoryMovementData[]>;
  registerMovement(input: { id: string; itemId: string; type: InventoryMovementType; quantity: number; reason: string; createdAt: Date }): Promise<InventoryMovementData>;
}
export class InventoryItem {
  private constructor(private readonly data: InventoryItemData) {}
  static create(data: InventoryItemData): InventoryItem {
    if (!data.name.trim()) throw new BusinessRuleError('Product name is required');
    if (!data.category.trim()) throw new BusinessRuleError('Product category is required');
    if (!data.unit.trim()) throw new BusinessRuleError('Product unit is required');
    if (!Number.isFinite(data.quantity) || data.quantity < 0) throw new BusinessRuleError('Stock quantity cannot be negative');
    if (!Number.isFinite(data.minimumQuantity) || data.minimumQuantity < 0) throw new BusinessRuleError('Minimum stock cannot be negative');
    return new InventoryItem(data);
  }
  toData(): InventoryItemData { return { ...this.data }; }
}
export class InventoryMovement {
  private constructor(private readonly data: InventoryMovementData) {}
  static create(data: InventoryMovementData): InventoryMovement {
    if (!data.itemId.trim()) throw new BusinessRuleError('An inventory item is required');
    if (!['entry', 'exit', 'adjustment'].includes(data.type)) throw new BusinessRuleError('Movement type is invalid');
    if (!Number.isFinite(data.quantity) || data.quantity < 0 || (data.type !== 'adjustment' && data.quantity === 0)) throw new BusinessRuleError('Movement quantity is invalid');
    if (!Number.isFinite(data.previousQuantity) || data.previousQuantity < 0 || !Number.isFinite(data.newQuantity) || data.newQuantity < 0) throw new BusinessRuleError('Stock quantity is invalid');
    if (!data.reason.trim()) throw new BusinessRuleError('Movement reason is required');
    return new InventoryMovement(data);
  }
  toData(): InventoryMovementData { return { ...this.data }; }
}
