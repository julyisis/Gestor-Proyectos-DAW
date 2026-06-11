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

    @Column({ name:'nombreCliente', unique: true, nullable: false})
    nombreCliente!: string;

    @Column({ nullable: true })
    telefono!: string;

    @Column({ nullable: true })
    email!: string;

    @Column({
        type: 'enum',
        enum: EstadosClientes,
        enumName: 'clientes_estado_enum',
        default: EstadosClientes.ACTIVO
})

    estado!: EstadosClientes;

    @OneToMany(() => Proyecto, (proyecto) => proyecto.cliente)
    proyectos!: Proyecto[];
}