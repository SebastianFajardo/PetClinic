import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { OwnerRepository } from '../../owners/domain/owner.repository';
import { PetData, PetSpecies, Pet, PetSex } from '../domain/pet';
import { PetRepository } from '../domain/pet.repository';

export interface CreatePet {
  ownerId: string;
  name: string;
  species: PetSpecies;
  breed?: string;
  birthDate?: string;
  sex?: PetSex;
  color?: string;
  weightKg?: number;
  notes?: string;
}

@Injectable()
export class PetsService {
  constructor(
    @Inject('PetRepository') private readonly repository: PetRepository,
    @Inject('OwnerRepository') private readonly owners: OwnerRepository,
  ) {}

  async create(input: CreatePet): Promise<PetData> {
    const owner = await this.owners.findById(input.ownerId);
    if (!owner) throw new NotFoundException('No se encontró el owner asociado');
    const now = new Date();
    const pet = Pet.create({
      id: randomUUID(),
      ownerId: input.ownerId,
      name: input.name.trim(),
      species: input.species,
      breed: input.breed?.trim() || null,
      birthDate: input.birthDate ?? null,
      sex: input.sex ?? 'unknown',
      color: input.color?.trim() || null,
      weightKg: input.weightKg ?? null,
      notes: input.notes?.trim() || null,
      createdAt: now,
      updatedAt: now,
    });
    return this.repository.save(pet.toData());
  }

  async list(ownerId?: string): Promise<PetData[]> {
    if (ownerId) {
      const owner = await this.owners.findById(ownerId);
      if (!owner) throw new NotFoundException('No se encontró el owner');
      return this.repository.listarPorOwner(ownerId);
    }
    return this.repository.list();
  }

  async getById(id: string): Promise<PetData> {
    const pet = await this.repository.findById(id);
    if (!pet) throw new NotFoundException('No se encontró la pet');
    return pet;
  }

  async update(id: string, input: Partial<CreatePet>): Promise<PetData> {
    const actual = await this.getById(id);
    const ownerId = input.ownerId ?? actual.ownerId;
    if (input.ownerId) {
      const owner = await this.owners.findById(ownerId);
      if (!owner) throw new NotFoundException('No se encontró el owner asociado');
    }
    return this.repository.save(Pet.create({
      ...actual,
      ownerId,
      name: input.name?.trim() ?? actual.name,
      species: input.species ?? actual.species,
      breed: input.breed === undefined ? actual.breed : input.breed.trim() || null,
      birthDate: input.birthDate ?? actual.birthDate,
      sex: input.sex ?? actual.sex,
      color: input.color === undefined ? actual.color : input.color.trim() || null,
      weightKg: input.weightKg ?? actual.weightKg,
      notes: input.notes === undefined ? actual.notes : input.notes.trim() || null,
      updatedAt: new Date(),
    }).toData());
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await this.repository.delete(id);
  }
}
