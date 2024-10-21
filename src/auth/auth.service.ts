import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/user.entity';
import { Repository } from 'typeorm';
import { handleCustomError } from 'src/functions/error';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload';
import { JwtService } from '@nestjs/jwt'
import { MenuSiderbar } from 'src/middleware/menu.response';
import axios from 'axios'
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly authRepository: Repository<Usuario>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    private readonly jwtService: JwtService
  ) { }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async create(createUserDto: CreateUserDto): Promise<Usuario> {
    const { rol } = createUserDto;

    try {

      const role = await this.roleRepository.findOne({ where: { nombre: rol.toUpperCase() } });

      if (!role) {

        throw new NotFoundException(`El rol con nombre ${rol} no existe.`);
      }


      const user = this.authRepository.create({
        ...createUserDto,
        rol: role,
      });


      await this.authRepository.save(user);

      return user;

    } catch (error) {
      console.log(error);
      throw handleCustomError(error);
    }
  }



  async login(loginUserDto: LoginUserDto) {
    const { username } = loginUserDto;

    const user = await this.authRepository.findOne({
      where: { username },
      select: {
        username: true,
        id: true,
        nombre: true,
        estado: true
      },
      relations: ['rol'],
    });

    if (!user) {
      throw new BadRequestException('Necesitas permisos del administrador del aplicativo para ingresar aquí');
    }

    if (!user.estado) {
      throw new BadRequestException('Usuario desactivado, comunicate con el administrador');
    }

    const menu = MenuSiderbar(user.rol?.nombre);
    
    return {
      token: this.getJwtToken({ id: user.id }),
      user: {
        id: user.id,
        username: user.username,
        nombre: user.nombre,
        rol: user.rol?.nombre
      },
      menu: menu
    };
  }


  async checkAuthStatus(user: Usuario) {
    const { id } = user
    const token = this.getJwtToken({ id })
    return {
      ok: true,
      id,
      token,
      user
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

}
