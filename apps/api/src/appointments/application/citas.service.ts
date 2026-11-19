import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { MascotaRepositorio } from '../../mascotas/domain/mascota.repository';
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
    @Inject('MascotaRepositorio') private readonly mascotas: MascotaRepositorio,
  ) {}

  async create(input: CreateAppointment): Promise<AppointmentData> {
    await this.validarMascota(input.petId);
    const dateTime = new Date(input.dateTime);
    const duration = input.durationMinutes;
    await this.validateAvailability(input.petId, dateTime, duration);
    const now = new Date();
    const appointment = Appointment.create({
      id: randomUUID(),
      petId: input.petId,
      dateTime,
      durationMinutes: duration,
      reason: input.reason.trim(),
      status: 'scheduled',
      notes: input.notes?.trim() || null,
      createdAt: now,
      updatedAt: now,
    });
    return this.repository.save(appointment.obtenerDatos());
  }

  async list(from?: string, to?: string): Promise<AppointmentData[]> {
    const start = from ? new Date(from) : undefined;
    const end = to ? new Date(to) : undefined;
    if (start && Number.isNaN(start.getTime())) throw new ConflictException('La fecha inicial no es válida');
    if (end && Number.isNaN(end.getTime())) throw new ConflictException('La fecha final no es válida');
    if (start && end && start > end) throw new ConflictException('La fecha inicial debe ser anterior a la fecha final');
    return this.repository.list(start, end);
  }

  async getById(id: string): Promise<AppointmentData> {
    const appointment = await this.repository.findById(id);
    if (!appointment) throw new NotFoundException('No se encontró la appointment');
    return appointment;
  }

  async updateStatus(id: string, status: AppointmentStatus): Promise<AppointmentData> {
    const actual = await this.getById(id);
    const transiciones: Record<AppointmentStatus, AppointmentStatus[]> = {
      scheduled: ['confirmed', 'cancelled', 'no_show'],
      confirmed: ['completed', 'cancelled', 'no_show'],
      completed: [],
      cancelled: [],
      no_show: [],
    };
    if (actual.status !== status && !transiciones[actual.status].includes(status)) {
      throw new ConflictException('La transición de status solicitada no está permitida');
    }
    return this.repository.save({ ...actual, status, updatedAt: new Date() });
  }

  private async validarMascota(petId: string): Promise<void> {
    if (!(await this.mascotas.findById(petId))) {
      throw new NotFoundException('No se encontró la mascota asociada');
    }
  }

  private async validateAvailability(petId: string, start: Date, durationMinutes: number, excludedId?: string): Promise<void> {
    if (Number.isNaN(start.getTime())) throw new ConflictException('La fecha de la appointment no es válida');
    const end = new Date(start.getTime() + durationMinutes * 60_000);
    if (await this.repository.hasOverlap(petId, start, end, excludedId)) {
      throw new ConflictException('La mascota ya tiene una appointment en ese horario');
    }
  }
}
