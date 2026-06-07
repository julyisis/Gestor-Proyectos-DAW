import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn} from "typeorm";
import {Proyecto} from "../proyectos/proyecto.entity";

export enum EstadosTareas {
    PENDIENTE = 'PENDIENTE',
    FINALIZADO = 'FINALIZADO',
    BAJA = 'BAJA',
}

    @Entity('tareas')
    export class Tarea {
        @PrimaryGeneratedColumn({name: "id"})
        id!: number;

        @Column()
        descripcion! : string;

        @Column({
            name: "estado",type: 'enum',enum: EstadosTareas, default: EstadosTareas.PENDIENTE})
        estado! : EstadosTareas;

        @Column({name: "id_proyecto"})
        idProyecto!: number;

        @ManyToOne(() => Proyecto, (proyecto: Proyecto) => proyecto.tareas)
        @JoinColumn ({name: "id_proyecto"})
        proyecto!: Proyecto;
        
    }

