import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Request,
  UseGuards,
  Post,
  BadRequestException,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  Inject,
  Logger,
  LoggerService,
  Body
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiBadRequestResponse
} from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { Request as RequestBody } from 'express'

import { DefaultRole } from '../models/role'
import { DocumentType } from '../models/documentType'
import { DocumentTypeService, UserService } from '../repositories'
import { ERRORS } from '../constants'
import { RolesGuard, Roles } from '../auth'

@ApiTags('Document Types')
@Controller('/api/documentTypes')
export class DocumentTypeController {
  constructor(
    private readonly userService: UserService,
    private readonly documentTypeService: DocumentTypeService,
    @Inject(Logger) private readonly logger: LoggerService
  ) { }

  @ApiOperation({ summary: 'Get document types' })
  @ApiOkResponse({ description: 'List of document types', isArray: true, type: DocumentType })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllAnonymous(): Promise<DocumentType[]> {
    return this.documentTypeService.getAll()
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create document type' })
  @ApiOkResponse({ description: 'The document type has been created successfully' })
  @ApiBadRequestResponse({ description: 'The document type could not be created' })
  @UseGuards(AuthGuard())
  @UseGuards(RolesGuard)
  @Roles(
    DefaultRole.Admin
  )
  @Post()
  @HttpCode(HttpStatus.OK)
  async addDocumentType(
    @Body() documentType: DocumentType,
  ): Promise<void> {
    try {
      await this.documentTypeService.insert(documentType)
    } catch (error) {
      switch (error.code) {
        default:
          this.logger.error(error.message, 'ADD_DOCUMENT_TYPE')
          throw new BadRequestException(error.message)
      }
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update document type' })
  @ApiOkResponse({ description: 'The document type has been updated successfully' })
  @ApiBadRequestResponse({ description: 'The document type could not be updated' })
  @UseGuards(AuthGuard())
  @UseGuards(RolesGuard)
  @Roles(
    DefaultRole.Admin
  )
  @Put()
  @HttpCode(HttpStatus.OK)
  updateDocumentType(
    @Body() documentType: DocumentType,
  ): Promise<void> {
    try {
      return this.documentTypeService.upsert(documentType)
    } catch (error) {
      switch (error.code) {
        default:
          this.logger.error(error.message, 'UPDATE_DOCUMENT_TYPE')
          throw new BadRequestException(error.message)
      }
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete document type' })
  @ApiOkResponse({ description: 'The document type has been deleted successfully' })
  @ApiBadRequestResponse({ description: 'The document type could not be deleted' })
  @UseGuards(AuthGuard())
  @UseGuards(RolesGuard)
  @Roles(
    DefaultRole.Admin
  )
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteDocumentType(
    @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    if (await this.userService.countByDocumentTypeId(id) > 0) {
      throw new BadRequestException(ERRORS.USER_HAS_DOCUMENT_TYPE)
    }
    try {
      await this.documentTypeService.delete(id)
    } catch (error) {
      switch (error.code) {
        default:
          this.logger.error(error.message, 'DELETE_DOCUMENT_TYPE')
          throw new BadRequestException(error.message)
      }
    }
  }
}
