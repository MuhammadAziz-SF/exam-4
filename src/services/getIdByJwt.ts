import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

const jwtService = new JwtService();

export const decodeJwt = async (req: Request) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    throw new UnauthorizedException('No token provided');
  }

  try {
    const decoded = jwtService.decode(token);
    if (!decoded) {
      throw new UnauthorizedException('Invalid token');
    }
    return decoded;
  } catch (error) {
    throw new UnauthorizedException('Failed to decode token');
  }
};
