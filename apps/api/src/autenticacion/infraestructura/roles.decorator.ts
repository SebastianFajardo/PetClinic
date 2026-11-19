import { SetMetadata } from '@nestjs/common';
import { RolUsuario } from '../dominio/usuario';
import { ROLES_PERMITIDOS } from './guards/roles.guard';

export const Roles = (...roles: RolUsuario[]) => SetMetadata(ROLES_PERMITIDOS, roles);
