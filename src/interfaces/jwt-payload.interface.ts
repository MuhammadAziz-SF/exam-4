export interface JwtPayload {
  id: string;
  role: string;
  email: string;
  iat?: number;
  exp?: number;
}
