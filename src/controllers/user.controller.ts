import {
  Controller,
  Request,
  Get,
  UseGuards,
  Param,
  HttpStatus,
  HttpCode,
  Post,
  BadRequestException,
  Put,
  Delete,
  Query,
  Logger,
  Inject,
  LoggerService
} from '@nestjs/common'
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiQuery
} from '@nestjs/swagger'
import { Request as RequestBody } from 'express'
import { AuthGuard } from '@nestjs/passport'
import { validate } from 'class-validator'
import { values, merge, isEmpty } from 'lodash'

import { ERRORS, POSTGRES } from '../constants'
import { UserService } from '../repositories'
import { User, UserPasswords } from '../models/user'
import { DefaultRole, Role } from '../models/role'
import { AuthPayload } from '../models/auth'
import { encryptPassword }  from '../auth/utils'

@UseGuards(AuthGuard())
@ApiBearerAuth()
@ApiTags('Users')
@Controller('/api/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(Logger) private readonly logger: LoggerService
  ) { }

  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'List of users', type: User, isArray: true })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number
  })
  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number
  ): Promise<Array<User>> {
    const users = await this.userService.findByRoleIds(
      [DefaultRole.User],
      search,
      offset,
      limit
    )
    return users
  }

  private async getUserByDocument(userId): Promise<User> {
    const user = await this.userService.findByDocument(userId)
    delete user.password
    return user
  }

  @ApiOperation({ summary: 'Get the info of the current user' })
  @ApiOkResponse({
    type: User,
    description: 'Current user information',
  })
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getProfile(
    @Request() req: { user: AuthPayload }
  ): Promise<User> {
    return this.getUserByDocument(req.user.sub)
  }

  @ApiOperation({ summary: 'Get the info of a user by document' })
  @ApiOkResponse({
    type: User,
    description: 'User information'
  })
  @Get(':document')
  @HttpCode(HttpStatus.OK)
  async findByDocument(
    @Param('document') document: string
  ): Promise<User> {
    return this.getUserByDocument(document)
  }

  @ApiOperation({ summary: 'Create a user' })
  @ApiBody({ type: User, description: 'User information' })
  @ApiCreatedResponse({ description: 'The user was created successfully' })
  @ApiBadRequestResponse({ description: 'The user could not be created' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addUser(@Request() req: RequestBody): Promise<void> {
    try {
      /**
       * Validate the body of the request
       */
      const user = merge<User, User>(new User(), req.body)
      const errors = await validate(user)
      if (errors.length) {
        throw new Error(values(errors[0].constraints)[0])
      }
      user.role = new Role(DefaultRole.User)
      await this.userService.addUser(user)
    } catch (error) {
      /**
       * Validate database exceptions
       */
      switch(error.code) {
        case POSTGRES.UNIQUE_VIOLATION:
          throw new BadRequestException(ERRORS.UNIQUE_VIOLATION)
        default:
          this.logger.error(error.message, 'ADD_USER')
          throw new BadRequestException(error.message)
      }
    }
  }

  @ApiOperation({ summary: 'Update a user' })
  @ApiBody({ type: User, description: 'User information' })
  @ApiOkResponse({ description: 'The user was updated successfully' })
  @ApiBadRequestResponse({ description: 'The user could not be updated' })
  @Put()
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Request() req: RequestBody
  ): Promise<void> {
    try {
      /**
       * Validate the body of the request
       */
      const user = merge<User, User>(new User(), req.body)
      const errors = await validate(user)
      if (errors.length) {
        throw new Error(values(errors[0].constraints)[0])
      }

      await this.userService.updateUser(user)
    } catch (error) {
      /**
       * Validate database exceptions
       */
      switch(error.code) {
        case POSTGRES.UNIQUE_VIOLATION:
          throw new BadRequestException(ERRORS.UNIQUE_VIOLATION)
        default:
          this.logger.error(error.message, 'UPDATE_USER')
          throw new BadRequestException(error.message)
      }
    }
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiOkResponse({ description: 'User deleted' })
  @ApiBadRequestResponse({ description: 'The user could not be deleted' })
  @Delete(':document')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('document') document: string
  ): Promise<void> {
    try {
      await this.userService.deleteByDocument(document)
    } catch (error) {
      this.logger.error(error.message, 'DELETE_USER')
      throw new BadRequestException(error.message)
    }
  }

  @ApiOperation({ summary: 'Change user password' })
  @ApiBody({ type: UserPasswords, description: 'User password' })
  @ApiOkResponse({ description: 'Updated password' })
  @ApiBadRequestResponse({ description: 'The password could not be updated' })
  @Put('update-password')
  @HttpCode(HttpStatus.OK)
  async updatePassword (
    @Request() req: RequestBody<any, any, UserPasswords> & { user: AuthPayload }
  ): Promise<void> {
    const { password, repeatPassword } = req.body
    if (isEmpty(password)) {
      throw new BadRequestException('Password is required')
    } else if (password !== repeatPassword) {
      throw new BadRequestException('Passwords do not match')
    }
    try {
      const hashedPassword = await encryptPassword(password)
      await this.userService.updatePassword(req.user.sub, hashedPassword)
    } catch (error) {
      this.logger.error(error.message, 'UPDATE_PASSWORD')
      throw new BadRequestException(error.message)
    }
  }
}
