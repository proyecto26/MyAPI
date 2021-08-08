import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { DocumentType, DocumentTypeSchema } from '../../models/documentType'
import { DocumentTypeService } from './documentType.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DocumentType.name, schema: DocumentTypeSchema }])
  ],
  providers: [
    DocumentTypeService,
  ],
  exports: [DocumentTypeService]
})
export class DocumentTypeModule {}