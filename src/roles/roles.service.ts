import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { handleCustomError } from 'src/functions/error';

@Injectable()
export class RolesService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(Role)
    private readonly rolRepository: Repository<Role>,
  ) {}

  private createQueryRunner(): QueryRunner {
    const queryRunner = this.dataSource.createQueryRunner();
    return queryRunner;
  }

  async buscar(term: string): Promise<Role[]> {
    const queryBuilder = this.rolRepository.createQueryBuilder('role')
      .leftJoinAndSelect('role.usuarios', 'usuarios')
      .where('UPPER(role.nombre) LIKE :searchTerm OR ' +
        'UPPER(role.descripcion) LIKE :searchTerm', 
        { searchTerm: `%${term.toUpperCase()}%` });

    const roles = await queryBuilder.getMany();

    if (!roles.length) {
      throw new NotFoundException(`No hay registros que coincidan con: "${term}".`);
    }

    return roles;
  }

  async buscarConUsuarios(term: string): Promise<Role> {
    const queryBuilder = this.rolRepository.createQueryBuilder('role')
      .leftJoinAndSelect('role.usuarios', 'usuarios') 
      .where('UPPER(role.nombre) LIKE :searchTerm OR ' +
        'UPPER(role.descripcion) LIKE :searchTerm OR ' +
        'UPPER(usuarios.nombre) LIKE :searchTerm OR ' +  
        'UPPER(usuarios.username) LIKE :searchTerm OR ' + 
        'UPPER(role.id) LIKE :searchTerm OR ' +         
        'UPPER(usuarios.id) LIKE :searchTerm',          
        { searchTerm: `%${term.toUpperCase()}%` });
  
    const role = await queryBuilder.getOne(); 
  
    if (!role) {
      throw new NotFoundException(`No hay registros que coincidan con: "${term}".`);
    }
  
    return role; 
  }
  

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const { nombre } = createRoleDto;
    
    try {

      const rol = await this.rolRepository.create(createRoleDto)

      await this.rolRepository.save(rol)

      return rol
      
    } catch (error) {
      console.log(error)
      throw handleCustomError(error)
    }
    
  }
  
  async findAll(): Promise<Role[]> {
    return this.rolRepository.find();
  }


  async findOne(id: string): Promise<Role> {
    const role = await this.rolRepository.findOne({ where: { id } });

    if (!role) {
      throw new NotFoundException(`El rol con ID ${id} no existe.`);
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const queryRunner = this.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const role = await queryRunner.manager
        .createQueryBuilder(Role, 'role')
        .where('role.id = :id', { id })
        .getOne();

      if (!role) {
        throw new NotFoundException(`El rol con ID ${id} no existe.`);
      }

      const updatedData = {
        ...updateRoleDto,
        nombre: updateRoleDto.nombre?.toUpperCase() || role.nombre,
      };

      queryRunner.manager.merge(Role, role, updatedData);

      const updatedRole = await queryRunner.manager.save(role);

      await queryRunner.commitTransaction();
      return updatedRole;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw handleCustomError(error);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<void> {
    const queryRunner = this.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const role = await queryRunner.manager
        .createQueryBuilder(Role, 'role')
        .where('role.id = :id', { id })
        .getOne();

      if (!role) {
        throw new NotFoundException(`El rol con ID ${id} no existe.`);
      }

      await queryRunner.manager.remove(role);

      await queryRunner.commitTransaction();

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw handleCustomError(error);
    } finally {
      await queryRunner.release();
    }
  }
}
