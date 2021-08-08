import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Role, RoleSchema } from '../../models/role'
import { RoleService } from './role.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])
  ],
  providers: [
    RoleService,
  ],
  exports: [RoleService]
})
export class RoleModule {}