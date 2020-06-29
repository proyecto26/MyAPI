import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsEnum, Length, IsNumberString } from 'class-validator'

import { DefaultRole } from './role'

export class AuthPayload {
  @ApiProperty({
    description: 'User id',
    type: String
  })
  @IsNotEmpty()
  sub: string

  @ApiProperty({
    description: 'User role',
    type: DefaultRole
  })
  @IsEnum(DefaultRole)
  role?: DefaultRole
}

export class AuthToken {
  @ApiProperty({
    description: 'user auth token',
    type: String
  })
  @IsNotEmpty()
  access_token: string
}

export class AuthLogin {
  @ApiProperty({
    description: 'Document is required',
    type: String,
    required: true
  })
  @IsNumberString(null, {
    message: 'Document must be a number'
  })
  @IsNotEmpty({
    message: 'Document is required'
  })
  readonly document: string

  @ApiProperty({
    description: 'Password is required',
    type: String,
    required: true,
    minLength: 8
  })
  @Length(8, null, {
    message: 'Password length must be at least 8 digits'
  })
  @IsNotEmpty({
    message: 'Password is required'
  })
  readonly password: string
}