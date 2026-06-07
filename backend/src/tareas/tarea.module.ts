import {Module} from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { TareasController } from './tarea.controller';
import { TareasService } from './tarea.service';
import { Proyecto } from '../proyectos/proyecto.entity';
import { Tarea } from './tarea.entity';
import { AuthModule } from '../auths/auth.module';

@Module({imports: [
        TypeOrmModule.forFeature([
            Tarea,
            Proyecto
        ]),
        AuthModule
    ],
    controllers: [
        TareasController
    ],
    providers: [
        TareasService
    ]
})
export class TareasModule {
    
}

