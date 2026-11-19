import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../domain/user';
import { ALLOWED_ROLES } from './guards/roles.guard';

export const Roles = (...roles: UserRole[]) => SetMetadata(ALLOWED_ROLES, roles);
