import { SetMetadata } from '@nestjs/common';
import { Role as RoleEnum } from '../usuarios/usuario.roles.enum';

export const Roles = (...roles: RoleEnum[]) => SetMetadata('roles', roles);