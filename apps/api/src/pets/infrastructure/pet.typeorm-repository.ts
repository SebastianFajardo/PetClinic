import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PetData } from '../domain/pet';
import { PetRepository } from '../domain/pet.repository';
import { PetOrm } from './pet.orm-entity';

@Injectable()
export class PetTypeOrmRepository implements PetRepository {
  constructor(@InjectRepository(PetOrm) private readonly repository: Repository<PetOrm>) {}

  async save(data: PetData): Promise<PetData> {
    return this.repository.save(this.repository.create(data));
  }

  async findById(id: string): Promise<PetData | null> {
    return this.repository.findOne({ where: { id } });
  }

  async list(): Promise<PetData[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  async listByOwner(ownerId: string): Promise<PetData[]> {
    return this.repository.find({ where: { ownerId }, order: { createdAt: 'DESC' } });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
