import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UsuariosModule} from '../usuarios/usuario.module';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {JwtStrategy} from './jwt.strategy';
import {AuthGuard} from "./auth.guard";

@Module({
    imports:[
        UsuariosModule,
        PassportModule,
        JwtModule.register({
            secret: 'CLAVE_SECRETA_TP_DAW',
            signOptions: {expiresIn: '1h'},
        })
    ],
    providers:[AuthService, JwtStrategy, AuthGuard],
    controllers:[AuthController],
    exports: [AuthService, JwtModule, AuthGuard],
})
export class AuthModule{}