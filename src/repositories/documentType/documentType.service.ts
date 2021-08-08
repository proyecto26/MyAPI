import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { DocumentType, DocumentTypeDocument } from '../../models/documentType'

@Injectable()
export class DocumentTypeService {
  constructor(
    @InjectModel(DocumentType.name)
    private readonly documentTypeModel: Model<DocumentTypeDocument>
  ) { }

  async findAll(): Promise<DocumentType[]> {
    return await this.documentTypeModel.find().exec()
  }

  async findOne(id: number): Promise<DocumentType> {
    return this.documentTypeModel.findOne({ id }).exec()
  }

  async addDocumentType(documentType: DocumentType): Promise<DocumentType> {
    const createdDocumentType = new this.documentTypeModel(documentType)
    return createdDocumentType.save()
  }

  async update(documentType: DocumentType): Promise<void> {
    await this.documentTypeModel.findOneAndUpdate({ id: documentType.id }, documentType).exec()
  }

  async delete(documentTypeId: number): Promise<void> {
    await this.documentTypeModel.deleteOne({ id: documentTypeId }).exec()
  }
}