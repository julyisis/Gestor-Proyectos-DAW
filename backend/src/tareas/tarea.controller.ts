import { Body, Controller,Param, Post, Put, Patch, UseGuards, Get, Res } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth } from "@nestjs/swagger";
import { TareasService } from "./tarea.service";
import { UpdateTareaDto } from "./dto/update-tarea.dto";
import { CreateTareaDto } from "./dto/create-tarea.dto";
import { Tarea } from "./tarea.entity";
import {RolesGuard} from '../usuarios/guards/roles.guard';
import {Role} from '../usuarios/usuario.roles.enum';
import { Roles } from '../usuarios/roles.decorator';

@Controller('proyectos/:idProyecto/tareas')
export class TareasController {

    constructor(private readonly tareasService: TareasService) { }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Get()
    async listarTareas(@Param('idProyecto') idProyecto: number): Promise<Tarea[]> {
        return await this.tareasService.listarPorProyecto(idProyecto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post()
    async crearTarea(@Body() dto: CreateTareaDto, @Param('idProyecto') idProyecto: number): Promise<{ id: number }> {
        
        return await this.tareasService.crearTarea(dto, idProyecto);
    }

    @ApiBearerAuth()
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Patch('baja/:id')
    async darDeBaja(@Param('id') id: number): Promise<void> {
        await this.tareasService.darDeBaja(id);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async actualizarTarea(@Body() dto: UpdateTareaDto, @Param('id') id: number): Promise<void> {

        await this.tareasService.actualizarTarea(dto, id);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Get('export/csv')
    async exportarTareasCsv(@Param('idProyecto') idProyecto: number, @Res() res: any): Promise<void> {
        const csv = await this.tareasService.exportarTareasCsv(idProyecto);

        res.header('Content-Type', 'text/csv');
        res.attachment('tareas.csv');
        res.send(csv);
}

}