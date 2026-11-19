import { ReglaNegocioError } from '../../compartido/dominio/regla-negocio.error';

export type EstadoCita = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export interface DatosCita {
  id: string;
  mascotaId: string;
  fechaHora: Date;
  duracionMinutos: number;
  motivo: string;
  estado: EstadoCita;
  observaciones: string | null;
  creadaEn: Date;
  actualizadaEn: Date;
}

export class Cita {
  private constructor(private readonly datos: DatosCita) {}

  static crear(datos: DatosCita): Cita {
    if (!datos.mascotaId.trim()) throw new ReglaNegocioError('La mascota es obligatoria');
    if (Number.isNaN(datos.fechaHora.getTime())) throw new ReglaNegocioError('La fecha de la cita no es válida');
    if (!Number.isInteger(datos.duracionMinutos) || datos.duracionMinutos < 15 || datos.duracionMinutos > 240) {
      throw new ReglaNegocioError('La duración debe estar entre 15 y 240 minutos');
    }
    if (!datos.motivo.trim()) throw new ReglaNegocioError('El motivo de la cita es obligatorio');
    return new Cita(datos);
  }

  obtenerDatos(): DatosCita {
    return { ...this.datos };
  }
}
