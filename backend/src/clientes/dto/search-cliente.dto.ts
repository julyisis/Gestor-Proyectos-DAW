import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsIn, IsInt, IsOptional, IsString, Min } from "class-validator";
import { EstadosClientes } from "../cliente.entity";

export class SearchClienteDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    nombre?: string;

    @ApiPropertyOptional({ enum: EstadosClientes })
    @IsOptional()
    @IsEnum(EstadosClientes)
    estado?: EstadosClientes;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    telefono?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    email?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsIn(['nombreCliente', 'estado', 'telefono', 'email', 'id'])
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
