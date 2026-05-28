import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsuariosService } from './usuario.service';
import { Usuario } from './usuario.entity';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  async crear(@Body() data: any) {
    
    return this.usuariosService.crear(data); 
  }

  @Get()
  async listar() {
    return this.usuariosService.findAll();
  }
}