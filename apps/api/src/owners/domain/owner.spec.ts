import { Owner } from './owner';

describe('Owner', () => {
  const data = {
    id: 'a66bdfad-0b10-4b4c-8d61-8c9acddab2c1',
    name: 'Laura',
    lastName: 'Gómez',
    documentNumber: '123456789',
    email: 'laura@example.com',
    phone: '3001234567',
    address: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  it('creates an owner with valid data', () => {
    expect(Owner.create(data).toData()).toEqual(data);
  });

  it('rejects an invalid email address', () => {
    expect(() => Owner.create({ ...data, email: 'invalid-email' })).toThrow('Invalid email address');
  });

  it('rejects a missing document number', () => {
    expect(() => Owner.create({ ...data, documentNumber: ' ' })).toThrow('Document number is required');
  });
});
