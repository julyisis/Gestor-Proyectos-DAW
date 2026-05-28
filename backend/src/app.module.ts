import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- Importamos el módulo de TypeORM
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Usuario } from './usuarios/usuario.entity';
import {Cliente} from './clientes/cliente.entity';
import {Proyecto} from './proyectos/proyecto.entity';
import {Tarea}    from    './tareas/tarea.entity';
import {ClienteModule} from './clientes/cliente.module';
import {ProyectosModule} from './proyectos/proyecto.module';
import {TareasModule} from './tareas/tarea.module';
import {UsuariosModule} from './usuarios/usuario.module';
import { AuthModule } from './auths/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root', 
      database: 'postgres',  
      entities: [Usuario, Cliente, Proyecto,Tarea], 
      synchronize: true, 
    }),
    ClienteModule,
    ProyectosModule,
    TareasModule,
    UsuariosModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}