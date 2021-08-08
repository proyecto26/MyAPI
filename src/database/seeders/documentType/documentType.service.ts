import { Injectable } from '@nestjs/common';
import { DocumentType } from '../../../models/documentType';
import { DocumentTypeService } from '../../../repositories';
import loadDocumentTypes from './data';
/**
 * Service dealing with role based operations.
 *
 * @class
 */
@Injectable()
export class DocumentTypeSeederService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {DocumentTypeService} documentTypeService
   */
  constructor(private readonly documentTypeService: DocumentTypeService) {}

  /**
   * Seed all documentTypes.
   *
   * @function
   */
  async create(): Promise<DocumentType[]> {
    const documentTypes = await loadDocumentTypes()
    return Promise.all(documentTypes.map(async (documentType) => {
      return await this.documentTypeService.findOne(documentType.id)
        .then(dbDocumentType => {
          // We check if a language already exists.
          // If it does don't create a new one.
          if (dbDocumentType) {
            return Promise.resolve(null)
          }
          return this.documentTypeService.addDocumentType(documentType)
        })
    }))
  }
}
