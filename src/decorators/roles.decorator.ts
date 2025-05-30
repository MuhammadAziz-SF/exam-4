import { SetMetadata } from '@nestjs/common';
import { Roles as UserRoles } from '../enum';

export const ROLES_KEY = 'role';
export const Roles = (...roles: UserRoles[]) =>
  SetMetadata(ROLES_KEY, roles);
