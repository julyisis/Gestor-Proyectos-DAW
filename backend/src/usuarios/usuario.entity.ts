import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Role } from './usuario.roles.enum'; 

export enum EstadosUsuarios {
    ACTIVO = 'ACTIVO',
    BAJA = 'BAJA',
}

@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'nombreUsuario', unique: true, nullable: false })
    nombreUsuario!: string;

    @Column({
        type: 'enum',
        enum: EstadosUsuarios,
        enumName: 'usuarios_estado_enum',
        default: EstadosUsuarios.ACTIVO
    })
    estado!: EstadosUsuarios;

    @Column({ name: 'password', select: false })
    password!: string;

    @Column({
        type: 'enum',
        enum: Role,
        enumName: 'usuarios_rol_enum',
        default: 'user'
    })
    rol!: string; 
}