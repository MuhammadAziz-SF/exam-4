import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import config from '../config';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken = async (payload: object) => {
    return await this.jwtService.signAsync(payload, {
      secret: config.JWT_ACCESS_K,
      expiresIn: config.JWT_ACCESS_T,
    });
  };

  generateRefreshToken = async (payload: object) => {
    return await this.jwtService.signAsync(payload, {
      secret: config.JWT_REFRESH_K,
      expiresIn: config.JWT_TIME_T,
    });
  };
}