import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { AuthPayload } from '../../models/auth'
import { DefaultRole } from '../../models/role'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<DefaultRole[]>('roles', context.getHandler())
    if (!roles || !roles.length) {
      return true
    }
    const request = context.switchToHttp().getRequest()
    const payload = request.user as AuthPayload
    const hasRole = () => !!roles.some(role => role === payload.role)

    return payload && payload.role && hasRole()
  }
}