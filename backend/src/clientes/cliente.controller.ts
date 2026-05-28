import { Controller, Get , Post, Body, Patch, UseGuards, Param} from '@nestjs/common';
import {ClienteService} from './cliente.service';
import {CreateClienteDto} from './dto/create-cliente.dto';
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
    listar(){
        return this.clienteService.findAll();
    }

    @Post()
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    crear(@Body() createClienteDto: CreateClienteDto){
        return this.clienteService.create(createClienteDto);

    }
    @Patch('baja/:id')
    async darDeBaja(@Param('id')id: number) {
        return this.clienteService.darDeBaja(id);
    }

}