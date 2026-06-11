import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tarea } from "./tarea.entity";
import { Proyecto } from "../proyectos/proyecto.entity";
import { UpdateTareaDto } from "./dto/update-tarea.dto";
import { CreateTareaDto } from "./dto/create-tarea.dto";
import { EstadosTareas } from "./tarea.entity";

@Injectable()
export class TareasService {

    constructor(
        @InjectRepository(Tarea)
        private readonly tareasRepository: Repository<Tarea>,

        @InjectRepository(Proyecto)
        private readonly proyectoRepository: Repository<Proyecto>
    ) {}

    async crearTarea(dto: CreateTareaDto, idProyecto: number): Promise<{ id: number }> {

        const proyecto = await this.proyectoRepository.findOne({
            where: { id: idProyecto }
        });

        if (!proyecto) {
            throw new BadRequestException(
                "El proyecto indicado no existe"
            );
        }

        const tarea = this.tareasRepository.create(dto);

        tarea.estado = EstadosTareas.PENDIENTE;
        tarea.proyecto = proyecto;

        await this.tareasRepository.save(tarea);

        return { id: tarea.id };
    }

    async actualizarTarea(
        dto: UpdateTareaDto,
        idTarea: number
    ): Promise<void> {

        const tarea = await this.tareasRepository.findOne({
            where: { id: idTarea }
        });

        if (!tarea) {
            throw new BadRequestException(
                "La tarea indicada no existe"
            );
        }

        this.tareasRepository.merge(tarea, dto);

        await this.tareasRepository.save(tarea);
    }
}