import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { MascotaRepositorio } from '../../mascotas/dominio/mascota.repositorio';
import { DatosHistoriaClinica, HistoriaClinica } from '../dominio/historia-clinica';
import { HistoriaClinicaRepositorio } from '../dominio/historia-clinica.repositorio';

export interface CrearHistoriaClinica {
  mascotaId: string;
  nombreVeterinario: string;
  motivoConsulta: string;
  sintomas: string;
  diagnostico: string;
  tratamiento: string;
  observaciones?: string;
  registradaEn?: string;
}

@Injectable()
export class HistoriasClinicasServicio {
  constructor(
    @Inject('HistoriaClinicaRepositorio') private readonly repositorio: HistoriaClinicaRepositorio,
    @Inject('MascotaRepositorio') private readonly mascotas: MascotaRepositorio,
  ) {}

  async crear(entrada: CrearHistoriaClinica): Promise<DatosHistoriaClinica> {
    const mascota = await this.mascotas.buscarPorId(entrada.mascotaId);
    if (!mascota) throw new NotFoundException('No se encontró la mascota asociada');
    const ahora = new Date();
    const historia = HistoriaClinica.crear({
      id: randomUUID(),
      mascotaId: entrada.mascotaId,
      nombreVeterinario: entrada.nombreVeterinario.trim(),
      motivoConsulta: entrada.motivoConsulta.trim(),
      sintomas: entrada.sintomas.trim(),
      diagnostico: entrada.diagnostico.trim(),
      tratamiento: entrada.tratamiento.trim(),
      observaciones: entrada.observaciones?.trim() || null,
      registradaEn: entrada.registradaEn ? new Date(entrada.registradaEn) : ahora,
      creadaEn: ahora,
    });
    return this.repositorio.guardar(historia.obtenerDatos());
  }

  async listar(mascotaId?: string): Promise<DatosHistoriaClinica[]> {
    if (mascotaId) {
      const mascota = await this.mascotas.buscarPorId(mascotaId);
      if (!mascota) throw new NotFoundException('No se encontró la mascota');
      return this.repositorio.listarPorMascota(mascotaId);
    }
    return this.repositorio.listar();
  }

  async obtener(id: string): Promise<DatosHistoriaClinica> {
    const historia = await this.repositorio.buscarPorId(id);
    if (!historia) throw new NotFoundException('No se encontró la historia clínica');
    return historia;
  }
}
