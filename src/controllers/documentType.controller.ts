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
  LoggerService
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

import { DocumentType } from '../models/documentType'
import { DocumentTypeService, UserService } from '../repositories'
import { ERRORS } from '../constants'

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

  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create document type' })
  @ApiOkResponse({ description: 'The document type has been created successfully' })
  @ApiBadRequestResponse({ description: 'The document type could not be created' })
  @Post()
  @HttpCode(HttpStatus.OK)
  async addDocumentType(
    @Request() req: RequestBody,
  ): Promise<void> {
    try {
      await this.documentTypeService.insert(req.body)
    } catch (error) {
      switch (error.code) {
        default:
          this.logger.error(error.message, 'ADD_DOCUMENT_TYPE')
          throw new BadRequestException(error.message)
      }
    }
  }

  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update document type' })
  @ApiOkResponse({ description: 'The document type has been updated successfully' })
  @ApiBadRequestResponse({ description: 'The document type could not be updated' })
  @Put()
  @HttpCode(HttpStatus.OK)
  updateDocumentType(
    @Request() req: RequestBody,
  ): Promise<void> {
    try {
      return this.documentTypeService.upsert(req.body)
    } catch (error) {
      switch (error.code) {
        default:
          this.logger.error(error.message, 'UPDATE_DOCUMENT_TYPE')
          throw new BadRequestException(error.message)
      }
    }
  }

  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete document type' })
  @ApiOkResponse({ description: 'The document type has been deleted successfully' })
  @ApiBadRequestResponse({ description: 'The document type could not be deleted' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteDocumentType(
    @Param('id', new ParseIntPipe()) id: number
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
