import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { User } from './user'

@Entity({ name: 'document_type', schema: 'public' })
export class DocumentType {

  constructor(partial: Partial<DocumentType>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: 'Id of the document type', required: false })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: 'Name of the document type' })
  @IsNotEmpty({
    message: 'The name is required'
  })
  @Column({ length: 50, type: 'varchar' })
  name: string

  @OneToMany(() => User, (user: User) => user.documentType)
  users: User[]
}

export enum DefaultDocumentType {
  CitizenshipCard = 1,
  Passport = 2
}