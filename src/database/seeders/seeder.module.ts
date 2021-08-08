import { Logger, Module } from '@nestjs/common'

import {
  UserModule,
  RoleModule,
  DocumentTypeModule
} from '../../repositories'
import { DatabaseModule } from '../database.module'
import { DocumentTypeSeederService } from './documentType/documentType.service'
import { RoleSeederService } from './role/role.service'
import { Seeder } from './seeder'
import { UserSeederService } from './user/user.service'

/**
 * Import and provide seeder classes.
 *
 * @module
 */
@Module({
  imports: [
    DatabaseModule,
    UserModule,
    RoleModule,
    DocumentTypeModule
  ],
  providers: [
    Logger,
    Seeder,
    UserSeederService,
    RoleSeederService,
    DocumentTypeSeederService,
  ],
})
export class SeederModule {}
