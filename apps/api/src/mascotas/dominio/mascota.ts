import { ReglaNegocioError } from '../../compartido/dominio/regla-negocio.error';

export type EspecieMascota = 'dog' | 'cat' | 'bird' | 'other';
export type SexoMascota = 'male' | 'female' | 'unknown';

export interface DatosMascota {
  id: string;
  propietarioId: string;
  nombre: string;
  especie: EspecieMascota;
  raza: string | null;
  fechaNacimiento: string | null;
  sexo: SexoMascota;
  color: string | null;
  pesoKg: number | null;
  notas: string | null;
  creadoEn: Date;
  actualizadoEn: Date;
}

export class Mascota {
  private constructor(private readonly datos: DatosMascota) {}

  static crear(datos: DatosMascota): Mascota {
    if (!datos.nombre.trim()) throw new ReglaNegocioError('El nombre de la mascota es obligatorio');
    if (!datos.propietarioId.trim()) throw new ReglaNegocioError('El propietario es obligatorio');
    if (datos.pesoKg !== null && (!Number.isFinite(datos.pesoKg) || datos.pesoKg <= 0)) {
      throw new ReglaNegocioError('El peso debe ser un número mayor que cero');
    }
    return new Mascota(datos);
  }

  obtenerDatos(): DatosMascota {
    return { ...this.datos };
  }
}
