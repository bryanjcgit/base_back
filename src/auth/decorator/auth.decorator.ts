import { UseGuards, applyDecorators } from '@nestjs/common';
import { Rol } from './../interfaces/valid-rol';
import { RolProtected } from './rol-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';
import { Role } from 'src/roles/entities/role.entity';


export function Auth(...rols: string[]){
    return applyDecorators(
        RolProtected(...rols),
        UseGuards(AuthGuard(), UserRoleGuard)        
    )
}