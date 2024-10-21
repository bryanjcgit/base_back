import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { Usuario } from 'src/auth/entities/user.entity';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { Rol } from 'src/auth/interfaces/valid-rol';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}


  @Get('obtenerUsuarios')
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':user_id')
  findOne(@Param('user_id') user_id: string) {
    return this.usuariosService.findOne(user_id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string, 
    @Body() updateUsuarioDto: UpdateUserDto) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Patch('desactivar/:id')
  desactivar(@Param('id') id: string) {
    return this.usuariosService.desactivar(id);
  }
}
