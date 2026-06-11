import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsuariosService } from './usuario.service';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './roles.decorator';
import { Role } from './usuario.roles.enum';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async crear(@Body() data: any) {
    
    return this.usuariosService.crear(data); 
  }

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async listar() {
    return this.usuariosService.findAll();
  }
}