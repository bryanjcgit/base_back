import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorator/get-user.decorator';
import { Usuario } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { RolProtected } from './decorator/rol-protected.decorator';
import { Rol } from './interfaces/valid-rol';
import { Auth } from './decorator/auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register') 
  create(
    @Body() createUserDto: CreateUserDto,  
  ){
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(
    @Body() loginUserDto: LoginUserDto
  ) {
    return this.authService.login(loginUserDto);
  }

  @Get('revalidate')
  @UseGuards(AuthGuard())
  validateToken(
    @Req() req: Express.Request,
    @GetUser() user: Usuario,   
  ) {
    return {
      ok: true,
      msg: 'Validando el token',
      user      
    }
  }

  @Get('validate')
  @RolProtected(Rol.user)
  @UseGuards(AuthGuard(), UserRoleGuard)
  findvalidateUser(
    @GetUser() user: Usuario,
    
  ) {
    return {
      ok: true,
      user
    }
  }
  @Get('validateData')
  @Auth()
  validateData(
    @GetUser() user: Usuario,
    
  ) {
    return {
      ok: true,
      user
    }
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user:Usuario
  ){
    return this.authService.checkAuthStatus(user)
  }



  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
