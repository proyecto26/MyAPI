import { Injectable, Inject } from '@nestjs/common'
import { Repository } from 'typeorm'
import { get } from 'lodash'

import { Role } from '../../models/role'
import { REPOSITORIES } from '../../constants'
import { PUBLIC_TABLES } from '../../database'

@Injectable()
export class RoleService {
  constructor(
    @Inject(REPOSITORIES.ROLE)
    private readonly repository: Repository<Role>
  ) { }

  async findAll(): Promise<Role[]> {
    return await this.repository.query(
      `SELECT * FROM ${PUBLIC_TABLES.ROLE}`
    )
  }

  async findById(id: number): Promise<Role> {
    const rawData = await this.repository.query(
      `SELECT * FROM ${PUBLIC_TABLES.ROLE} WHERE id=$1`,
      [ id ]
    )
    return rawData[0]
  }

  async addRole(role: Role): Promise<void> {
    const rawData = await this.repository.query(`SELECT nextval('role_id_seq')`)
    role.id = get(rawData, '0.nextval', role.id)
    await this.repository.query(
      `INSERT INTO ${PUBLIC_TABLES.ROLE} ("id", "name") VALUES ($1, $2)`,
      [ role.id, role.name ]
    )
  }

  async updateRole(role: Role): Promise<void> {
    await this.repository.query(
      `UPDATE ${PUBLIC_TABLES.ROLE} SET name = $2 WHERE id = $1`,
      [ role.id, role.name ]
    )
  }

  async delete(roleId: number): Promise<void> {
    await this.repository.query(
      `DELETE FROM ${PUBLIC_TABLES.ROLE} WHERE id = $1`,
      [ roleId ]
    )
  }
}