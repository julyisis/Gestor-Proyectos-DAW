import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Proyecto} from './proyecto.entity';

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

    
}