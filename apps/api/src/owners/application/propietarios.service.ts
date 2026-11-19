import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { OwnerData, Owner } from '../domain/owner';
import { OwnerRepository } from '../domain/owner.repository';

export interface CrearOwner {
  name: string;
  lastName: string;
  documentNumber: string;
  email: string;
  phone: string;
  address?: string;
}

@Injectable()
export class OwnersService {
  constructor(@Inject('OwnerRepository') private readonly repository: OwnerRepository) {}

  async create(input: CrearOwner): Promise<OwnerData> {
    const documentNumber = input.documentNumber.trim();
    const email = input.email.trim().toLowerCase();
    await this.validateUniqueness(documentNumber, email);
    const now = new Date();
    const owner = Owner.create({
      id: randomUUID(),
      name: input.name.trim(),
      lastName: input.lastName.trim(),
      documentNumber,
      email,
      phone: input.phone.trim(),
      address: input.address?.trim() || null,
      createdAt: now,
      updatedAt: now,
    });
    return this.repository.save(owner.obtenerDatos());
  }

  async list(): Promise<OwnerData[]> {
    return this.repository.list();
  }

  async getById(id: string): Promise<OwnerData> {
    const owner = await this.repository.findById(id);
    if (!owner) throw new NotFoundException('No se encontró el owner');
    return owner;
  }

  async update(id: string, input: Partial<CrearOwner>): Promise<OwnerData> {
    const actual = await this.getById(id);
    const documentNumber = input.documentNumber?.trim() ?? actual.documentNumber;
    const email = input.email?.trim().toLowerCase() ?? actual.email;
    await this.validateUniqueness(documentNumber, email, id);
    const actualizado = Owner.create({
      ...actual,
      name: input.name?.trim() ?? actual.name,
      lastName: input.lastName?.trim() ?? actual.lastName,
      documentNumber,
      email,
      phone: input.phone?.trim() ?? actual.phone,
      address: input.address === undefined ? actual.address : input.address.trim() || null,
      updatedAt: new Date(),
    }).obtenerDatos();
    return this.repository.save(actualizado);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await this.repository.delete(id);
  }

  private async validateUniqueness(documentNumber: string, email: string, excluirId?: string): Promise<void> {
    if (await this.repository.existsByDocumentNumber(documentNumber, excluirId)) {
      throw new ConflictException('Ya existe un owner con ese documentNumber');
    }
    if (await this.repository.existsByEmail(email, excluirId)) {
      throw new ConflictException('Ya existe un owner con ese email');
    }
  }
}
