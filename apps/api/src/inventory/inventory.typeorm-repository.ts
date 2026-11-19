import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { InventoryItemData, InventoryMovementData, InventoryMovementType, InventoryRepository } from './inventory.domain';
import { InventoryItemOrm, InventoryMovementOrm } from './inventory.orm-entities';

@Injectable()
export class InventoryTypeOrmRepository implements InventoryRepository {
  constructor(
    @InjectRepository(InventoryItemOrm) private readonly items: Repository<InventoryItemOrm>,
    @InjectRepository(InventoryMovementOrm) private readonly movements: Repository<InventoryMovementOrm>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async createItem(data: InventoryItemData): Promise<InventoryItemData> {
    const entity = this.items.create({
      id: data.id,
      name: data.name,
      description: data.description,
      category: data.category,
      unit: data.unit,
      quantity: data.quantity.toFixed(2),
      minimumQuantity: data.minimumQuantity.toFixed(2),
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
    const saved = await this.items.save(entity);
    return this.toItem(saved);
  }
  async listItems(): Promise<InventoryItemData[]> {
    return (await this.items.find({ where: { isActive: true }, order: { name: 'ASC' } })).map(item => this.toItem(item));
  }
  async findItemById(id: string): Promise<InventoryItemData | null> {
    const item = await this.items.findOne({ where: { id, isActive: true } });
    return item ? this.toItem(item) : null;
  }
  async listMovements(itemId?: string): Promise<InventoryMovementData[]> {
    const records = await this.movements.find({ where: itemId ? { itemId } : {}, order: { createdAt: 'DESC' }, take: 200 });
    return records.map(record => this.toMovement(record));
  }
  async registerMovement(input: { id: string; itemId: string; type: InventoryMovementType; quantity: number; reason: string; createdAt: Date }): Promise<InventoryMovementData> {
    return this.dataSource.transaction(async manager => {
      const itemRepository = manager.getRepository(InventoryItemOrm);
      const movementRepository = manager.getRepository(InventoryMovementOrm);
      const item = await itemRepository.findOne({ where: { id: input.itemId, isActive: true }, lock: { mode: 'pessimistic_write' } });
      if (!item) throw new NotFoundException('Inventory item was not found');
      const previousQuantity = Number(item.quantity);
      let newQuantity = previousQuantity;
      if (input.type === 'entry') newQuantity += input.quantity;
      if (input.type === 'exit') {
        if (input.quantity > previousQuantity) throw new BadRequestException('Insufficient stock for this exit');
        newQuantity -= input.quantity;
      }
      if (input.type === 'adjustment') newQuantity = input.quantity;
      item.quantity = newQuantity.toFixed(2);
      await itemRepository.save(item);
      const movementEntity = movementRepository.create({
        id: input.id,
        itemId: input.itemId,
        type: input.type,
        quantity: input.quantity.toFixed(2),
        previousQuantity: previousQuantity.toFixed(2),
        newQuantity: newQuantity.toFixed(2),
        reason: input.reason,
        createdAt: input.createdAt,
      });
      const savedMovement = await movementRepository.save(movementEntity);
      return this.toMovement(savedMovement);
    });
  }
  private toItem(item: InventoryItemOrm): InventoryItemData {
    return { ...item, quantity: Number(item.quantity), minimumQuantity: Number(item.minimumQuantity) };
  }
  private toMovement(movement: InventoryMovementOrm): InventoryMovementData {
    return { ...movement, quantity: Number(movement.quantity), previousQuantity: Number(movement.previousQuantity), newQuantity: Number(movement.newQuantity) };
  }
}
