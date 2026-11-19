import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { OwnerRepositorio } from '../../propietarios/domain/owner.repository';
import { PetData, PetSpecies, Pet, PetSex } from '../domain/pet';
import { PetRepository } from '../domain/pet.repository';

export interface CrearPet {
  ownerId: string;
  name: string;
  species: PetSpecies;
  breed?: string;
  birthDate?: string;
  sex?: PetSex;
  color?: string;
  pesoKg?: number;
  notas?: string;
}

@Injectable()
export class PetsService {
  constructor(
    @Inject('PetRepository') private readonly repository: PetRepository,
    @Inject('OwnerRepositorio') private readonly propietarios: OwnerRepositorio,
  ) {}

  async create(input: CrearPet): Promise<PetData> {
    const owner = await this.propietarios.findById(input.ownerId);
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
      pesoKg: input.pesoKg ?? null,
      notas: input.notas?.trim() || null,
      createdAt: now,
      updatedAt: now,
    });
    return this.repository.save(pet.obtenerDatos());
  }

  async list(ownerId?: string): Promise<PetData[]> {
    if (ownerId) {
      const owner = await this.propietarios.findById(ownerId);
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

  async update(id: string, input: Partial<CrearPet>): Promise<PetData> {
    const actual = await this.getById(id);
    const ownerId = input.ownerId ?? actual.ownerId;
    if (input.ownerId) {
      const owner = await this.propietarios.findById(ownerId);
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
      pesoKg: input.pesoKg ?? actual.pesoKg,
      notas: input.notas === undefined ? actual.notas : input.notas.trim() || null,
      updatedAt: new Date(),
    }).obtenerDatos());
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await this.repository.delete(id);
  }
}
