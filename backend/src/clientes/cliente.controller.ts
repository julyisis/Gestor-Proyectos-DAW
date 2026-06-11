import { Controller, Get , Post, Body, Patch, UseGuards, Param, Query} from '@nestjs/common';
import {ClienteService} from './cliente.service';
import {CreateClienteDto} from './dto/create-cliente.dto';
import {SearchClienteDto} from './dto/search-cliente.dto';
import {AuthGuard} from '@nestjs/passport';
import {RolesGuard} from '../usuarios/guards/roles.guard';
import {Roles} from '../usuarios/roles.decorator';
import {Role} from '../usuarios/usuario.roles.enum';


@Controller('clientes')
export class ClienteController {
    constructor(private readonly clienteService: ClienteService){}

    @Get()
    @Roles(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    listar(@Query() query: SearchClienteDto){
        return this.clienteService.search(query);
    }

    @Post()
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    crear(@Body() createClienteDto: CreateClienteDto){
        return this.clienteService.create(createClienteDto);

    }
    @Patch('baja/:id')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async darDeBaja(@Param('id')id: number) {
        return this.clienteService.darDeBaja(id);
    }

}