import { Module } from '@nestjs/common'

import { DatabaseModule } from '../../database'
import { documentTypeProviders } from './documentType.providers'
import { DocumentTypeService } from './documentType.service'

@Module({
  imports: [DatabaseModule],
  providers: [
    ...documentTypeProviders,
    DocumentTypeService,
  ],
  exports: [DocumentTypeService]
})
export class DocumentTypeModule {}