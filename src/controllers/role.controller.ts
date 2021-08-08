import {
  Controller,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Post,
  BadRequestException,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Inject,
  Logger,
  LoggerService,
  Body
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse
} from '@nestjs/swagger'

import { ERRORS, DATABASE } from '../constants'
import { RoleService } from '../repositories'
import { Role, DefaultRole } from '../models/role'
import { Roles, RolesGuard } from '../auth'

@ApiBearerAuth()
@ApiTags('Roles')
@UseGuards(AuthGuard(), RolesGuard)
@Roles(DefaultRole.Admin)
@Controller('/api/roles')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    @Inject(Logger) private readonly logger: LoggerService
  ) { }

  @ApiOperation({ summary: 'Get the list of roles' })
  @ApiOkResponse({ description: 'Role list' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @ApiForbiddenResponse({ description: 'You do not have the necessary role to perform this action' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Role[]> {
    return await this.roleService.findAll()
  }

  @ApiOperation({ summary: 'Create a new role' })
  @ApiBody({ type: Role, description: 'Role information' })
  @ApiCreatedResponse({ description: 'The role was created successfully' })
  @ApiBadRequestResponse({ description: 'The role could not be created' })
  @ApiForbiddenResponse({ description: 'You do not have the necessary role to perform this action' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addRole(
    @Body() role: Role
  ): Promise<void> {
    try {
      await this.roleService.addRole(role)
    } catch (error) {
      /**
       * Validate database exceptions
       */
      switch(error.code) {
        case DATABASE.UNIQUE_VIOLATION:
          throw new BadRequestException(ERRORS.UNIQUE_VIOLATION)
        default:
          this.logger.error(error.message, 'ADD_ROLE')
          throw new BadRequestException(error.message)
      }
    }
  }

  @ApiOperation({ summary: 'Update a role' })
  @ApiBody({ type: Role, description: 'Role information' })
  @ApiOkResponse({ description: 'The role was updated successfully' })
  @ApiBadRequestResponse({ description: 'The role could not be updated' })
  @ApiForbiddenResponse({ description: 'You do not have the necessary role to perform this action' })
  @Put()
  @HttpCode(HttpStatus.OK)
  async updateRole(
    @Body() role: Role
  ): Promise<void> {
    try {
      await this.roleService.updateRole(role)
    } catch (error) {
      /**
       * Validate database exceptions
       */
      switch(error.code) {
        case DATABASE.UNIQUE_VIOLATION:
          throw new BadRequestException(ERRORS.UNIQUE_VIOLATION)
        default:
          this.logger.error(error.message, 'UPDATE_ROLE')
          throw new BadRequestException(error.message)
      }
    }
  }

  @ApiOperation({ summary: 'Delete a role' })
  @ApiOkResponse({ description: 'Role deleted' })
  @ApiBadRequestResponse({ description: 'The role could not be deleted' })
  @ApiForbiddenResponse({ description: 'You do not have the necessary role to perform this action' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    if (id === DefaultRole.User) {
      throw new BadRequestException(ERRORS.ROLE_USER_DELETION)
    } else if (id === DefaultRole.Admin) {
      throw new BadRequestException(ERRORS.ROLE_ADMIN_DELETION)
    }
    try {
      await this.roleService.delete(id)
    } catch (error) {
      this.logger.error(error.message, 'DELETE_ROLE')
      throw new BadRequestException(error.message)
    }
  }
}
