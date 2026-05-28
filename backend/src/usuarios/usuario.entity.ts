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

    @Column({ unique: true, nullable: false })
    nombreUsuario!: string;

    @Column({
        type: 'enum',
        enum: EstadosUsuarios,
        default: EstadosUsuarios.ACTIVO
    })
    estado!: EstadosUsuarios;

    @Column({ select: false })
    password!: string;

    @Column({
        type: 'enum',
        enum: Role, 
        default: 'user' 
    })
    rol!: string; 
}