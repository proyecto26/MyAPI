import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

@Schema()
export class Role {

  constructor(partial?: Partial<Role>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: 'Id of the role', required: false })
  @Prop({ required: true, unique: true })
  id: number

  @ApiProperty({ description: 'Name of the role' })
  @IsNotEmpty({
    message: 'The name is required'
  })
  @Prop({ required: true, trim: true })
  name: string
}

export enum DefaultRole {
  User = 1,
  Admin = 2
}

export type RoleDocument = Role & Document
export const RoleSchema = SchemaFactory.createForClass(Role)