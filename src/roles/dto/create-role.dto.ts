import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateRoleDto {

    @ApiProperty()
    @IsString()
    nombre: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    descripcion?: string

}
