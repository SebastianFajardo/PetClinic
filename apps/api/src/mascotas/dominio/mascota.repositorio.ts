import { DatosMascota } from './mascota';

export interface MascotaRepositorio {
  guardar(datos: DatosMascota): Promise<DatosMascota>;
  buscarPorId(id: string): Promise<DatosMascota | null>;
  listar(): Promise<DatosMascota[]>;
  listarPorPropietario(propietarioId: string): Promise<DatosMascota[]>;
  eliminar(id: string): Promise<boolean>;
}
