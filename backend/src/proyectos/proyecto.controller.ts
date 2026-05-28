import{Controller, Get, Post, Body, UseGuards} from '@nestjs/common';
import {ProyectoService} from './proyecto.service';
import {CreateProyectoDto} from './dto/create-proyecto.dto';
import {RolesGuard} from '../usuarios/guards/roles.guard';
import {Role} from '../usuarios/usuario.roles.enum';
import { Roles } from '../usuarios/roles.decorator';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';

@Controller('proyectos')

export class ProyectoController {
    constructor(private readonly proyectoService: ProyectoService) {}

    @Get()
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard) 
    listar() {
        return this.proyectoService.findAll();
    }

    @Post()
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    crear(@Body() createProyectoDto: CreateProyectoDto) {
        return this.proyectoService.create(createProyectoDto);
    }
}