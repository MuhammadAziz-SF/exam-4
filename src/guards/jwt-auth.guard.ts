import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import config from '../config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedException('Authorization header is missing');
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('JWT token is missing');
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: config.JWT_ACCESS_K,
      });

      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
