import {
  Entity,
  Index,
  Column,
  ManyToOne,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

import { Role } from './role'
import { DocumentType } from './documentType'

export enum UserStatus {
  Inactive = 'INACTIVE',
  Active = 'ACTIVE'
}

export interface IUser {
  id: string
  firstName: string
  lastName: string
  status: UserStatus
  documentType: DocumentType
  email: string
  role: Role
  createDate: Date
  updateDate: Date
}

@Entity({ schema: 'public' })
export class User implements IUser {
  constructor (id?: string) {
    this.id = id
  }

  /**
   * User's document
   */
  @ApiProperty({ description: 'Document of the user' })
  @PrimaryColumn('text')
  @IsNotEmpty({
    message: 'Identification number is required'
  })
  id: string

  @ApiProperty({ description: 'First name' })
  @Column('varchar', { length: 50, name: 'firstName' })
  @IsNotEmpty({
    message: 'First name is required'
  })
  firstName: string

  @ApiProperty({ description: 'Last name' })
  @Column('varchar', { length: 50, name: 'lastName' })
  @IsNotEmpty({
    message: 'Last name is required'
  })
  lastName: string

  @ApiProperty({ description: 'Birthday' })
  @Column({ type: 'timestamp without time zone' })
  @IsNotEmpty({
    message: 'Date of birth is required'
  })
  birthdate?: string

  @ApiProperty({ description: 'Address' })
  @Column('varchar', { length: 50, nullable: true })
  @IsNotEmpty({
    message: 'Address is required'
  })
  address?: string

  @ApiProperty({ description: 'Email' })
  @Column('varchar', { length: 50 })
  @Index('IDX_USER_EMAIL', { unique: true })
  @IsEmail(null, {
    message: 'The email is not valid'
  })
  @IsNotEmpty({
    message: 'Email is required'
  })
  email: string

  @ApiProperty({ description: 'Password' })
  @Column('text', { nullable: true })
  password?: string

  @ApiProperty({ description: 'Phone number' })
  @Column('varchar', { length: 20, nullable: true })
  phoneNumber?: string

  @ApiProperty({ description: 'Authorize terms and conditions' })
  @Column('boolean', { default: false })
  termsAndConditions?: boolean

  @ApiProperty({ description: 'Status' })
  @Column('text', { default: UserStatus.Inactive })
  @IsNotEmpty({
    message: 'The user status is required'
  })
  status: UserStatus

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createDate: Date

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updateDate: Date
  
  @Column('int')
  roleId!: number

  @ApiProperty({ description: 'Role associated with the user' })
  @ManyToOne(() => Role, role => role.users)
  role: Role

  @ApiProperty({ description: 'Document type associated with the user' })
  @IsNotEmpty({
    message: 'The type of document is required'
  })
  @ManyToOne(() => DocumentType, documentType => documentType.users)
  documentType: DocumentType
}

export class UserPasswords {
  @ApiProperty({ description: 'User password' })
  @IsNotEmpty({
    message: 'The password is required'
  })
  password: string

  @ApiProperty({ description: 'Repeat user password' })
  @IsNotEmpty({
    message: 'Repeat password is required'
  })
  repeatPassword: string
}
