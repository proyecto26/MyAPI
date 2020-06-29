import {
  Table,
  QueryRunner,
  MigrationInterface
} from 'typeorm'

import { UserStatus } from '../../models/user'
import { DefaultRole } from '../../models/role'
import {
  PUBLIC_TABLES,
  COLUMN_TYPES,
  FOREIGN_KEYS,
  createAndUpdateDates,
  createForeignKeyOption,
  INDICES,
  EnumToArray
} from '../utils'

export class Initialize1569118664968 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {

    console.log('************** CREATE PUBLIC SCHEMA **************')
    await queryRunner.createTable(new Table({
      name: PUBLIC_TABLES.ROLE,
      columns: [
        {
          name: 'id',
          type: COLUMN_TYPES.INT,
          isPrimary: true,
          isGenerated: true
        },
        { name: 'name', type: COLUMN_TYPES.VARCHAR, length: '50' }
      ]
    }), true)

    await queryRunner.createTable(new Table({
      name: PUBLIC_TABLES.DOCUMENT_TYPE,
      columns: [
        {
          name: 'id',
          type: COLUMN_TYPES.INT,
          isPrimary: true,
          isGenerated: true
        },
        { name: 'name', type: COLUMN_TYPES.VARCHAR, length: '50' }
      ]
    }), true)
    
    await queryRunner.createTable(new Table({
      name: PUBLIC_TABLES.USER,
      columns: [
        { name: 'id', type: COLUMN_TYPES.TEXT, isPrimary: true, isGenerated: false },
        { name: 'password', type: COLUMN_TYPES.TEXT, isNullable: true },
        { name: 'firstName', type: COLUMN_TYPES.VARCHAR, length: '50' },
        { name: 'lastName', type: COLUMN_TYPES.VARCHAR, length: '50' },
        { name: 'email', type: COLUMN_TYPES.VARCHAR, length: '50' },
        { name: 'status', type: COLUMN_TYPES.TEXT, enum: EnumToArray(UserStatus) },
        { name: 'birthdate', type: COLUMN_TYPES.TIMESTAMP_UTC, isNullable: true },
        { name: 'address', type: COLUMN_TYPES.VARCHAR, length: '50', isNullable: true },
        { name: 'phoneNumber', type: COLUMN_TYPES.VARCHAR, length: '20', isNullable: true },
        { name: 'termsAndConditions', type: COLUMN_TYPES.BOOLEAN, default: false },
        { name: FOREIGN_KEYS.ROLE_ID, type: COLUMN_TYPES.INT },
        { name: FOREIGN_KEYS.DOCUMENT_TYPE_ID, type: COLUMN_TYPES.INT, isNullable: true },
        ...createAndUpdateDates
      ],
      foreignKeys: [
        createForeignKeyOption(FOREIGN_KEYS.ROLE_ID, PUBLIC_TABLES.ROLE),
        createForeignKeyOption(FOREIGN_KEYS.DOCUMENT_TYPE_ID, PUBLIC_TABLES.DOCUMENT_TYPE),
      ],
      indices: [
        { name: INDICES.USER_EMAIL, columnNames: ['email'], isUnique: true }
      ]
    }), true)

    // INSERT DATA
    await queryRunner.query(
      `INSERT INTO ${PUBLIC_TABLES.ROLE} (id, name)
      VALUES ($1, $2), ($3, $4);`, [
      DefaultRole.User, 'User',
      DefaultRole.Admin, 'Admin',
    ])

    await queryRunner.query(
      `INSERT INTO ${PUBLIC_TABLES.DOCUMENT_TYPE} (name)
      VALUES ($1), ($2);`, [
      'Citizenship card',
      'Passport'
    ])

    console.log('************** PUBLIC SCHEMA CREATED **************')
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    console.log('************** REVERT PUBLIC SCHEMA **************')

    await queryRunner.dropTable(PUBLIC_TABLES.USER)
    await queryRunner.dropTable(PUBLIC_TABLES.DOCUMENT_TYPE)
    await queryRunner.dropTable(PUBLIC_TABLES.ROLE)
  }
}
