import { PetData } from './pet';

export interface PetRepository {
  save(datos: PetData): Promise<PetData>;
  findById(id: string): Promise<PetData | null>;
  list(): Promise<PetData[]>;
  listarPorOwner(ownerId: string): Promise<PetData[]>;
  delete(id: string): Promise<boolean>;
}
