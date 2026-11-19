import { ReglaNegocioError } from '../../compartido/dominio/regla-negocio.error';

export interface DatosHistoriaClinica {
  id: string;
  mascotaId: string;
  nombreVeterinario: string;
  motivoConsulta: string;
  sintomas: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string | null;
  registradaEn: Date;
  creadaEn: Date;
}

export class HistoriaClinica {
  private constructor(private readonly datos: DatosHistoriaClinica) {}

  static crear(datos: DatosHistoriaClinica): HistoriaClinica {
    if (!datos.mascotaId.trim()) throw new ReglaNegocioError('La mascota es obligatoria');
    if (!datos.nombreVeterinario.trim()) throw new ReglaNegocioError('El nombre del veterinario es obligatorio');
    if (!datos.motivoConsulta.trim()) throw new ReglaNegocioError('El motivo de consulta es obligatorio');
    if (!datos.sintomas.trim()) throw new ReglaNegocioError('Los síntomas son obligatorios');
    if (!datos.diagnostico.trim()) throw new ReglaNegocioError('El diagnóstico es obligatorio');
    if (!datos.tratamiento.trim()) throw new ReglaNegocioError('El tratamiento es obligatorio');
    if (Number.isNaN(datos.registradaEn.getTime())) throw new ReglaNegocioError('La fecha de consulta no es válida');
    return new HistoriaClinica(datos);
  }

  obtenerDatos(): DatosHistoriaClinica {
    return { ...this.datos };
  }
}
