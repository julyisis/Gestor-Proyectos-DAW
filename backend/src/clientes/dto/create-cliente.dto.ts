import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { EstadosClientes } from "../cliente.entity";

export class CreateClienteDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nombreCliente!: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    telefono?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ enum: EstadosClientes })
    @IsEnum(EstadosClientes)
    @IsOptional()
    estado?: EstadosClientes;
}