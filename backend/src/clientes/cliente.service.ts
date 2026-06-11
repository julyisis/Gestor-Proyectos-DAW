import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente, EstadosClientes } from './cliente.entity';
import { Proyecto } from '../proyectos/proyecto.entity';
import { SearchClienteDto } from './dto/search-cliente.dto';
import { PaginatedResult } from '../common/dto/paginated-result.dto';

@Injectable()
export class ClienteService {
    constructor(
        @InjectRepository(Cliente)
        private clienteRepository: Repository<Cliente>, 
        @InjectRepository(Proyecto)
        private proyectosRepository: Repository<Proyecto>
    ) {}

    async search(query: SearchClienteDto): Promise<PaginatedResult<Cliente>> {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const sortBy = query.sortBy ?? 'nombreCliente';
        const sortOrder = query.sortOrder ?? 'ASC';
        const allowedSort = ['nombreCliente', 'estado', 'telefono', 'email', 'id'];
        const orderField = allowedSort.includes(sortBy) ? sortBy : 'nombreCliente';
        const qb = this.clienteRepository.createQueryBuilder('cliente')
            .leftJoinAndSelect('cliente.proyectos', 'proyectos');
        if (query.nombre) {
            qb.andWhere('cliente.nombreCliente ILIKE :nombre', { nombre: `%${query.nombre}%` });
        }

        if (query.estado) {
            qb.andWhere('cliente.estado = :estado', { estado: query.estado });
        }

        if (query.telefono) {
            qb.andWhere('cliente.telefono ILIKE :telefono', { telefono: `%${query.telefono}%` });
        }

        if (query.email) {
            qb.andWhere('cliente.email ILIKE :email', { email: `%${query.email}%` });
        }

        qb.orderBy(`cliente.${orderField}`, sortOrder);
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

    async create(data: any) {
        try {
        const nuevo = this.clienteRepository.create(data); 
        return await this.clienteRepository.save(nuevo);
    }catch (error: any) {
        if ((error as any).code === '23505') {
            throw new BadRequestException('Ya existe un cliente con ese nombre');
        }
        throw error;
    }
}

    async darDeBaja(id: number) {
        const proyectosActivos = await this.proyectosRepository.count({
            where: { cliente: { id: id } }
        });

        if (proyectosActivos > 0) {
            throw new BadRequestException('No se puede dar de baja a un cliente con un proyecto asociado');
        }

        return this.clienteRepository.update(id, { estado: EstadosClientes.BAJA });
    }
}