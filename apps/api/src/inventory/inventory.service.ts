import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { InventoryItem, InventoryItemData, InventoryMovement, InventoryMovementData, InventoryMovementType, InventoryRepository } from './inventory.domain';

export interface CreateInventoryItem { name: string; description?: string; category: string; unit: string; minimumQuantity?: number; }
export interface RegisterInventoryMovement { itemId: string; type: InventoryMovementType; quantity: number; reason: string; }

@Injectable()
export class InventoryService {
  constructor(@Inject('InventoryRepository') private readonly repository: InventoryRepository) {}

  async createItem(input: CreateInventoryItem): Promise<InventoryItemData> {
    const now = new Date();
    return this.repository.createItem(InventoryItem.create({
      id: randomUUID(), name: input.name.trim(), description: input.description?.trim() || null,
      category: input.category.trim(), unit: input.unit.trim(), quantity: 0,
      minimumQuantity: input.minimumQuantity ?? 0, isActive: true, createdAt: now, updatedAt: now,
    }).toData());
  }

  listItems(): Promise<InventoryItemData[]> { return this.repository.listItems(); }

  async listMovements(itemId?: string): Promise<InventoryMovementData[]> {
    if (itemId && !(await this.repository.findItemById(itemId))) throw new NotFoundException('Inventory item was not found');
    return this.repository.listMovements(itemId);
  }

  async registerMovement(input: RegisterInventoryMovement): Promise<InventoryMovementData> {
    if (!Number.isFinite(input.quantity) || input.quantity < 0 || (input.type !== 'adjustment' && input.quantity === 0)) {
      throw new BadRequestException('Movement quantity is invalid');
    }
    if (!input.reason.trim()) throw new BadRequestException('Movement reason is required');
    if (!(await this.repository.findItemById(input.itemId))) throw new NotFoundException('Inventory item was not found');
    const result = await this.repository.registerMovement({ ...input, id: randomUUID(), reason: input.reason.trim(), createdAt: new Date() });
    return InventoryMovement.create(result).toData();
  }
}
