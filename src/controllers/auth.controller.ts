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
  @ApiOperation({ summary: 'Validate authentication token' })
  @ApiOkResponse({ description: 'Authentication token is valid' })
  @ApiUnauthorizedResponse({ description: 'The authentication token is invalid' })
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  isAuthenticated(): void { }

  @UseGuards(AuthGuard('local'))
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user' })
  @ApiBody({ description: 'User credentials', type: AuthLogin })
  @ApiOkResponse({ description: 'Authentication token', type: AuthToken })
  @ApiUnauthorizedResponse({ description: 'The document or password entered are not valid' })
  @ApiForbiddenResponse({ description: 'You do not have the necessary role to perform this action' })
  authenticate(
    @Request() request: { user: User }
  ): Promise<AuthToken> {
    return this.authService.getAccessToken(request.user)
  }
}