import{Controller, Get, Post, Body, UseGuards, Res, Param, Patch, Query} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import {ProyectoService} from './proyecto.service';
import {CreateProyectoDto} from './dto/create-proyecto.dto';
import {SearchProyectoDto} from './dto/search-proyecto.dto';
import {RolesGuard} from '../usuarios/guards/roles.guard';
import {Role} from '../usuarios/usuario.roles.enum';
import { Roles } from '../usuarios/roles.decorator';

@Controller('proyectos')

export class ProyectoController {
    constructor(private readonly proyectoService: ProyectoService) {}

    @Get()
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard) 
    listar(@Query() query: SearchProyectoDto) {
        return this.proyectoService.search(query);
    }

    @Post()
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    crear(@Body() createProyectoDto: CreateProyectoDto) {
        return this.proyectoService.create(createProyectoDto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard ('jwt'))
    @Get('export/csv')
    async exportarProyectosCsv(@Res() res: any): Promise<void> {

        const csv = await this.proyectoService.exportarProyectosCsv();
    
        res.header('Content-Type', 'text/csv');
        res.attachment('proyectos.csv');
        res.send(csv);
    }

    @Patch('baja/:id')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    darDeBaja(@Param('id') id: number) {
        return this.proyectoService.darDeBaja(id);
    }

    @Get(':id')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    findOne(@Param('id') id: number) {
        return this.proyectoService.findOne(id);
    }
}