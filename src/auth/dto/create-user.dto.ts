import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsJSON, IsObject, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @ApiProperty()
    @IsString({
        message: 'El nombre debe ser una cadena de texto'
    })
    nombre: string;

    @ApiProperty()
    @IsString({
        message: 'El username debe ser una cadena de texto'
    })
    username: string;

    @ApiProperty()
    @IsString({
        message: 'Necesitas un rol'
    })   
    rol: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    estado?: boolean


}
