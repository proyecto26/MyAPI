import { Injectable, Inject } from '@nestjs/common'
import { Repository } from 'typeorm'
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
    const roleId = get(user, 'role.id', user['roleId']) as string
    const documentTypeId = get(user, 'documentType.id', user['documentTypeId']) as string
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
    search = '',
    offset = 0,
    limit = 10
  ): Promise<IUser[]> {
    return this.repository.query(
      `SELECT u.*,
        row_to_json(r) as "role",
        row_to_json(dt) as "documentType"
      FROM ${PUBLIC_TABLES.USER} u
      LEFT OUTER JOIN document_type dt ON u."documentTypeId" = dt.id
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

  async findByDocument(document: string): Promise<User> {
    const rawData = await this.repository.query(
      `SELECT
          u.*,
          row_to_json(r) as role,
          row_to_json(dt) as "documentType"
        FROM ${PUBLIC_TABLES.USER} u
        LEFT OUTER JOIN role r ON u."roleId" = r.id
        LEFT OUTER JOIN document_type dt ON u."documentTypeId" = dt.id
        WHERE u.id=$1;`,
      [ document ]
    )
    return rawData[0]
  }

  async addUser(user: IUser): Promise<void> {
    const currentDate = new Date().toISOString()
    const newUser = this.preloadUser(user)
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
    await this.repository.query(
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
    const newUser = this.preloadUser(user)
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
}