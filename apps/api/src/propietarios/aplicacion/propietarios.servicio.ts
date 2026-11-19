import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DatosPropietario, Propietario } from '../dominio/propietario';
import { PropietarioRepositorio } from '../dominio/propietario.repositorio';

export interface CrearPropietario {
  nombre: string;
  apellido: string;
  documento: string;
  correo: string;
  telefono: string;
  direccion?: string;
}

@Injectable()
export class PropietariosServicio {
  constructor(@Inject('PropietarioRepositorio') private readonly repositorio: PropietarioRepositorio) {}

  async crear(entrada: CrearPropietario): Promise<DatosPropietario> {
    const documento = entrada.documento.trim();
    const correo = entrada.correo.trim().toLowerCase();
    await this.validarUnicidad(documento, correo);
    const ahora = new Date();
    const propietario = Propietario.crear({
      id: randomUUID(),
      nombre: entrada.nombre.trim(),
      apellido: entrada.apellido.trim(),
      documento,
      correo,
      telefono: entrada.telefono.trim(),
      direccion: entrada.direccion?.trim() || null,
      creadoEn: ahora,
      actualizadoEn: ahora,
    });
    return this.repositorio.guardar(propietario.obtenerDatos());
  }

  async listar(): Promise<DatosPropietario[]> {
    return this.repositorio.listar();
  }

  async obtener(id: string): Promise<DatosPropietario> {
    const propietario = await this.repositorio.buscarPorId(id);
    if (!propietario) throw new NotFoundException('No se encontró el propietario');
    return propietario;
  }

  async actualizar(id: string, entrada: Partial<CrearPropietario>): Promise<DatosPropietario> {
    const actual = await this.obtener(id);
    const documento = entrada.documento?.trim() ?? actual.documento;
    const correo = entrada.correo?.trim().toLowerCase() ?? actual.correo;
    await this.validarUnicidad(documento, correo, id);
    const actualizado = Propietario.crear({
      ...actual,
      nombre: entrada.nombre?.trim() ?? actual.nombre,
      apellido: entrada.apellido?.trim() ?? actual.apellido,
      documento,
      correo,
      telefono: entrada.telefono?.trim() ?? actual.telefono,
      direccion: entrada.direccion === undefined ? actual.direccion : entrada.direccion.trim() || null,
      actualizadoEn: new Date(),
    }).obtenerDatos();
    return this.repositorio.guardar(actualizado);
  }

  async eliminar(id: string): Promise<void> {
    await this.obtener(id);
    await this.repositorio.eliminar(id);
  }

  private async validarUnicidad(documento: string, correo: string, excluirId?: string): Promise<void> {
    if (await this.repositorio.existeDocumento(documento, excluirId)) {
      throw new ConflictException('Ya existe un propietario con ese documento');
    }
    if (await this.repositorio.existeCorreo(correo, excluirId)) {
      throw new ConflictException('Ya existe un propietario con ese correo');
    }
  }
}
