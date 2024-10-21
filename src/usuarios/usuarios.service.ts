import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { Usuario } from 'src/auth/entities/user.entity';
import { handleCustomError } from 'src/functions/error';
import { Role } from 'src/roles/entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsuariosService {

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) { }

  async findAll() {
    try {

      const usuarios = await this.usuarioRepository.find();

      return usuarios;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('No es posible traer los usuarios');
    }
  }

  async findOne(id: string): Promise<Usuario> {

    try {

      const usuario = await this.usuarioRepository.findOneBy({ id })

      if (!usuario.estado) {
        throw new BadRequestException('El usuario esta desactivado')
      } else {
        return usuario
      }
    } catch (error) {
      console.log(error)
      throw new BadRequestException(`No se encontro el ID: ${id}`)
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Usuario> {
    try {
      const { rol } = updateUserDto;
      
      let role: Role | undefined;
      if (rol) {
        role = await this.roleRepository.findOne({ where: { nombre: rol.toUpperCase() } });
        if (!role) {
          throw new NotFoundException(`El rol con nombre ${rol} no existe.`);
        }
      }
       
      let usuario = await this.usuarioRepository.preload({
        id,
        ...updateUserDto, 
        rol: role,  
      });
  
      if (!usuario) throw new NotFoundException(`No se encontró el usuario por el ID: ${id}`);
  
      await this.usuarioRepository.save(usuario);
      return usuario;
    } catch (error) {
      throw handleCustomError(error);
    }
  }

  async desactivar(id: string) {
    try {
      const usuario = await this.usuarioRepository.findOneBy({ id });

      if (!usuario) {
        throw new BadRequestException('El usuario no existe');
      }
    
      await this.usuarioRepository.update(id, { estado: !usuario.estado });

      const estadoActualizado = usuario.estado ? 'desactivado' : 'activado';
      return { mensaje: `Usuario ${estadoActualizado} correctamente` };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(`No se pudo cambiar el estado del usuario con el ID: ${id}`);
    }
  }
}
