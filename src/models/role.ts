import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

import { User } from './user'

@Entity({ schema: 'public' })
export class Role {

  constructor(id?: number) {
    this.id = id
  }

  @ApiProperty({ description: 'Id of the role', required: false })
  @PrimaryGeneratedColumn()
  id: number

  @IsNotEmpty({
    message: 'The name is required'
  })
  @ApiProperty({ description: 'Name of the role' })
  @Column({ length: 50, type: 'varchar' })
  name: string

  @OneToMany(() => User, (user: User) => user.role)
  users: User[]
}

export enum DefaultRole {
  User = 1,
  Admin = 2
}