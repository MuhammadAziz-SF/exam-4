import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config from '../../config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from '../models/admin.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(Admin)
    private readonly adminModel: typeof Admin,
  ) {
    if (!config.JWT_ACCESS_K) {
      throw new Error('JWT_ACCESS_K is not defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.JWT_ACCESS_K,
    });
  }

  async validate(payload: JwtPayload) {
    const { id } = payload;
    const admin = await this.adminModel.findByPk(id);

    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }

    return admin;
  }
}
