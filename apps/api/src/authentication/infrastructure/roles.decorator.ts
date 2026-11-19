import { SetMetadata } from '@nestjs/common';
import { RolUser } from '../domain/user';
import { ROLES_PERMITIDOS } from './guards/roles.guard';

export const Roles = (...roles: RolUser[]) => SetMetadata(ROLES_PERMITIDOS, roles);
