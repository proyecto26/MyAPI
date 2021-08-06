import {
  Table,
  QueryRunner,
  MigrationInterface
} from 'typeorm'

import { encryptPassword } from '../../auth'
import { UserStatus, User } from '../../models/user'
import { DefaultRole, Role } from '../../models/role'
import { DefaultDocumentType, DocumentType } from '../../models/documentType'
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
          isGenerated: true,
          generationStrategy: 'increment'
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
          isGenerated: true,
          generationStrategy: 'increment'
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
    const userRole = new Role({ id: DefaultRole.User, name: 'User' })
    await queryRunner.manager.save(userRole)

    const adminRole = new Role({ id: DefaultRole.Admin, name: 'Admin' })
    await queryRunner.manager.save(adminRole)

    const citizenshipCardDocumentType = new DocumentType({ id: DefaultDocumentType.CitizenshipCard, name: 'Citizenship card' })
    await queryRunner.manager.save(citizenshipCardDocumentType)

    const passportDocumentType = new DocumentType({ id: DefaultDocumentType.Passport, name: 'Passport' })
    await queryRunner.manager.save(passportDocumentType)

    const encryptedPassword = await encryptPassword('1111')
    const currentdate = new Date()
    const user = new User({
      id: '1234',
      password: encryptedPassword,
      email: 'jdnichollsc@hotmail.com',
      firstName: 'Juan David',
      lastName: 'Nicholls Cardona',
      address: 'Calle de la Perla, 13',
      phoneNumber: '+34 958 888 888',
      birthdate: currentdate,
      documentType: passportDocumentType,
      role: adminRole,
      status: UserStatus.Active,
      termsAndConditions: true,
      createDate: currentdate,
      updateDate: currentdate
    })
    await queryRunner.manager.save(user)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    console.log('************** REMOVE PUBLIC SCHEMA **************')

    await queryRunner.dropTable(PUBLIC_TABLES.USER)
    await queryRunner.dropTable(PUBLIC_TABLES.DOCUMENT_TYPE)
    await queryRunner.dropTable(PUBLIC_TABLES.ROLE)
  }
}
