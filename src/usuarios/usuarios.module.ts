import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { AuthModule } from 'src/auth/auth.module';
import { RolesModule } from 'src/roles/roles.module';


@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
  imports:[
    AuthModule,
    RolesModule,   
  ]
})
export class UsuariosModule {}
