import { Role } from 'src/roles/entities/role.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('usuarios')
export class Usuario {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  nombre: string;

  @Column('varchar', {
    unique: true
  })
  username: string;
  
  @ManyToOne(() => Role, (rol) => rol.usuarios, { eager: true })
  rol: Role; 


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('boolean', {
    default: true
  })
  estado: boolean;


}
