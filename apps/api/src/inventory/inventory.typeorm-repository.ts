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
    return this.toItem(await this.items.save(this.items.create(data)));
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
      const movement = await movementRepository.save(movementRepository.create({
        id: input.id, itemId: input.itemId, type: input.type, quantity: input.quantity,
        previousQuantity, newQuantity, reason: input.reason, createdAt: input.createdAt,
      }));
      return this.toMovement(movement);
    });
  }
  private toItem(item: InventoryItemOrm): InventoryItemData {
    return { ...item, quantity: Number(item.quantity), minimumQuantity: Number(item.minimumQuantity) };
  }
  private toMovement(movement: InventoryMovementOrm): InventoryMovementData {
    return { ...movement, quantity: Number(movement.quantity), previousQuantity: Number(movement.previousQuantity), newQuantity: Number(movement.newQuantity) };
  }
}
