import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PetRepository } from '../../pets/domain/pet.repository';
import { Appointment, AppointmentData, AppointmentStatus } from '../domain/appointment';
import { AppointmentRepository } from '../domain/appointment.repository';

export interface CreateAppointment {
  petId: string;
  dateTime: string;
  durationMinutes: number;
  reason: string;
  notes?: string;
}

@Injectable()
export class AppointmentsService {
  constructor(
    @Inject('AppointmentRepository') private readonly repository: AppointmentRepository,
    @Inject('PetRepository') private readonly pets: PetRepository,
  ) {}

  async create(input: CreateAppointment): Promise<AppointmentData> {
    await this.validatePet(input.petId);
    const dateTime = new Date(input.dateTime);
    await this.validateAvailability(input.petId, dateTime, input.durationMinutes);
    const now = new Date();
    const appointment = Appointment.create({
      id: randomUUID(),
      petId: input.petId,
      dateTime,
      durationMinutes: input.durationMinutes,
      reason: input.reason.trim(),
      status: 'scheduled',
      notes: input.notes?.trim() || null,
      createdAt: now,
      updatedAt: now,
    });
    return this.repository.save(appointment.toData());
  }

  async list(from?: string, to?: string): Promise<AppointmentData[]> {
    const start = from ? new Date(from) : undefined;
    const end = to ? new Date(to) : undefined;
    if (start && Number.isNaN(start.getTime())) throw new ConflictException('The start date is invalid');
    if (end && Number.isNaN(end.getTime())) throw new ConflictException('The end date is invalid');
    if (start && end && start > end) throw new ConflictException('The start date must be earlier than the end date');
    return this.repository.list(start, end);
  }

  async getById(id: string): Promise<AppointmentData> {
    const appointment = await this.repository.findById(id);
    if (!appointment) throw new NotFoundException('Appointment was not found');
    return appointment;
  }

  async update(id: string, input: Partial<CreateAppointment>): Promise<AppointmentData> {
    const current = await this.getById(id);
    if (!['scheduled', 'confirmed'].includes(current.status)) {
      throw new ConflictException('Only scheduled or confirmed appointments can be edited');
    }
    const petId = input.petId ?? current.petId;
    const dateTime = input.dateTime ? new Date(input.dateTime) : current.dateTime;
    const durationMinutes = input.durationMinutes ?? current.durationMinutes;
    const reason = input.reason === undefined ? current.reason : input.reason.trim();
    const notes = input.notes === undefined ? current.notes : input.notes.trim() || null;
    await this.validatePet(petId);
    await this.validateAvailability(petId, dateTime, durationMinutes, id);
    if (!reason) throw new ConflictException('The appointment reason is required');
    if (!Number.isInteger(durationMinutes) || durationMinutes < 15 || durationMinutes > 240) {
      throw new ConflictException('Duration must be between 15 and 240 minutes');
    }
    return this.repository.save({
      ...current,
      petId,
      dateTime,
      durationMinutes,
      reason,
      notes,
      updatedAt: new Date(),
    });
  }

  async updateStatus(id: string, status: AppointmentStatus): Promise<AppointmentData> {
    const current = await this.getById(id);
    const transitions: Record<AppointmentStatus, AppointmentStatus[]> = {
      scheduled: ['confirmed', 'cancelled', 'no_show'],
      confirmed: ['completed', 'cancelled', 'no_show'],
      completed: [],
      cancelled: [],
      no_show: [],
    };
    if (current.status !== status && !transitions[current.status].includes(status)) {
      throw new ConflictException('The requested status transition is not allowed');
    }
    return this.repository.save({ ...current, status, updatedAt: new Date() });
  }

  private async validatePet(petId: string): Promise<void> {
    if (!(await this.pets.findById(petId))) {
      throw new NotFoundException('Pet was not found');
    }
  }

  private async validateAvailability(petId: string, start: Date, durationMinutes: number, excludedId?: string): Promise<void> {
    if (Number.isNaN(start.getTime())) throw new ConflictException('The appointment date is invalid');
    const end = new Date(start.getTime() + durationMinutes * 60_000);
    if (await this.repository.hasOverlap(petId, start, end, excludedId)) {
      throw new ConflictException('The pet already has an appointment scheduled for that time');
    }
  }
}
