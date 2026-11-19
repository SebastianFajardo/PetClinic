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
  private constructor(private readonly data: OwnerData) {}

  static create(data: OwnerData): Owner {
    if (!data.name.trim() || !data.lastName.trim()) {
      throw new ReglaNegocioError('El name y el lastName son obligatorios');
    }
    if (!data.documentNumber.trim()) {
      throw new ReglaNegocioError('El documentNumber es obligatorio');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new ReglaNegocioError('El email electrónico no es válido');
    }
    if (!data.phone.trim()) {
      throw new ReglaNegocioError('El teléfono es obligatorio');
    }
    return new Owner(data);
  }

  toData(): OwnerData {
    return { ...this.data };
  }
}
