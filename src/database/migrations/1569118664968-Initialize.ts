import {
  Table,
  QueryRunner,
  MigrationInterface
} from 'typeorm'

import { UserStatus, User } from '../../models/user'
import { DefaultRole, Role } from '../../models/role'
import { DefaultDocumentType, DocumentType } from '../../models/documentType'
import { encryptPassword } from '../../auth'
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
        { name: FOREIGN_KEYS.DOCUMENT_TYPE_ID, type: COLUMN_TYPES.INT },
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

    console.log('************** INSERT DEFAULT DATA **************')

    // INSERT DATA
    const userRole = new Role(DefaultRole.User)
    userRole.name = 'User'
    await queryRunner.manager.save(userRole)

    const adminRole = new Role(DefaultRole.Admin)
    adminRole.name = 'Admin'
    await queryRunner.manager.save(adminRole)

    const citizenshipCardDocumentType = new DocumentType(DefaultDocumentType.CitizenshipCard)
    citizenshipCardDocumentType.name = 'Citizenship card'
    await queryRunner.manager.save(citizenshipCardDocumentType)

    const passportDocumentType = new DocumentType(DefaultDocumentType.Passport)
    passportDocumentType.name = 'Passport'
    console.log(await queryRunner.manager.save(passportDocumentType))

    const encryptedPassword = await encryptPassword('1111')
    const currentdate = new Date()
    const user = new User('1234')
    user.password = encryptedPassword
    user.email = 'jdnichollsc@hotmail.com'
    user.firstName = 'Juan David'
    user.lastName = 'Nicholls Cardona'
    user.address = 'XXX XX XX'
    user.phoneNumber = 'XXX-XX-XX'
    user.birthdate = currentdate.toISOString()
    user.documentType = passportDocumentType
    user.role = adminRole
    user.termsAndConditions = true
    user.status = UserStatus.Active
    user.createDate = currentdate
    user.updateDate = currentdate
    await queryRunner.manager.save(user)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    console.log('************** REMOVE PUBLIC SCHEMA **************')

    await queryRunner.dropTable(PUBLIC_TABLES.USER)
    await queryRunner.dropTable(PUBLIC_TABLES.DOCUMENT_TYPE)
    await queryRunner.dropTable(PUBLIC_TABLES.ROLE)
  }
}
