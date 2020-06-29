import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'document_type' })
export class DocumentType {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 50, type: 'varchar' })
  name: string
}