import { InventoryItem, InventoryMovement } from './inventory.domain';

describe('InventoryItem', () => {
  const item = {
    id: 'item-1',
    name: 'Vacuna antirrábica',
    description: null,
    category: 'Medicamento',
    unit: 'dosis',
    quantity: 0,
    minimumQuantity: 2,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('creates a valid inventory item', () => {
    expect(InventoryItem.create(item).toData()).toEqual(item);
  });

  it('rejects negative stock', () => {
    expect(() => InventoryItem.create({ ...item, quantity: -1 })).toThrow('Stock quantity cannot be negative');
  });

  it('rejects a negative minimum quantity', () => {
    expect(() => InventoryItem.create({ ...item, minimumQuantity: -1 })).toThrow('Minimum stock cannot be negative');
  });
});

describe('InventoryMovement', () => {
  const movement = {
    id: 'movement-1',
    itemId: 'item-1',
    type: 'entry' as const,
    quantity: 5,
    previousQuantity: 0,
    newQuantity: 5,
    reason: 'Compra inicial',
    createdAt: new Date(),
  };

  it('creates a valid movement', () => {
    expect(InventoryMovement.create(movement).toData()).toEqual(movement);
  });

  it('allows an adjustment that sets stock to zero', () => {
    expect(InventoryMovement.create({ ...movement, type: 'adjustment', quantity: 0, previousQuantity: 3, newQuantity: 0 }).toData().newQuantity).toBe(0);
  });

  it('rejects a zero quantity for entries and exits', () => {
    expect(() => InventoryMovement.create({ ...movement, quantity: 0 })).toThrow('Movement quantity is invalid');
  });
});
