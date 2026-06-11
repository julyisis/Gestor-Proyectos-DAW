import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { EstadosProyectos } from "../proyecto.entity";

export class CreateProyectoDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nombreProyecto!: string;

    @ApiPropertyOptional({ enum: EstadosProyectos })
    @IsEnum(EstadosProyectos)
    @IsOptional()
    estado?: EstadosProyectos;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    clienteId?: number;
}