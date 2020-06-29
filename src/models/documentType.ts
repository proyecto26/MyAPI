import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { IsNotEmpty } from 'class-validator'

import { User } from './user'

@Entity({ name: 'document_type', schema: 'public' })
export class DocumentType {

  constructor(id?: number) {
    this.id = id
  }

  @PrimaryGeneratedColumn()
  id: number

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