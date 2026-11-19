import { Pet } from './pet';

describe('Pet', () => {
  const data = {
    id: 'a66bdfad-0b10-4b4c-8d61-8c9acddab2c1',
    ownerId: 'b66bdfad-0b10-4b4c-8d61-8c9acddab2c1',
    name: 'Luna',
    species: 'cat' as const,
    breed: null,
    birthDate: null,
    sex: 'female' as const,
    color: 'Blanco',
    weightKg: 4.2,
    notes: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  it('creates a pet with valid data', () => {
    expect(Pet.create(data).toData()).toEqual(data);
  });

  it('rejects a non-positive weight', () => {
    expect(() => Pet.create({ ...data, weightKg: 0 })).toThrow('El weight debe ser un número mayor que cero');
  });
});
