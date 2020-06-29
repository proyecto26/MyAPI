import { Injectable, Inject } from '@nestjs/common'
import { Repository } from 'typeorm'

import { DocumentType } from '../../models/documentType'
import { REPOSITORIES } from '../../constants'
import { PUBLIC_TABLES } from '../../database'

@Injectable()
export class DocumentTypeService {
  constructor(
    @Inject(REPOSITORIES.DOCUMENT_TYPE)
    private readonly repository: Repository<DocumentType>,
  ) { }

  async getAll(): Promise<DocumentType[]> {
    return await this.repository.query(
      `SELECT * FROM ${PUBLIC_TABLES.DOCUMENT_TYPE};`
    )
  }

  insert(documentType: DocumentType): Promise<void> {
    return this.repository.query(
      `INSERT INTO ${PUBLIC_TABLES.DOCUMENT_TYPE} ("name")
      VALUES ($1);`,
      [ documentType.name ]
    )
  }

  upsert(documentType: DocumentType): Promise<void> {
    return this.repository.query(
      `INSERT INTO ${PUBLIC_TABLES.DOCUMENT_TYPE} ("id", "name") 
      VALUES ($1, $2) 
      ON CONFLICT("id")
      DO UPDATE
      SET name=EXCLUDED.name
      RETURNING id;`, [
        documentType.id,
        documentType.name
      ]
    )
  }

  async delete(documentTypeId: number): Promise<void> {
    await this.repository.query(
      `DELETE FROM ${PUBLIC_TABLES.DOCUMENT_TYPE} WHERE id = $1;`,
      [ documentTypeId ]
    )
  }
}