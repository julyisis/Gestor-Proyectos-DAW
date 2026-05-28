import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Cliente} from './cliente.entity';
import {ClienteService} from './cliente.service';
import {ClienteController} from './cliente.controller';
import { Proyecto } from '../proyectos/proyecto.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Cliente, Proyecto])],
    
    providers: [ClienteService],
    controllers: [ClienteController],
    exports: [ClienteService],

})

export class ClienteModule {}