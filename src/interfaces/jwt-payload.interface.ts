import { Roles, Status } from '../enum';

export interface JwtPayload {
  id: string;
  email: string;
  status: Status;
  role: Roles;
  iat?: number;
  exp?: number;
}
