import {
  Controller,
  Request,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth
} from '@nestjs/swagger'

import { AuthService } from '../auth'
import { AuthToken, AuthLogin } from '../models/auth'
import { User } from '../models/user'

@ApiTags('Authentication')
@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validar token de autenticación' })
  @ApiOkResponse({ description: 'El token de autenticación es válido' })
  @ApiUnauthorizedResponse({ description: 'El token de autenticación no es válido' })
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  isAuthenticated(): void { }

  @UseGuards(AuthGuard('local'))
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ description: 'User credentials', type: AuthLogin })
  @ApiOkResponse({ description: 'Token de autenticación', type: AuthToken })
  @ApiUnauthorizedResponse({ description: 'El documento o contraseña ingresados no son válidos' })
  @ApiForbiddenResponse({ description: 'No cuenta con el rol necesario para realizar esta acción' })
  authenticate(
    @Request() request: { user: User }
  ): Promise<AuthToken> {
    console.log(request.user)
    return this.authService.getAccessToken(request.user)
  }
}