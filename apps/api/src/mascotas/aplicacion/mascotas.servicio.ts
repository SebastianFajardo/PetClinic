import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PropietarioRepositorio } from '../../propietarios/dominio/propietario.repositorio';
import { DatosMascota, EspecieMascota, Mascota, SexoMascota } from '../dominio/mascota';
import { MascotaRepositorio } from '../dominio/mascota.repositorio';

export interface CrearMascota {
  propietarioId: string;
  nombre: string;
  especie: EspecieMascota;
  raza?: string;
  fechaNacimiento?: string;
  sexo?: SexoMascota;
  color?: string;
  pesoKg?: number;
  notas?: string;
}

@Injectable()
export class MascotasServicio {
  constructor(
    private readonly repositorio: MascotaRepositorio,
    private readonly propietarios: PropietarioRepositorio,
  ) {}

  async crear(entrada: CrearMascota): Promise<DatosMascota> {
    const propietario = await this.propietarios.buscarPorId(entrada.propietarioId);
    if (!propietario) throw new NotFoundException('No se encontró el propietario asociado');
    const ahora = new Date();
    const mascota = Mascota.crear({
      id: randomUUID(),
      propietarioId: entrada.propietarioId,
      nombre: entrada.nombre.trim(),
      especie: entrada.especie,
      raza: entrada.raza?.trim() || null,
      fechaNacimiento: entrada.fechaNacimiento ?? null,
      sexo: entrada.sexo ?? 'unknown',
      color: entrada.color?.trim() || null,
      pesoKg: entrada.pesoKg ?? null,
      notas: entrada.notas?.trim() || null,
      creadoEn: ahora,
      actualizadoEn: ahora,
    });
    return this.repositorio.guardar(mascota.obtenerDatos());
  }

  async listar(propietarioId?: string): Promise<DatosMascota[]> {
    if (propietarioId) {
      const propietario = await this.propietarios.buscarPorId(propietarioId);
      if (!propietario) throw new NotFoundException('No se encontró el propietario');
      return this.repositorio.listarPorPropietario(propietarioId);
    }
    return this.repositorio.listar();
  }

  async obtener(id: string): Promise<DatosMascota> {
    const mascota = await this.repositorio.buscarPorId(id);
    if (!mascota) throw new NotFoundException('No se encontró la mascota');
    return mascota;
  }

  async actualizar(id: string, entrada: Partial<CrearMascota>): Promise<DatosMascota> {
    const actual = await this.obtener(id);
    const propietarioId = entrada.propietarioId ?? actual.propietarioId;
    if (entrada.propietarioId) {
      const propietario = await this.propietarios.buscarPorId(propietarioId);
      if (!propietario) throw new NotFoundException('No se encontró el propietario asociado');
    }
    return this.repositorio.guardar(Mascota.crear({
      ...actual,
      propietarioId,
      nombre: entrada.nombre?.trim() ?? actual.nombre,
      especie: entrada.especie ?? actual.especie,
      raza: entrada.raza === undefined ? actual.raza : entrada.raza.trim() || null,
      fechaNacimiento: entrada.fechaNacimiento ?? actual.fechaNacimiento,
      sexo: entrada.sexo ?? actual.sexo,
      color: entrada.color === undefined ? actual.color : entrada.color.trim() || null,
      pesoKg: entrada.pesoKg ?? actual.pesoKg,
      notas: entrada.notas === undefined ? actual.notas : entrada.notas.trim() || null,
      actualizadoEn: new Date(),
    }).obtenerDatos());
  }

  async eliminar(id: string): Promise<void> {
    await this.obtener(id);
    await this.repositorio.eliminar(id);
  }
}
