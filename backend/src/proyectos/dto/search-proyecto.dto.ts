import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsIn, IsInt, IsOptional, IsString, Min } from "class-validator";
import { EstadosProyectos } from "../proyecto.entity";

export class SearchProyectoDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    nombre?: string;

    @ApiPropertyOptional({ enum: EstadosProyectos })
    @IsOptional()
    @IsEnum(EstadosProyectos)
    estado?: EstadosProyectos;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    clienteId?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsIn(['nombreProyecto', 'estado', 'id'])
    sortBy?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortOrder?: 'ASC' | 'DESC';

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;
}