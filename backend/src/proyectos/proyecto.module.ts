import{Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Proyecto} from './proyecto.entity';
import {ProyectoService} from './proyecto.service';
import {ProyectoController} from './proyecto.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Proyecto])],
    controllers: [ProyectoController],
    providers: [ProyectoService],
})

export class ProyectosModule {}
