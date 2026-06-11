import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn} from "typeorm";
import {Cliente} from "../clientes/cliente.entity";
import { Tarea } from '../tareas/tarea.entity';

export enum EstadosProyectos {
    ACTIVO = 'ACTIVO',
    FINALIZADO = 'FINALIZADO',
    BAJA = 'BAJA',
}
@Entity('proyectos')
export class Proyecto {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name:'nombreProyecto', unique: true, nullable: false})
    nombreProyecto!: string;

    @Column({
        type: 'enum',
        enum: EstadosProyectos,
        enumName: 'proyectos_estado_enum',
        default: EstadosProyectos.ACTIVO,
    })
    estado!: EstadosProyectos;

    @ManyToOne(() => Cliente, (cliente) => cliente.proyectos,{nullable: true})
    @JoinColumn({name: "clienteId"})
    cliente!: Cliente;

    @OneToMany(() => Tarea, (tarea) => tarea.proyecto)
    tareas!: Tarea[];
}