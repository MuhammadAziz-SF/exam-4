import { SetMetadata } from '@nestjs/common';
import { Roles } from '../../enum';

export const ROLES_KEY = 'role';
export const RolesDecorator = (...roles: Roles[]) =>
  SetMetadata(ROLES_KEY, roles);
