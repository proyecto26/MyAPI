import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

import { Role, RoleSchema } from './role'
import { DocumentType, DocumentTypeSchema } from './documentType'

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
  createDate?: Date
  updateDate?: Date
}

@Schema()
export class User implements IUser {
  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }

  /**
   * User's document
   */
  @ApiProperty({ description: 'Document of the user' })
  @Prop({ required: true, unique: true, index : true })
  @IsNotEmpty({
    message: 'Identification number is required'
  })
  id: string

  @ApiProperty({ description: 'First name' })
  @Prop({ required: true, trim: true })
  @IsNotEmpty({
    message: 'First name is required'
  })
  firstName: string

  @ApiProperty({ description: 'Last name' })
  @Prop({ required: true, trim: true })
  @IsNotEmpty({
    message: 'Last name is required'
  })
  lastName: string

  @ApiProperty({ description: 'Birthday' })
  @Prop()
  @IsNotEmpty({
    message: 'Date of birth is required'
  })
  birthdate?: Date

  @ApiProperty({ description: 'Address' })
  @Prop({ trim: true })
  address?: string

  @ApiProperty({ description: 'Email' })
  @Prop({ required: true, trim: true, unique: true, isEmail: true })
  @IsEmail({}, {
    message: 'The email is not valid'
  })
  @IsNotEmpty({
    message: 'Email is required'
  })
  email: string

  @ApiProperty({ description: 'Password' })
  @Prop()
  password?: string

  @ApiProperty({ description: 'Phone number' })
  @Prop()
  phoneNumber?: string

  @ApiProperty({ description: 'Authorize terms and conditions' })
  @Prop({ default: false })
  termsAndConditions?: boolean

  @ApiProperty({ description: 'Status' })
  @Prop({ required: true, default: UserStatus.Inactive, enum: [UserStatus.Active, UserStatus.Inactive] })
  @IsNotEmpty({
    message: 'The user status is required'
  })
  status: UserStatus

  @Prop({ default: Date.now })
  createDate: Date

  @Prop({ default: Date.now })
  updateDate: Date

  @ApiProperty({ description: 'Role associated with the user' })
  @Prop({ type: RoleSchema })
  role: Role

  @ApiProperty({ description: 'Document type associated with the user' })
  @IsNotEmpty({
    message: 'The type of document is required'
  })
  @Prop({ type: DocumentTypeSchema })
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

export type UserDocument = User & Document
export const UserSchema = SchemaFactory.createForClass(User)