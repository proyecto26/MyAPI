import { Injectable, Inject } from '@nestjs/common'
import { Repository, QueryRunner } from 'typeorm'
import { get } from 'lodash'

import { User, IUser } from '../../models/user'
import { REPOSITORIES } from '../../constants'
import { PUBLIC_TABLES } from '../../database'
import { getParamValues, trimStringProps, stringToJSON } from '../utils'

@Injectable()
export class UserService {
  constructor(
    @Inject(REPOSITORIES.USER)
    private readonly repository: Repository<User>
  ) { }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  preloadUser(user: User) {
    user.role = stringToJSON(user.role)
    user.documentType = stringToJSON(user.documentType)
    const roleId = get(user, 'role.id', user['roleId']) as number
    const documentTypeId = get(user, 'documentType.id', user['documentTypeId']) as number
    return {
      ...trimStringProps(user),
      roleId,
      documentTypeId
    }
  }

  async findAll(): Promise<User[]> {
    return await this.repository.query(
      `SELECT * FROM ${PUBLIC_TABLES.USER};`
    )
  }

  async findByRoleIds(
    roles: number[],
    search: string,
    offset: number,
    limit: number
  ): Promise<IUser[]> {
    return this.repository.query(
      `SELECT u.*
      FROM ${PUBLIC_TABLES.USER} u
      LEFT OUTER JOIN role r ON u."roleId" = r.id
      WHERE u."roleId" IN (${roles.toString()}) AND (
        LOWER(u."id") LIKE LOWER($1)
        OR LOWER(u."email") LIKE LOWER($1)
        OR LOWER(u."firstName") LIKE LOWER($1)
        OR LOWER(u."lastName") LIKE LOWER($1)
      )
      LIMIT $2 OFFSET $3;`,
      [`%${search}%`, limit, offset]
    )
  }

  async findByEmail(email: string): Promise<User> {
    const rawData = await this.repository.query(
      `SELECT * FROM ${PUBLIC_TABLES.USER} WHERE email = $1;`,
      [ email ]
    )
    return rawData[0]
  }

  async findOne(id: string): Promise<User> {
    return this.repository.findOne(id, {
      relations: ['role', 'documentType']
    })
  }

  async addUser(
    user: IUser,
    queryRunner: QueryRunner = this.repository.queryRunner
  ): Promise<void> {
    const currentDate = new Date().toISOString()
    const newUser = this.preloadUser(user as User)
    const parameters = [
      newUser.id,
      newUser.email,
      newUser.firstName,
      newUser.lastName,
      newUser.password,
      newUser.roleId,
      newUser.documentTypeId,
      newUser.birthdate,
      newUser.address,
      newUser.phoneNumber,
      newUser.termsAndConditions,
      newUser.status,
      currentDate,
      currentDate
    ]
    await queryRunner.query(
      `INSERT INTO ${PUBLIC_TABLES.USER} (
        "id",
        "email",
        "firstName",
        "lastName",
        "password",
        "roleId",
        "documentTypeId",
        "birthdate",
        "address",
        "phoneNumber",
        "termsAndConditions",
        "status",
        "createDate",
        "updateDate"
      )
      VALUES (${getParamValues(parameters.length)});`,
      parameters
    )
  }

  async updateUser(user: IUser): Promise<User> {
    const updateDate = new Date().toISOString()
    const newUser = this.preloadUser(user as User)
    await this.repository.query(
      `UPDATE ${PUBLIC_TABLES.USER}
      SET "email" = $2,
        "firstName" = $3,
        "lastName" = $4,
        "roleId" = $5,
        "documentTypeId" = $6,
        "birthdate" = $7,
        "address" = $8,
        "phoneNumber" = $9,
        "termsAndConditions" = $10,
        "status" = $11,
        "updateDate" = $12
      WHERE id = $1;`, [
        newUser.id,
        newUser.email,
        newUser.firstName,
        newUser.lastName,
        newUser.roleId,
        newUser.documentTypeId,
        newUser.birthdate,
        newUser.address,
        newUser.phoneNumber,
        newUser.termsAndConditions,
        newUser.status,
        updateDate
      ]
    )
    return newUser
  }

  deleteByDocument(document: string): Promise<void> {
    return this.repository.query(
      `DELETE FROM ${PUBLIC_TABLES.USER} WHERE id = $1;`,
      [ document ]
    )
  }

  async updatePassword(
    document: string,
    newPassword: string
  ): Promise<void> {
    const updateDate = new Date().toISOString()
    await this.repository.query(
      `UPDATE ${PUBLIC_TABLES.USER}
      SET "password" = $2,
        "updateDate" = $3
      WHERE id = $1;`, [
        document,
        newPassword,
        updateDate
      ]
    )
  }

  async countByDocumentTypeId(documentTypeId: number = null): Promise<number> {
    const rawData = await this.repository.query(
      `SELECT COUNT(*) AS count
      FROM ${PUBLIC_TABLES.USER}
      WHERE "documentTypeId" = $1;`,
      [documentTypeId]
    )
    return Number(rawData[0].count)
  }

  async addUsers(users: IUser[]): Promise<void> {
    const queryRunner = this.repository.manager.connection.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      for (const user of users) {
        await this.addUser(user, queryRunner)
      }
      await queryRunner.commitTransaction()
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }
}