import { DatosCita } from './cita';

export interface CitaRepositorio {
  guardar(datos: DatosCita): Promise<DatosCita>;
  buscarPorId(id: string): Promise<DatosCita | null>;
  listar(desde?: Date, hasta?: Date): Promise<DatosCita[]>;
  existeCruce(mascotaId: string, inicio: Date, fin: Date, excluirId?: string): Promise<boolean>;
}
