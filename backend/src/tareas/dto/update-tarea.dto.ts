import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { CreateTareaDto } from "./create-tarea.dto";
import { EstadosTareas } from "../tarea.entity";

export class UpdateTareaDto extends PartialType(CreateTareaDto) {

    @ApiProperty({ enum: EstadosTareas, example: EstadosTareas.PENDIENTE })
    @IsEnum(EstadosTareas)
    @IsOptional()
    estado?: EstadosTareas;

}