import { ReglaNegocioError } from '../../compartido/domain/regla-negocio.error';

export interface OwnerData {
  id: string;
  name: string;
  lastName: string;
  documentNumber: string;
  email: string;
  phone: string;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Owner {
  private constructor(private readonly datos: OwnerData) {}

  static create(datos: OwnerData): Owner {
    if (!datos.name.trim() || !datos.lastName.trim()) {
      throw new ReglaNegocioError('El name y el lastName son obligatorios');
    }
    if (!datos.documentNumber.trim()) {
      throw new ReglaNegocioError('El documentNumber es obligatorio');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) {
      throw new ReglaNegocioError('El email electrónico no es válido');
    }
    if (!datos.phone.trim()) {
      throw new ReglaNegocioError('El teléfono es obligatorio');
    }
    return new Owner(datos);
  }

  toData(): OwnerData {
    return { ...this.datos };
  }
}
