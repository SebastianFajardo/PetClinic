import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { MascotaRepositorio } from '../../mascotas/dominio/mascota.repositorio';
import { Cita, DatosCita, EstadoCita } from '../dominio/cita';
import { CitaRepositorio } from '../dominio/cita.repositorio';

export interface CrearCita {
  mascotaId: string;
  fechaHora: string;
  duracionMinutos: number;
  motivo: string;
  observaciones?: string;
}

@Injectable()
export class CitasServicio {
  constructor(
    @Inject('CitaRepositorio') private readonly repositorio: CitaRepositorio,
    @Inject('MascotaRepositorio') private readonly mascotas: MascotaRepositorio,
  ) {}

  async crear(entrada: CrearCita): Promise<DatosCita> {
    await this.validarMascota(entrada.mascotaId);
    const fechaHora = new Date(entrada.fechaHora);
    const duracion = entrada.duracionMinutos;
    await this.validarDisponibilidad(entrada.mascotaId, fechaHora, duracion);
    const ahora = new Date();
    const cita = Cita.crear({
      id: randomUUID(),
      mascotaId: entrada.mascotaId,
      fechaHora,
      duracionMinutos: duracion,
      motivo: entrada.motivo.trim(),
      estado: 'scheduled',
      observaciones: entrada.observaciones?.trim() || null,
      creadaEn: ahora,
      actualizadaEn: ahora,
    });
    return this.repositorio.guardar(cita.obtenerDatos());
  }

  async listar(desde?: string, hasta?: string): Promise<DatosCita[]> {
    const inicio = desde ? new Date(desde) : undefined;
    const fin = hasta ? new Date(hasta) : undefined;
    if (inicio && Number.isNaN(inicio.getTime())) throw new ConflictException('La fecha inicial no es válida');
    if (fin && Number.isNaN(fin.getTime())) throw new ConflictException('La fecha final no es válida');
    if (inicio && fin && inicio > fin) throw new ConflictException('La fecha inicial debe ser anterior a la fecha final');
    return this.repositorio.listar(inicio, fin);
  }

  async obtener(id: string): Promise<DatosCita> {
    const cita = await this.repositorio.buscarPorId(id);
    if (!cita) throw new NotFoundException('No se encontró la cita');
    return cita;
  }

  async cambiarEstado(id: string, estado: EstadoCita): Promise<DatosCita> {
    const actual = await this.obtener(id);
    const transiciones: Record<EstadoCita, EstadoCita[]> = {
      scheduled: ['confirmed', 'cancelled', 'no_show'],
      confirmed: ['completed', 'cancelled', 'no_show'],
      completed: [],
      cancelled: [],
      no_show: [],
    };
    if (actual.estado !== estado && !transiciones[actual.estado].includes(estado)) {
      throw new ConflictException('La transición de estado solicitada no está permitida');
    }
    return this.repositorio.guardar({ ...actual, estado, actualizadaEn: new Date() });
  }

  private async validarMascota(mascotaId: string): Promise<void> {
    if (!(await this.mascotas.buscarPorId(mascotaId))) {
      throw new NotFoundException('No se encontró la mascota asociada');
    }
  }

  private async validarDisponibilidad(mascotaId: string, inicio: Date, duracionMinutos: number, excluirId?: string): Promise<void> {
    if (Number.isNaN(inicio.getTime())) throw new ConflictException('La fecha de la cita no es válida');
    const fin = new Date(inicio.getTime() + duracionMinutos * 60_000);
    if (await this.repositorio.existeCruce(mascotaId, inicio, fin, excluirId)) {
      throw new ConflictException('La mascota ya tiene una cita en ese horario');
    }
  }
}
