import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Role } from 'src/roles/entities/role.entity';
import { RolesService } from 'src/roles/roles.service';


@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesService],
  imports:[
    ConfigModule,
    TypeOrmModule.forFeature([Usuario, Role]), 
    
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject:[ConfigService],
      useFactory: ( configService: ConfigService ) => {      
        return {
          secret: configService.get('SECRET'),
          signOptions: {
            expiresIn: '10h',
          },
        };
      },
    }),    
  ],
  exports:[TypeOrmModule, JwtStrategy, PassportModule, JwtModule]
})
export class AuthModule {}
