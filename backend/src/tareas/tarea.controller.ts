import { Body, Controller,Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "../auths/auth.guard";
import { TareasService } from "./tarea.service";
import { UpdateTareaDto } from "./dto/update-tarea.dto";
import { CreateTareaDto } from "./dto/create-tarea.dto";
import { AuthModule } from '../auths/auth.module';

@Controller('proyectos/:idProyecto/tareas')
export class TareasController {

    constructor(private readonly tareasService: TareasService) { }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post()
    async crearTarea(@Body() dto: CreateTareaDto, @Param('idProyecto') idProyecto: number): Promise<{ id: number }> {
        
        return await this.tareasService.crearTarea(dto, idProyecto);
    }
    

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Put(':id')
    async actualizarTarea(@Body() dto: UpdateTareaDto, @Param('id') id: number): Promise<void> {

        await this.tareasService.actualizarTarea(dto, id);
    }

}