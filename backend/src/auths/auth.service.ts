import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UsuariosService} from '../usuarios/usuario.service';

@Injectable()
export class AuthService {
    constructor(
        private usuariosService: UsuariosService,
        private jwtService: JwtService,

    ){}

    async login(username: string, pass: string) {
        const usuarioEncontrado = await this.usuariosService.validarAcceso(username, pass);
    


    const payload = { 
        username: usuarioEncontrado.nombreUsuario, 
        sub: usuarioEncontrado.id, 
        rol: usuarioEncontrado.rol 
    };

    return {
    access_token: this.jwtService.sign(payload),
    };
  }
}
