import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, EstadosUsuarios } from './usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuariosRepository: Repository<Usuario>,
    ) {}
    async findOneByUsername(nombreUsusario: string): Promise<Usuario| null> {
        return this.usuariosRepository.findOne({
            where: { nombreUsuario: nombreUsusario },
            select: ['id' , 'nombreUsuario', 'password', 'estado', 'rol']
        })
    }

    async crear(data: any): Promise<Usuario> {
        
        const nuevo = new Usuario();
        nuevo.nombreUsuario = data.nombreUsuario;
        nuevo.password = await bcrypt.hash(data.password, 10);
        nuevo.estado = data.estado;
        nuevo.rol = data.rol;
        
        return await this.usuariosRepository.save(nuevo);
    }

    async findAll(): Promise<Usuario[]> {
        return await this.usuariosRepository.find();
    }

    async validarAcceso(username: string, password: string) {
        
        const usuario = await this.usuariosRepository.findOne({
            where: { nombreUsuario: username },
            
            select: ['id', 'nombreUsuario', 'password', 'estado', 'rol']
        });
        

        if (!usuario) throw new UnauthorizedException('Usuario Inexistente');
        
        if (usuario.estado === EstadosUsuarios.BAJA) {
            throw new UnauthorizedException('El usuario esta Inactivo');
        }

        const passwordValida = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordValida) {
            throw new UnauthorizedException('Credenciales Invalidas');
        }

        return usuario;
    }
}