import { BusinessRuleError } from '../../shared/domain/business-rule.error';

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
      throw new BusinessRuleError('First and last names are required');
    }
    if (!data.documentNumber.trim()) {
      throw new BusinessRuleError('Document number is required');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new BusinessRuleError('Invalid email address');
    }
    if (!data.phone.trim()) {
      throw new BusinessRuleError('Phone number is required');
    }
    return new Owner(data);
  }

  toData(): OwnerData {
    return { ...this.data };
  }
}
