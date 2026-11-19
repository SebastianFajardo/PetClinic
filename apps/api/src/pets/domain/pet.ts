import { BusinessRuleError } from '../../shared/domain/business-rule.error';

export type PetSpecies = 'dog' | 'cat' | 'bird' | 'other';
export type PetSex = 'male' | 'female' | 'unknown';

export interface PetData {
  id: string;
  ownerId: string;
  name: string;
  species: PetSpecies;
  breed: string | null;
  birthDate: string | null;
  sex: PetSex;
  color: string | null;
  weightKg: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Pet {
  private constructor(private readonly data: PetData) {}

  static create(data: PetData): Pet {
    if (!data.name.trim()) throw new BusinessRuleError('Pet name is required');
    if (!data.ownerId.trim()) throw new BusinessRuleError('Owner is required');
    if (data.weightKg !== null && (!Number.isFinite(data.weightKg) || data.weightKg <= 0)) {
      throw new BusinessRuleError('Weight must be greater than zero');
    }
    return new Pet(data);
  }

  toData(): PetData {
    return { ...this.data };
  }
}
