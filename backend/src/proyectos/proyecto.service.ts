import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Proyecto, EstadosProyectos} from './proyecto.entity';
import {Cliente} from '../clientes/cliente.entity';
import {CreateProyectoDto} from './dto/create-proyecto.dto';
import {SearchProyectoDto} from './dto/search-proyecto.dto';
import { PaginatedResult } from '../common/dto/paginated-result.dto';
import { Parser } from 'json2csv';

@Injectable()
export class ProyectoService {
    constructor(
        @InjectRepository(Proyecto)
        private readonly proyectosRepository : Repository<Proyecto>

    ){}

    async search(query: SearchProyectoDto): Promise<PaginatedResult<Proyecto>> {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const sortBy = query.sortBy ?? 'nombreProyecto';
        const sortOrder = query.sortOrder ?? 'ASC';
        const allowedSort = ['nombreProyecto', 'estado', 'id'];
        const orderField = allowedSort.includes(sortBy) ? sortBy : 'nombreProyecto';

        const qb = this.proyectosRepository.createQueryBuilder('proyecto')
            .leftJoinAndSelect('proyecto.cliente', 'cliente')
            .leftJoinAndSelect('proyecto.tareas', 'tareas');

        if (query.nombre) {
            qb.andWhere('proyecto.nombreProyecto ILIKE :nombre', { nombre: `%${query.nombre}%` });
        }

        if (query.estado) {
            qb.andWhere('proyecto.estado = :estado', { estado: query.estado });
        }

        if (query.clienteId) {
            qb.andWhere('cliente.id = :clienteId', { clienteId: query.clienteId });
        }

        qb.orderBy(`proyecto.${orderField}`, sortOrder);
        qb.skip((page - 1) * limit).take(limit);

        const [data, total] = await qb.getManyAndCount();

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 0,
        };
    }

    async findOne(id: number): Promise<Proyecto> {
        const proyecto = await this.proyectosRepository.findOne({
            where: { id },
            relations: ['cliente', 'tareas'],
        });

        if (!proyecto) {
            throw new NotFoundException('El proyecto indicado no existe');
        }

        return proyecto;
    }

    async create(data: CreateProyectoDto): Promise<Proyecto> {
        const proyecto = this.proyectosRepository.create({
            nombreProyecto: data.nombreProyecto,
            estado: data.estado ?? EstadosProyectos.ACTIVO,
        });

        if (data.clienteId) {
            proyecto.cliente = { id: data.clienteId } as Cliente;
        }

        return await this.proyectosRepository.save(proyecto);
    }

    async darDeBaja(id: number) {
        const proyecto = await this.proyectosRepository.findOne({
            where: { id },
        });

        if (!proyecto) {
            throw new NotFoundException('El proyecto indicado no existe');
        }

        return this.proyectosRepository.update(id, { estado: EstadosProyectos.BAJA });
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