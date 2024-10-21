import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {

    @ApiProperty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsString()
    password: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    token?: string

}
