import { DatosHistoriaClinica } from './historia-clinica';

export interface HistoriaClinicaRepositorio {
  guardar(datos: DatosHistoriaClinica): Promise<DatosHistoriaClinica>;
  buscarPorId(id: string): Promise<DatosHistoriaClinica | null>;
  listar(): Promise<DatosHistoriaClinica[]>;
  listarPorMascota(mascotaId: string): Promise<DatosHistoriaClinica[]>;
}
