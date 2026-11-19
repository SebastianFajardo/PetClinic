import { OwnerData } from './owner';

export interface OwnerRepository {
  save(datos: OwnerData): Promise<OwnerData>;
  findById(id: string): Promise<OwnerData | null>;
  list(): Promise<OwnerData[]>;
  delete(id: string): Promise<boolean>;
  existsByDocumentNumber(documentNumber: string, excludedId?: string): Promise<boolean>;
  existsByEmail(email: string, excludedId?: string): Promise<boolean>;
}
