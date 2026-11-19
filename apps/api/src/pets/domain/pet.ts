import { ReglaNegocioError } from '../../compartido/domain/regla-negocio.error';

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
    if (!data.name.trim()) throw new ReglaNegocioError('El name de la pet es obligatorio');
    if (!data.ownerId.trim()) throw new ReglaNegocioError('El owner es obligatorio');
    if (data.weightKg !== null && (!Number.isFinite(data.weightKg) || data.weightKg <= 0)) {
      throw new ReglaNegocioError('El weight debe ser un número mayor que cero');
    }
    return new Pet(data);
  }

  toData(): PetData {
    return { ...this.data };
  }
}
