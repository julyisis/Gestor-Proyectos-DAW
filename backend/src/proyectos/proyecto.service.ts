import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Proyecto} from './proyecto.entity';
import { Parser } from 'json2csv';

@Injectable()
export class ProyectoService {
    constructor(
        @InjectRepository(Proyecto)
        private readonly proyectosRepository : Repository<Proyecto>

    ){}

    findAll() : Promise<Proyecto[]>{
        return this.proyectosRepository.find()

    }

    async create(data: any): Promise<Proyecto> {
    return await this.proyectosRepository.save(data);
}

    async exportarProyectosCsv(): Promise<string> {
    const proyectos = await this.proyectosRepository.find({
        relations: ['cliente', 'tareas'],
    });

    const datos = proyectos.map((proyecto) => ({
        id: proyecto.id,
        nombre: proyecto.nombreProyecto,
        estado: proyecto.estado,
        idCliente: proyecto.cliente?.id,
        cantidadTareas: proyecto.tareas?.length ?? 0,
    }));

    const parser = new Parser({
        fields: ['id', 'nombre', 'estado', 'idCliente', 'cantidadTareas'],
    });

    return parser.parse(datos);
}
}