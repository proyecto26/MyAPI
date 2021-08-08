import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

@Schema()
export class DocumentType {

  constructor(partial: Partial<DocumentType>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: 'Id of the document type', required: false })
  @Prop({ required: true, unique: true })
  id: number

  @ApiProperty({ description: 'Name of the document type' })
  @IsNotEmpty({
    message: 'The name is required'
  })
  @Prop({ required: true, trim: true })
  name: string
}

export enum DefaultDocumentType {
  CitizenshipCard = 1,
  Passport = 2
}

export type DocumentTypeDocument = DocumentType & Document
export const DocumentTypeSchema = SchemaFactory.createForClass(DocumentType)