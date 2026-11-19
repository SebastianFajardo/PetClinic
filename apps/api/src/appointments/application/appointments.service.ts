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
