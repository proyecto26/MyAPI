import { Connection, Repository } from 'typeorm'

import { DocumentType } from '../../models/documentType'
import { DATABASE_CONNECTION, REPOSITORIES } from '../../constants'

export const documentTypeProviders = [
  {
    provide: REPOSITORIES.DOCUMENT_TYPE,
    useFactory: (connection: Connection): Repository<DocumentType> => connection.getRepository(DocumentType),
    inject: [DATABASE_CONNECTION],
  }
]