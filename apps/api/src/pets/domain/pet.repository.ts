import { PetData } from './pet';

export interface PetRepository {
  save(data: PetData): Promise<PetData>;
  findById(id: string): Promise<PetData | null>;
  list(): Promise<PetData[]>;
  listByOwner(ownerId: string): Promise<PetData[]>;
  delete(id: string): Promise<boolean>;
}
