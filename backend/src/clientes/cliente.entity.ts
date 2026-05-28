import { Entity,PrimaryGeneratedColumn,Column,OneToMany} from "typeorm";
import {Proyecto} from "../proyectos/proyecto.entity";


export enum EstadosClientes {
    ACTIVO = 'ACTIVO',
    BAJA   = 'BAJA',
}

@Entity('clientes')
export class Cliente {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true, nullable: false})
    nombreCliente!: string;

    @Column({
        type: 'enum',
        enum: EstadosClientes,
        default: EstadosClientes.ACTIVO
})

    estado!: EstadosClientes;

    @OneToMany(() => Proyecto, (proyecto) => proyecto.cliente)
    proyectos!: Proyecto[];
}

