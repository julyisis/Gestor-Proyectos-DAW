import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ClienteModule} from './clientes/cliente.module';
import {ProyectosModule} from './proyectos/proyecto.module';
import {UsuariosModule} from './usuarios/usuario.module';
import { AuthModule } from './auths/auth.module';
import { TareasModule } from './tareas/tarea.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    autoLoadEntities: true,
    logging: process.env.DB_LOGGING === 'true',
    logger: 'advanced-console',
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