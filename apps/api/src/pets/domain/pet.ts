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
  private constructor(private readonly datos: PetData) {}

  static create(datos: PetData): Pet {
    if (!datos.name.trim()) throw new ReglaNegocioError('El name de la pet es obligatorio');
    if (!datos.ownerId.trim()) throw new ReglaNegocioError('El owner es obligatorio');
    if (datos.weightKg !== null && (!Number.isFinite(datos.weightKg) || datos.weightKg <= 0)) {
      throw new ReglaNegocioError('El weight debe ser un número mayor que cero');
    }
    return new Pet(datos);
  }

  toData(): PetData {
    return { ...this.datos };
  }
}
