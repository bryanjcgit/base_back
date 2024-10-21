import { Usuario } from 'src/auth/entities/user.entity';
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('roles')
export class Role {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('varchar', {
        unique: true
    })
    nombre: string

    @Column('varchar', {
        nullable: true,
        default: 'No registra'
    })
    descripcion: string

    @OneToMany(() => Usuario, (usuario) => usuario.rol)
    usuarios: Usuario[];

    @CreateDateColumn()
    createAt: Date

    @UpdateDateColumn()
    updateAt: Date

    @Column('boolean', {
        default: true
    })
    estado: boolean

    @BeforeInsert()
    @BeforeUpdate()
    async formatNombre() {
      if (this.nombre) {
        this.nombre = this.nombre.toUpperCase();
      }
    }

}
