import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { OwnerData } from '../domain/owner';
import { OwnerRepository } from '../domain/owner.repository';
import { OwnerOrm } from './owner.orm-entity';

@Injectable()
export class OwnerTypeOrmRepository implements OwnerRepository {
  constructor(@InjectRepository(OwnerOrm) private readonly repository: Repository<OwnerOrm>) {}

  async save(data: OwnerData): Promise<OwnerData> {
    return this.repository.save(this.repository.create(data));
  }

  async findById(id: string): Promise<OwnerData | null> {
    return this.repository.findOne({ where: { id } });
  }

  async list(): Promise<OwnerData[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async existsByDocumentNumber(documentNumber: string, excludedId?: string): Promise<boolean> {
    return this.repository.exists({ where: { documentNumber, ...(excludedId ? { id: Not(excludedId) } : {}) } });
  }

  async existsByEmail(email: string, excludedId?: string): Promise<boolean> {
    return this.repository.exists({ where: { email, ...(excludedId ? { id: Not(excludedId) } : {}) } });
  }
}
