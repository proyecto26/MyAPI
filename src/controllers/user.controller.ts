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
  LoggerService,
  Body,
  ParseIntPipe,
  ParseArrayPipe,
  DefaultValuePipe,
  NotFoundException
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
  ApiQuery,
  ApiNotFoundResponse,
  ApiForbiddenResponse
} from '@nestjs/swagger'
import { Request as RequestBody } from 'express'
import { AuthGuard } from '@nestjs/passport'
import { isEmpty } from 'lodash'

import { ERRORS, POSTGRES } from '../constants'
import { UserService } from '../repositories'
import { IUser, User, UserPasswords } from '../models/user'
import { DefaultRole, Role } from '../models/role'
import { AuthPayload } from '../models/auth'
import { encryptPassword, RolesGuard, Roles }  from '../auth'

@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(AuthGuard())
@Controller('/api/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(Logger) private readonly logger: LoggerService
  ) { }

  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'List of users', type: User, isArray: true })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @ApiForbiddenResponse({ description: 'You do not have the necessary role to perform this action' })
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
  @UseGuards(RolesGuard)
  @Roles(DefaultRole.Admin)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query(
      'search',
      new DefaultValuePipe('')
    ) search: string,
    @Query(
      'offset',
      new DefaultValuePipe(0),
      ParseIntPipe
    ) offset: number,
    @Query(
      'limit',
      new DefaultValuePipe(10),
      ParseIntPipe
    ) limit: number
  ): Promise<Array<User>> {
    const users = await this.userService.findByRoleIds(
      [DefaultRole.Admin, DefaultRole.User],
      search,
      offset,
      limit
    )
    return users as User[]
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
    return this.userService.findByDocument(req.user.sub)
  }

  @ApiOperation({ summary: 'Get the info of a user by document' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'You do not have the necessary role to perform this action' })
  @ApiOkResponse({
    type: User,
    description: 'User information'
  })
  @UseGuards(RolesGuard)
  @Roles(DefaultRole.Admin)
  @Get(':document')
  @HttpCode(HttpStatus.OK)
  async findByDocument(
    @Param('document') document: string
  ): Promise<User> {
    const user = await this.userService.findByDocument(document)
    if (user) {
      return user
    } else {
      throw new NotFoundException(ERRORS.USER_NOT_FOUND)
    }
  }

  @ApiOperation({ summary: 'Create a user' })
  @ApiBody({ type: User, description: 'User information' })
  @ApiCreatedResponse({ description: 'The user was created successfully' })
  @ApiBadRequestResponse({ description: 'The user could not be created' })
  @ApiForbiddenResponse({ description: 'You do not have the necessary role to perform this action' })
  @UseGuards(RolesGuard)
  @Roles(DefaultRole.Admin)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addUser(
    @Body() user: User
  ): Promise<void> {
    try {
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
  @ApiForbiddenResponse({ description: 'You do not have the necessary role to perform this action' })
  @UseGuards(RolesGuard)
  @Roles(DefaultRole.Admin)
  @Put()
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Body() user: User
  ): Promise<void> {
    try {
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
  @ApiForbiddenResponse({ description: 'You do not have the necessary role to perform this action' })
  @UseGuards(RolesGuard)
  @Roles(DefaultRole.Admin)
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

  @ApiOperation({ summary: 'Add new users' })
  @ApiBody({ type: User, isArray: true, description: 'Info of the users' })
  @ApiCreatedResponse({ description: 'The users were created successfully' })
  @ApiBadRequestResponse({ description: 'The users could not be created' })
  @ApiForbiddenResponse({ description: 'You do not have the necessary role to perform this action' })
  @UseGuards(RolesGuard)
  @Roles(DefaultRole.Admin)
  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  async createBulk(
    @Body(new ParseArrayPipe({ items: User })) users: User[]
  ): Promise<void> {
    try {
      await this.userService.addUsers(users)
    } catch (error) {
      /**
       * Validate database exceptions
       */
      switch(error.code) {
        case POSTGRES.UNIQUE_VIOLATION:
          throw new BadRequestException(ERRORS.UNIQUE_VIOLATION)
        default:
          this.logger.error(error.message, 'ADD_USERS')
          throw new BadRequestException(error.message)
      }
    }
  }
}
