import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Roles } from 'src/enum';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return (
      user && (user.role === Roles.ADMIN || user.role === Roles.SUPER_ADMIN)
    );
  }
}
