import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {Proyecto} from "../proyectos/proyecto.entity";

export enum EstadosTareas {
    PENDIENTE = 'PENDIENTE',
    FINALIZADO = 'FINALIZADO',
    BAJA = 'BAJA',
}

    @Entity('tareas')
    export class Tarea {
        @PrimaryGeneratedColumn()
        id!: number;

        @Column({ type: 'text', nullable: false})
        descripcion! : string;

        @Column({
            type: 'enum',
            enum: EstadosTareas,
            default: EstadosTareas.PENDIENTE
        })
        estado! : EstadosTareas;

        @ManyToOne(() => Proyecto, (proyecto) => proyecto.tareas)
        proyecto!: Proyecto;
        
    }

