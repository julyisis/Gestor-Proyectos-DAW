import{Injectable, CanActivate, ExecutionContext,ForbiddenException} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {Role} from '../usuario.roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector){}
    
    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles',[
            context.getHandler(),
            context.getClass(),
        ]);
        if(!requiredRoles){
            return true;
        }

    
        const {user} = context.switchToHttp().getRequest();

        return requiredRoles.some((role) => user?.rol === role);
    }

}