import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Usuario } from '../entities/user.entity';
import { META_ROL } from '../decorator/rol-protected.decorator';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflactor: Reflector,
    private readonly roleService: RolesService,
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRol: string[] = this.reflactor.get(META_ROL, context.getHandler());

    if (!validRol || validRol.length === 0) return true;
   
    const req = context.switchToHttp().getRequest();
    const user = req.user as Usuario;

    if (!user)
      throw new BadRequestException('No existe el usuario');

    if(validRol.includes(user.rol.nombre)) {
      return true
    }
    throw new ForbiddenException(`No puedes hacer esto ahora consulta tus permisos`)

  }
}
