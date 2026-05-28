import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente, EstadosClientes } from './cliente.entity';
import { Proyecto } from '../proyectos/proyecto.entity'; 

@Injectable()
export class ClienteService {
    constructor(
        @InjectRepository(Cliente)
        private clienteRepository: Repository<Cliente>, 

        @InjectRepository(Proyecto)
        private proyectosRepository: Repository<Proyecto>
    ) {}

    findAll() {
        return this.clienteRepository.find(); 
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